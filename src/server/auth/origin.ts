export function isAdminHost(host: string | null) {
    const hostname = (host ?? '').toLowerCase().replace(/:\d+$/, '');
    return hostname === 'admin.papapasta.pl' || (process.env.NODE_ENV !== 'production' && hostname === 'admin.localhost');
}
