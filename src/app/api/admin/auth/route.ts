import { NextRequest, NextResponse } from 'next/server';

const VALID_USERS = ['admin', 'nico', 'nico@nicoperfume.cl', process.env.ADMIN_USER || 'admin'];
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'NicoPerfume2026!';
const DEFAULT_PIN = process.env.ADMIN_SECRET_PIN || 'nico2026';

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json(
        { success: false, message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

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
