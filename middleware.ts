import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/signup' || path.startsWith('/q/');

    const token = request.cookies.get('session')?.value;
    let session = null;

    if (token) {
        session = await verifyToken(token);
    }

    // Redirect to login if accessing protected route without session
    if (!isPublicPath && !session) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Redirect to home if accessing auth pages with session
    if ((path === '/login' || path === '/signup') && session) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
