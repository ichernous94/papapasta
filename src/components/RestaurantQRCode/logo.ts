export type QRStatus = { value: string; restaurantId: string; status: 'ready' | 'error' };

export function restaurantQRLogo(restaurantId: string) {
  if (restaurantId === 'papapasta') return '/icons/logo_papapasta_dark.svg';
  if (restaurantId === 'centro') return '/icons/centro_logo_qr.svg';
  return undefined;
}

const logos = new Map<string, Promise<string>>();

export function loadRestaurantLogo(src: string) {
  let task = logos.get(src);
  if (!task) {
    task = (async () => {
      const response = await fetch(src);
      if (!response.ok) throw new Error('Logo unavailable');
      const blob = await response.blob();
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Logo unavailable'));
        reader.readAsDataURL(blob);
      });
      // Decode before enabling export, so broken assets cannot silently become an unbranded QR.
      const image = new Image();
      image.src = data;
      await image.decode();
      return data;
    })().catch(error => { logos.delete(src); throw error; });
    logos.set(src, task);
  }
  return task;
}
