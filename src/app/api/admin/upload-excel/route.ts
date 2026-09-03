import { NextRequest, NextResponse } from 'next/server';
import { processExcelBuffer } from '@/lib/excel-processor';

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('nico_admin_session');
    const authHeader = req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_SECRET_PIN || 'nico2026';

    const isAuthenticated = session?.value === 'authenticated_admin' || authHeader === expectedPin;
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado. Inicie sesión como administrador.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const retailMarkupStr = formData.get('retailMarkup') as string | null;
    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo Excel.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processExcelBuffer(buffer, {
      filename: file.name,
      uploadedBy: 'Nico Admin'
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Error al procesar archivo' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error processing Excel:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al procesar el archivo Excel' },
      { status: 500 }
    );
  }
}
