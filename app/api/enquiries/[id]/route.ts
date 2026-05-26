import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!['new', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }
    await query('UPDATE svt_web_enquiries SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'Enquiry status updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await query('DELETE FROM svt_web_enquiries WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
