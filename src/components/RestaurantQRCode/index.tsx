'use client';

import { Component, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import QRCode from 'react-qr-code';
import { loadRestaurantLogo, restaurantQRLogo, type QRStatus } from './logo';
import styles from './RestaurantQRCode.module.scss';

type Props = { value: string; restaurantId: string; size: number; label: string; onStatus?: (status: QRStatus) => void };

class GenerationBoundary extends Component<Props & { children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onStatus?.({ value: this.props.value, restaurantId: this.props.restaurantId, status: 'error' }); }
  render() {
    return this.state.failed ? <p role="alert" className={styles.message}>QR code cannot be generated for this URL. Try a shorter URL.</p> : this.props.children;
  }
}

function Artwork({ value, restaurantId, size, label, onStatus }: Props) {
  const logo = restaurantQRLogo(restaurantId);
  const [asset, setAsset] = useState<{ status: 'loading' | 'ready' | 'error'; data?: string }>({ status: 'loading' });
  const [modules, setModules] = useState(21);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let active = true;
    if (!logo) return;
    loadRestaurantLogo(logo).then(data => { if (active) setAsset({ status: 'ready', data }); })
      .catch(() => { if (active) setAsset({ status: 'error' }); });
    return () => { active = false; };
  }, [logo]);

  useLayoutEffect(() => {
    const matrix = ref.current?.querySelector('svg');
    if (matrix) setModules(matrix.viewBox.baseVal.width);
  }, [asset.status]);

  useEffect(() => {
    if (!logo || asset.status === 'error') onStatus?.({ value, restaurantId, status: 'error' });
    else if (asset.status === 'ready') onStatus?.({ value, restaurantId, status: 'ready' });
  }, [asset.status, logo, onStatus, restaurantId, value]);

  if (!logo || asset.status === 'error') return <p role="alert" className={styles.message}>Could not load restaurant logo. Reload the page to try again.</p>;
  if (asset.status === 'loading') return <p role="status" className={styles.message}>Loading QR code…</p>;

  // The nested QR SVG exposes the actual module count. Reserve four modules on every side.
  const quiet = 4 * 256 / modules;
  const extent = 256 + quiet * 2;
  return <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size}
    viewBox={`${-quiet} ${-quiet} ${extent} ${extent}`} role="img" aria-label={label}
    data-restaurant-qr={restaurantId} className={styles.code}>
    <rect x={-quiet} y={-quiet} width={extent} height={extent} fill="#fff"/>
    <QRCode value={value} size={256} level="H" bgColor="#fff" fgColor="#000" shapeRendering="crispEdges" aria-hidden="true" style={{ width: 256, height: 256 }}/>
    <circle cx="128" cy="128" r={256 * 0.14} fill="#fff"/>
    <image href={asset.data} x={128 - 256 * 0.1} y={128 - 256 * 0.1} width={256 * 0.2} height={256 * 0.2} preserveAspectRatio="xMidYMid meet"/>
  </svg>;
}

export default function RestaurantQRCode(props: Props) {
  // Remount the boundary and loading state when either the payload or branding changes.
  return <GenerationBoundary key={`${props.restaurantId}\0${props.value}`} {...props}><Artwork {...props}/></GenerationBoundary>;
}
