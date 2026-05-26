import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await query('UPDATE svt_web_contact_messages SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('PUT /api/contact/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await query('DELETE FROM svt_web_contact_messages WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('DELETE /api/contact/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
