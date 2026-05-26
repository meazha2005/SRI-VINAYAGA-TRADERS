import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ success: false, error: 'Name, phone and message are required' }, { status: 400 });
    }

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 });
    }

    await query(
      'INSERT INTO svt_web_contact_messages (name, phone, email, message) VALUES (?, ?, ?, ?)',
      [name.trim(), phone.trim(), email?.trim() || null, message.trim()]
    );

    return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await query(
      'SELECT * FROM svt_web_contact_messages ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
