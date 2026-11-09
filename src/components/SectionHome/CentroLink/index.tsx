'use client';

import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react';
import { centroPreviewURL } from '@/config/hosts';

const subscribe = () => () => {};

type CentroLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function CentroLink({ href, ...props }: CentroLinkProps) {
  const destination = useSyncExternalStore(subscribe, () => {
    const { hostname, protocol, port } = window.location;
    const preview = centroPreviewURL(hostname, protocol, port);
    if (preview) return preview;
    if (process.env.NODE_ENV !== 'development') return href;
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname) || hostname.endsWith('.localhost');
    return local ? `${protocol}//centro.localhost${port ? ':' + port : ''}/` : href;
  }, () => href);

  return <a {...props} href={destination} />;
}
