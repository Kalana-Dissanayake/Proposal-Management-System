import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage  = pathname === '/login';
  const isApiRoute   = pathname.startsWith('/api');
  const isPublicApi  = pathname.startsWith('/api/public') || pathname.startsWith('/api/setup');

  // Handle CORS preflight requests for public APIs
  if (req.method === 'OPTIONS' && isPublicApi) {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  let res = NextResponse.next();

  if (isApiRoute && !isPublicApi) {
    // API auth is handled inside each route handler
    return res;
  }

  if (!token && !isLoginPage && !isApiRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Add CORS headers to all public API responses
  if (isPublicApi) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
