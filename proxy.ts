import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSystemInstalled } from '@/lib/auth/install-guard';

/**
 * Next.js 16 Proxy convention (successor to middleware.ts).
 * Runs on the Node.js runtime to handle early redirects for:
 * 1. Install Guard — Redirects uninstalled systems to /install, and locks /install once installed.
 * 2. Auth Guard — Protects /settings and /[router-session]/* routes, and redirects authenticated users away from /login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Install Guard Check
  const installed = await isSystemInstalled();

  if (!installed) {
    // If not installed, allow /install and api routes
    if (pathname.startsWith('/install') || pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/install', request.url));
  }

  // If installed, block /install
  if (pathname.startsWith('/install')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Auth Guard Check
  const hasSessionToken =
    request.cookies.has('better-auth.session_token') ||
    request.cookies.has('__Secure-better-auth.session_token');

  const isAuthRoute = pathname.startsWith('/login');
  const isDashboardRoute =
    pathname.startsWith('/settings') ||
    /^\/[^/]+\/(dashboard|users|profiles|vouchers|active|hosts|cookies|logs|quick-print|traffic|report)/.test(
      pathname,
    );

  // If already logged in, redirect away from /login to /settings
  if (hasSessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/settings', request.url));
  }

  // If unauthenticated, redirect protected dashboard routes to /login
  if (!hasSessionToken && isDashboardRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image/asset files (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
