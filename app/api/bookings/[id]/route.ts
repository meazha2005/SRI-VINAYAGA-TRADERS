import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await query('UPDATE svt_web_bookings SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'Booking status updated' });
  } catch (error) {
    console.error('PUT /api/bookings/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await query('DELETE FROM svt_web_bookings WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('DELETE /api/bookings/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete booking' }, { status: 500 });
  }
}
