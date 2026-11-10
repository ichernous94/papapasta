import { Suspense } from 'react';
import { RecommendationHeading, RecommendationList, RecommendationsFrame } from '@/components/Recommendations';
import MenuSkeleton from '@/components/MenuSkeleton';
import MenuState from '@/components/MenuState';
import { publicMenuState } from '@/server/content/public';
import { findMenuSection, hasPublishedItems, publishedCategories } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = { restaurantId: RestaurantId };
async function Heading({ restaurantId }: Props) {
  const menu = findMenuSection(await publicMenuState(restaurantId), restaurantId, 'recommendations');
  const heading = menu ?? { title: 'Z CAŁEGO SERCA', subtitle: 'polecamy' };
  return <RecommendationHeading title={heading.title} subtitle={heading.subtitle}/>;
}
async function Content({ restaurantId }: Props) {
  const state = await publicMenuState(restaurantId);
  if (state.status === 'error') return <MenuState error recommendations/>;
  const menu = findMenuSection(state, restaurantId, 'recommendations');
  if (!menu || !hasPublishedItems(menu)) return <MenuState recommendations/>;
  const items = publishedCategories(menu).flatMap(c => c.groups.flatMap(g => g.items)).map(i => ({ id: i.id, name: i.name, weight: i.portion, description: i.description.join('\n'), price: i.price, image: i.image }));
  return <RecommendationList items={items} restaurantId={restaurantId}/>;
}
export default function DatabaseRecommendations({ restaurantId }: Props) {
  return <RecommendationsFrame variant={restaurantId === 'centro' ? 'light' : 'dark'}
    heading={<Suspense fallback={<RecommendationHeading {...{ title: 'Z CAŁEGO SERCA', subtitle: 'polecamy' }}/>}><Heading restaurantId={restaurantId}/></Suspense>}>
    <Suspense fallback={<MenuSkeleton restaurantId={restaurantId} showTabs={false} rows={3}/>}><Content restaurantId={restaurantId}/></Suspense>
  </RecommendationsFrame>;
}
