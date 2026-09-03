import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const family = searchParams.get('family') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    // 1. Build main products query
    let query = supabaseAdmin
      .from('perfumes')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,sku.ilike.%${search}%,full_name.ilike.%${search}%`);
    }
    if (brand && brand !== 'all') {
      query = query.eq('brand', brand);
    }
    if (family && family !== 'all') {
      query = query.eq('family', family);
    }

    const { data, count, error } = await query
      .order('brand', { ascending: true })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // 2. Fetch distinct brands list for the filter dropdown
    const { data: brandsData } = await supabaseAdmin
      .from('perfumes')
      .select('brand');

    const uniqueBrands = Array.from(new Set((brandsData || []).map((b: any) => b.brand).filter(Boolean))).sort();

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      brands: uniqueBrands
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = req.cookies.get('nico_admin_session');
    const authHeader = req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_SECRET_PIN || 'nico2026';

    const isAuthenticated = session?.value === 'authenticated_admin' || authHeader === expectedPin;
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, price, original_price, wholesale_price, stock, is_best_seller, is_new } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    const updates: any = {};
    if (price !== undefined) updates.price = price;
    if (original_price !== undefined) updates.original_price = original_price;
    if (wholesale_price !== undefined) updates.wholesale_price = wholesale_price;
    if (stock !== undefined) updates.stock = stock;
    if (is_best_seller !== undefined) updates.is_best_seller = is_best_seller;
    if (is_new !== undefined) updates.is_new = is_new;

    const { data, error } = await supabaseAdmin
      .from('perfumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
