// Presentation only: preserve stored prices and PLN in structured data.
export function menuText(value: string): string {
  return value.replace(/(\d)([\t \u00a0]*)(?:zł|PLN)(?![\p{L}\p{N}_])/giu, '$1').trim();
}
