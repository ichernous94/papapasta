import { Suspense } from 'react';
import ImageBanner from '@/components/ImageBanner';
import DatabaseMenuSection from '@/components/DatabaseMenuSection';
import Container from '@/components/ui/Container';
import MenuSkeleton from '@/components/MenuSkeleton';
import MenuState from '@/components/MenuState';
import { steakAndSides } from '@/config/papapasta-images';
import { centroImages } from '@/config/centro-images';
import { publicMenuState } from '@/server/content/public';
import { additionalMenuSections } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = { restaurantId: RestaurantId; className?: string; noteClassName?: string };
async function Content({ restaurantId, className, noteClassName }: Props) {
  const state = await publicMenuState(restaurantId);
  if (state.status === 'error') return <Container><MenuState error/></Container>;
  const fallback = restaurantId === 'centro' ? centroImages.platter : steakAndSides;
  return additionalMenuSections(state, restaurantId).map(menu => <div key={menu.id}>
    <ImageBanner restaurantId={restaurantId} revealKey={`menu:${menu.key}`} title={menu.title} subtitle={menu.subtitle} image={menu.bannerImage ?? fallback}/>
    <Container as="section" className={className} aria-label={menu.title}>
      <DatabaseMenuSection restaurantId={restaurantId} menuKey={menu.key} tabs noteClassName={noteClassName}/>
    </Container>
  </div>);
}
export default function AdditionalMenuSections(props: Props) {
  return <Suspense fallback={<Container><MenuSkeleton restaurantId={props.restaurantId}/></Container>}><Content {...props}/></Suspense>;
}
