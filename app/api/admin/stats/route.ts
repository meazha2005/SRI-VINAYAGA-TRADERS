import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [products, messages, newMessages, bookings, pendingBookings, enquiries, newEnquiries] = await Promise.all([
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_products'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_contact_messages'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_contact_messages WHERE status = "new"'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_bookings'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_bookings WHERE status = "pending"'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_enquiries'),
      query<{count: number}[]>('SELECT COUNT(*) as count FROM svt_web_enquiries WHERE status = "new"'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts: products[0].count,
        totalMessages: messages[0].count,
        newMessages: newMessages[0].count,
        totalBookings: bookings[0].count,
        pendingBookings: pendingBookings[0].count,
        totalEnquiries: enquiries[0].count,
        newEnquiries: newEnquiries[0].count,
      }
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
