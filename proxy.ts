import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/auth', '/forbidden'];
const ADMIN_PATHS = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get access token from cookie
  const token = request.cookies.get('access_token')?.value;

  let payload: any = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      payload = null;
    }
  }

  // If user is successfully logged in and visiting auth or landing page, take them to dashboard
  if (payload && (pathname === '/' || pathname.startsWith('/auth'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If user is NOT logged in, allow them to view public paths and the landing page (/)
  if (pathname === '/' || PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const response = NextResponse.next();
    if (token && !payload) {
      response.cookies.delete('access_token');
    }
    return response;
  }

  // If we reach here, it's a protected path. Check if we have a valid payload.
  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    if (pathname !== '/') {
      url.searchParams.set('callbackUrl', pathname);
    }
    const response = NextResponse.redirect(url);
    if (token) {
      response.cookies.delete('access_token');
    }
    return response;
  }

  // Per D-11: role violations redirect to /forbidden
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    if (payload.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
