import { normalizeHost, temporaryAdminHost } from '@/config/hosts';

export function isAdminHost(host: string | null) {
    const hostname = normalizeHost(host);
    return hostname === 'admin.papapasta.pl' || hostname === temporaryAdminHost || (process.env.NODE_ENV !== 'production' && hostname === 'admin.localhost');
}
