export async function restaurantQRPNG(svg: SVGSVGElement) {
  if (!svg.matches('[data-restaurant-qr]') || !svg.querySelector('image')?.getAttribute('href')?.startsWith('data:')) throw new Error('Branded QR is not ready');
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('width', '1024');
  copy.setAttribute('height', '1024');
  const objectURL = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.src = objectURL;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.drawImage(image, 0, 0, 1024, 1024);
    return canvas.toDataURL('image/png');
  } finally { URL.revokeObjectURL(objectURL); }
}
