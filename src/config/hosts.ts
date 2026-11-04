// Explicit temporary deployment only; only the exact configured hosts are trusted.
export const temporarySiteHost = 'workbase.sbs';
export const temporaryAdminHost = `admin.${temporarySiteHost}`;
export const temporaryCentroHost = `centro.${temporarySiteHost}`;

export function normalizeHost(host: string | null) {
  return (host ?? '').toLowerCase().replace(/:\d+$/, '');
}

export function isTemporaryHost(host: string | null) {
  return [temporarySiteHost, temporaryAdminHost, temporaryCentroHost].includes(normalizeHost(host));
}

export function centroPreviewURL(hostname: string, protocol: string, port: string) {
  return isTemporaryHost(hostname) ? `${protocol}//${temporaryCentroHost}${port ? ':' + port : ''}/` : undefined;
}
