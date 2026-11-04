import { NextRequest, NextResponse } from 'next/server';
import { isTemporaryHost, normalizeHost, temporaryAdminHost, temporaryCentroHost } from '@/config/hosts';

const internalPrefix = '/site-centro';
const adminPrefix = '/site-admin';
const adminHosts = new Set(['admin.papapasta.pl', 'admin.localhost', temporaryAdminHost]);
const centroHosts = new Set(['centro.papapasta.pl', 'centro.localhost', temporaryCentroHost]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let decodedPath: string;
  try { decodedPath = decodeURIComponent(pathname).toLowerCase(); }
  catch { return new NextResponse('Invalid path', { status: 400 }); }
  if ([internalPrefix, adminPrefix].some(prefix => decodedPath === prefix || decodedPath.startsWith(prefix + '/'))) {
    return new NextResponse('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });
  }
  const host = normalizeHost(request.headers.get('host') ?? request.nextUrl.host);
  if (adminHosts.has(host)) {
    if (/^\/(api|_next|images|icons|videos|fonts|documents)(\/|$)/.test(pathname) || pathname === '/favicon.ico') return NextResponse.next();
    const destination = request.nextUrl.clone();
    destination.pathname = adminPrefix + (pathname === '/' ? '' : pathname);
    const response = NextResponse.rewrite(destination);
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  if (!centroHosts.has(host)) {
    const response = NextResponse.next();
    if (isTemporaryHost(host)) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  if (/^\/(api|_next|images|icons|videos|fonts|documents)(\/|$)/.test(pathname) || pathname === '/favicon.ico') return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = internalPrefix + (pathname === '/' ? '' : pathname);
  const response = NextResponse.rewrite(destination);
  if (isTemporaryHost(host)) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/|images/|icons/|videos/|fonts/|documents/|favicon.ico).*)'],
};
