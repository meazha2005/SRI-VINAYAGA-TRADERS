import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let sql = 'SELECT * FROM svt_web_products WHERE 1=1';
    const values: unknown[] = [];

    if (category && category !== 'all') {
      sql += ' AND category_slug = ?';
      values.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      values.push(s, s, s);
    }

    if (featured === 'true') {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY is_featured DESC, sort_order ASC, created_at DESC';

    if (limit) {
      sql += ` LIMIT ${parseInt(limit)}`;
    }

    const products = await query<Product[]>(sql, values);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, slug, category_id, category_slug, description, details,
      price_label, availability, brand, image_url, is_featured, sort_order
    } = body;

    if (!name || !slug || !category_slug) {
      return NextResponse.json({ success: false, error: 'Name, slug, and category are required' }, { status: 400 });
    }

    await query(
      `INSERT INTO svt_web_products 
       (name, slug, category_id, category_slug, description, details, price_label, availability, brand, image_url, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, category_id || null, category_slug, description || null, details || null,
       price_label || 'Call for Price', availability || 'in_stock', brand || null,
       image_url || null, is_featured ? 1 : 0, sort_order || 0]
    );

    return NextResponse.json({ success: true, message: 'Product created' }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/products error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: 'A product with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
