// Rewrites can expose the internal pathname during the server render.
export function restaurantPath(pathname: string) {
  if (pathname === '/site-centro') return '/';
  return pathname.startsWith('/site-centro/') ? pathname.slice('/site-centro'.length) : pathname;
}
