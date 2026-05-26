import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, items, notes } = body;

    if (!name || !phone || !items?.length) {
      return NextResponse.json({ success: false, error: 'Name, phone and items are required' }, { status: 400 });
    }

    await query(
      'INSERT INTO svt_web_enquiries (name, phone, email, items, notes) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), phone.trim(), email?.trim() || null, JSON.stringify(items), notes?.trim() || null]
    );

    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit enquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enquiries = await query('SELECT * FROM svt_web_enquiries ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('GET /api/enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
