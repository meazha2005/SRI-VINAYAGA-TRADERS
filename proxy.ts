import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'svt_admin_session';
const SESSION_VALUE = 'authenticated';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get(SESSION_COOKIE);
    if (session?.value !== SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === '/admin/login') {
    const session = request.cookies.get(SESSION_COOKIE);
    if (session?.value === SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
