import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const products = await query<Product[]>(
      'SELECT * FROM svt_web_products WHERE id = ?',
      [id]
    );
    if (!products.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: products[0] });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name, slug, category_id, category_slug, description, details,
      price_label, availability, brand, image_url, is_featured, sort_order
    } = body;

    await query(
      `UPDATE svt_web_products SET
        name=?, slug=?, category_id=?, category_slug=?, description=?, details=?,
        price_label=?, availability=?, brand=?, image_url=?, is_featured=?, sort_order=?
       WHERE id=?`,
      [name, slug, category_id || null, category_slug, description || null, details || null,
       price_label || 'Call for Price', availability || 'in_stock', brand || null,
       image_url || null, is_featured ? 1 : 0, sort_order || 0, id]
    );

    return NextResponse.json({ success: true, message: 'Product updated' });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await query('DELETE FROM svt_web_products WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
