import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const categories = await query('SELECT * FROM svt_web_categories ORDER BY name ASC');
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}
