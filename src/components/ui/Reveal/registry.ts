export type RevealRegistry = Map<string, { owner: object; started: boolean }>;

export function reserveReveal(registry: RevealRegistry, key: string, owner: object) {
  if (registry.has(key)) return false;
  registry.set(key, { owner, started: false });
  return true;
}
export function startReveal(registry: RevealRegistry, key: string, owner: object) {
  const claim = registry.get(key);
  if (claim?.owner === owner) claim.started = true;
}
export function releasePendingReveal(registry: RevealRegistry, key: string, owner: object) {
  const claim = registry.get(key);
  if (claim?.owner === owner && !claim.started) registry.delete(key);
}
