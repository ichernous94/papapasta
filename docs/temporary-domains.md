# Exact temporary deployment hosts

The current temporary deployment base is `workbase.sbs`.

Supported hosts:

- PapaPasta/landing: `https://workbase.sbs`
- Centro: `https://centro.workbase.sbs`
- Admin: `https://admin.workbase.sbs`

These exact names are centralized in `src/config/hosts.ts`. Proxy selects the same internal restaurant/admin branches as the real domains; the auth route, auth hooks and server guards all recognize the exact temporary admin host through the existing shared isAdminHost check. No wildcard domain or suffix match is permitted. Internal /site-admin and /site-centro addresses remain blocked. Temporary page responses have noindex/nofollow headers; existing canonical metadata remains on the real restaurant domains.

The landing Centro link changes to the temporary Centro hostname after hydration when viewed on this exact preview deployment, preserving HTTP/HTTPS and the port. Real-domain and localhost behavior is retained.

## Coolify setup after deploying these changes

Register all three hostnames with the same Coolify application; adding a prefix in the browser does not add a reverse-proxy route. Configure HTTPS for all three hosts and use the same existing container port. Point the @, centro and admin DNS records to the application server; use DNS only for initial certificate verification. Configure the admin origin:

```dotenv
BETTER_AUTH_URL=https://admin.workbase.sbs
```

Keep BETTER_AUTH_SECRET unchanged. The trusted auth origin continues to derive from BETTER_AUTH_URL. Production Secure/HttpOnly host-only cookies, CSRF/origin checks and mandatory MFA are unchanged. An HTTP admin page may render, but production login requires working HTTPS and its matching BETTER_AUTH_URL; HTTP cookies are not enabled. The former generated sslip.io aliases are no longer recognized by the application. Remove their Coolify routes after registering the workbase.sbs hosts.

This code change does not configure Coolify, DNS or TLS remotely, and does not edit working environment files. When moving to production domains, set BETTER_AUTH_URL back to https://admin.papapasta.pl and remove the temporary aliases from the central config/proxy/auth/link integration when no longer needed.

## Validation

- Exact temporary host rewrites, query preservation and noindex responses.
- Admin authentication host acceptance, case/port normalization, rejection of public/Centro/suffix-spoofed/previous sslip.io hosts.
- Technical path blocking and API pass-through.
- Landing destination isolation to the explicit deployment.
- Existing real-domain and localhost routing regressions retained.
- Targeted tests, production-mode host tests, ESLint and TypeScript checked locally. No claim is made that the three remote domains or TLS have been configured; this remains a Coolify deployment step.

Changes: new hosts config and temporary-host tests; proxy, auth origin helper, landing CentroLink and the in-memory TS loader in Centro tests; architecture/admin documentation and this guide. No migration, storage or dependency changes.
