// Explicit temporary deployment only; never trust arbitrary *.sslip.io hostnames.
export const temporarySiteHost = 'fwos8o44go04wg8gc4cwsows.178.104.181.157.sslip.io';
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
