import { NextRequest, NextResponse } from 'next/server';

const internalPrefix = '/site-centro';
const centroHosts = new Set(['centro.papapasta.pl', 'centro.localhost']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === internalPrefix || pathname.startsWith(internalPrefix + '/')) {
    return new NextResponse('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });
  }
  const host = (request.headers.get('host') ?? request.nextUrl.host).toLowerCase().replace(/:\d+$/, '');
  if (!centroHosts.has(host)) return NextResponse.next();
  if (/^\/(api|_next|images|icons|videos|fonts|documents)(\/|$)/.test(pathname) || pathname === '/favicon.ico') return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = internalPrefix + (pathname === '/' ? '' : pathname);
  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ['/((?!api/|_next/|images/|icons/|videos/|fonts/|documents/|favicon.ico).*)'],
};
