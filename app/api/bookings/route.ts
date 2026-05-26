import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, preferred_date, preferred_time, items_description, notes } = body;

    if (!name || !phone || !address || !preferred_date) {
      return NextResponse.json({ success: false, error: 'Name, phone, address and date are required' }, { status: 400 });
    }

    await query(
      `INSERT INTO svt_web_bookings 
       (name, phone, email, address, preferred_date, preferred_time, items_description, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone.trim(), email?.trim() || null, address.trim(),
       preferred_date, preferred_time || null, items_description?.trim() || null, notes?.trim() || null]
    );

    return NextResponse.json({ success: true, message: 'Booking submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await query('SELECT * FROM svt_web_bookings ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
