import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/server/auth';
import { isAdminHost } from '@/server/auth/origin';
async function handler(request: Request) {
    if (!isAdminHost(request.headers.get('host')))
        return new Response('Not found', { status: 404 });
    const handlers = toNextJsHandler(getAuth());
    const response = await handlers[request.method === 'GET' ? 'GET' : 'POST'](request);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
}
export { handler as GET, handler as POST };
