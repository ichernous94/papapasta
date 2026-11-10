// A reserved Centro promotion record stores popup settings independently of public articles.
export const CENTRO_POPUP_SLUG = 'centro-promotion-popup';
export const defaultPromotionPopup = {
  id: '668d54f7-97f8-4cb2-a46a-7d4a113cdbf6', restaurantId: 'centro', slug: CENTRO_POPUP_SLUG,
  // Keep it a draft for older article readers, including during deployment transitions.
  title: 'Rozgrzewające menu — Włoska Jesień', date: '2026-11-10', published: false,
  staticImage: '/images/promotional/promotional-image.jpg', imageAlt: 'Rozgrzewające menu — Włoska Jesień, Papa Pasta Centro',
  body: [{ type: 'paragraph' as const, enabled: true, text: [
    'Papa Pasta Centro',
    'Crème Brulée — 38 zł. Kremowy, deserowy koktajl na rumie z nutą wanilii, Cointreau i aksamitną pianką.',
    'Vanilla Pear — 37 zł. Rześki gin sour z soczystą gruszką, waniliowym akcentem i delikatną pianką.',
    'Aperol Martini — 38 zł. Tequila reposado i Aperol w duecie z cydrem, limonką oraz pikantnym miodem.',
    'Golden Fall — 39 zł. Bourbon Maker’s Mark i amaretto w słodko-kwaśnym wydaniu z cynamonem i pianką.',
    'Cinnamone Fashion — 39 zł, pikantny. Korzenny miks bourbonu i Jack Daniel’s Fire ze słodkim cynamonem oraz rześkim cydrem.',
  ].join('\n\n') }],
};
export function popupEnabled(row: { published: boolean; body: { text: string }[] }) {
  const settings = row.body[0] as { enabled?: boolean } | undefined;
  return typeof settings?.enabled === 'boolean' ? settings.enabled : row.published;
}
