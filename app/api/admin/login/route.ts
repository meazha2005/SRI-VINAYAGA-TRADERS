import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    const valid = await verifyAdminCredentials(username, password);

    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true, message: 'Logged in' });
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
