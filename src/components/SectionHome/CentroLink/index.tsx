'use client';

import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react';
import Button from '@/components/ui/Button';

const subscribe = () => () => {};

type CentroLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function CentroLink({ href, ...props }: CentroLinkProps) {
  const destination = useSyncExternalStore(subscribe, () => {
    if (process.env.NODE_ENV !== 'development') return href;
    const { hostname, protocol, port } = window.location;
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname) || hostname.endsWith('.localhost');
    return local ? `${protocol}//centro.localhost${port ? ':' + port : ''}/` : href;
  }, () => href);

  return <Button {...props} href={destination} />;
}
