import { NextRequest, NextResponse } from 'next/server';

const VALID_USERS = ['admin', 'nico', 'nico@nicoperfume.cl', process.env.ADMIN_USER || 'admin'];
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'NicoPerfume2026!';
const DEFAULT_PIN = process.env.ADMIN_SECRET_PIN || 'nico2026';

// In-memory sliding window rate limiter
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { attempts: 0, blockedUntil: 0 };

    // Check if IP is currently blocked
    if (record.blockedUntil > now) {
      const remainingMinutes = Math.ceil((record.blockedUntil - now) / (60 * 1000));
      return NextResponse.json(
        { 
          success: false, 
          message: `Demasiados intentos fallidos. Por seguridad, tu acceso ha sido bloqueado temporalmente por ${remainingMinutes} minutos.` 
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password, pin } = body;

    let isAuthorized = false;

    // Check username + password
    if (username && password) {
      const userMatch = VALID_USERS.includes(username.trim().toLowerCase());
      const passMatch = password === DEFAULT_PASSWORD || password === DEFAULT_PIN;
      if (userMatch && passMatch) {
        isAuthorized = true;
      }
    } 
    // Fallback PIN check
    else if (pin && (pin === DEFAULT_PIN || pin === DEFAULT_PASSWORD)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      record.attempts += 1;
      if (record.attempts >= MAX_ATTEMPTS) {
        record.blockedUntil = now + BLOCK_DURATION_MS;
        rateLimitMap.set(ip, record);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Has superado el límite de 5 intentos. Acceso bloqueado por 15 minutos.' 
          },
          { status: 429 }
        );
      }
      rateLimitMap.set(ip, record);
      const remaining = MAX_ATTEMPTS - record.attempts;
      return NextResponse.json(
        { 
          success: false, 
          message: `Credenciales incorrectas. Te quedan ${remaining} intento${remaining === 1 ? '' : 's'}.` 
        },
        { status: 401 }
      );
    }

    // Success: reset attempts for this IP
    rateLimitMap.delete(ip);

    const response = NextResponse.json({
      success: true,
      message: 'Acceso autorizado',
      user: { role: 'admin', name: 'Nico Admin', username: username || 'admin' }
    });

    // Set secure cookie for session
    response.cookies.set('nico_admin_session', 'authenticated_admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error en la autenticación' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('nico_admin_session');
  if (session?.value === 'authenticated_admin') {
    return NextResponse.json({ authenticated: true, user: { role: 'admin', name: 'Nico Admin' } });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });
  response.cookies.delete('nico_admin_session');
  return response;
}
