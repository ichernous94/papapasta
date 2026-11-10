import type { createDatabase } from '@/server/db/connection';
import { restaurantGalleries, galleryEntries, promotions } from '@/server/db/schema';
import { defaultPromotionPopup } from '@/config/promotion-popup';
const defaults = {
  papapasta: [['pizza-preparation.jpg','Przygotowanie pizzy w Papa Pasta'],['wine-pouring.jpg','Nalewanie wina do kieliszka'],['steak-serving.jpg','Stek serwowany w Papa Pasta'],['restaurant-interior.jpg','Wnętrze restauracji Papa Pasta']],
  centro: [['bar-interior.jpg','Bar Papa Pasta Centro z pomarańczowymi fotelami'],['signature-cocktail.jpg','Autorski koktajl z owocami i rozmarynem'],['neon-sign.jpg','Neon Centro Papa Pasta'],['food-sharing-platter.jpg','Deska z owocami morza w Papa Pasta Centro']],
};
export async function seedSiteContent(db: ReturnType<typeof createDatabase>['db']) {
  await db.transaction(async tx => {
    for (const restaurantId of ['papapasta', 'centro'] as const) {
      // The persistent parent is the one-time initialization marker, including after all photos/articles are deleted.
      const created = await tx.insert(restaurantGalleries).values({ restaurantId }).onConflictDoNothing().returning();
      if (!created.length) continue;
      await tx.insert(galleryEntries).values(defaults[restaurantId].map(([file, alt], sortOrder) => ({ restaurantId, staticImage: `/images/${restaurantId}/${file}`, alt, sortOrder })));
      if (restaurantId === 'centro') await tx.insert(promotions).values({
        restaurantId, slug: 'zestawy-obiadowe', title: 'Więcej smaku za mniej – zestawy obiadowe w Papa Pasta Centro', date: '2025-10-28', published: true,
        staticImage: '/images/centro/post.jpg', imageAlt: 'Zestawy obiadowe Papa Pasta Centro, poniedziałek–piątek, 12:00–17:00',
        body: [
          { type: 'paragraph', text: 'Zapraszamy na zestawy obiadowe od poniedziałku do piątku, w godzinach 12:00–17:00, w Papa Pasta Centro przy ul. Jurowieckiej 11 w Białymstoku.' },
          { type: 'list', text: 'Zupa + dowolny makaron — 59 zł\nZupa + dowolna sałatka — 55 zł\nZupa + dowolna pizza — 57 zł' },
          { type: 'paragraph', text: 'Do zestawu zamów deser ze zniżką 50%.' },
          { type: 'paragraph', text: 'Odwiedź nas w porze obiadowej, wybierz swój zestaw i zakończ posiłek czymś słodkim.' },
        ],
      }).onConflictDoNothing();
    }
    await tx.insert(promotions).values(defaultPromotionPopup).onConflictDoNothing({ target: promotions.slug });
  });
}
