import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/auth', '/forbidden'];
const ADMIN_PATHS = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get access token from cookie
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // Per D-11: unauthenticated access redirects to /auth?callbackUrl=...
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Per D-11: role violations redirect to /forbidden
    if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
      if (payload.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/forbidden';
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch {
    // Token expired or invalid — redirect to auth
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(url);
    // Clear stale cookie
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
