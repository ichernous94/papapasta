import { Suspense, type ReactNode } from 'react';
import MenuSkeleton from '@/components/MenuSkeleton';
import MenuState from '@/components/MenuState';
import Container from '@/components/ui/Container';
import { publicMenuState } from '@/server/content/public';
import { findMenuSection } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = { restaurantId: RestaurantId; menuKey: string; children: ReactNode };
async function ExistingSection({ restaurantId, menuKey, children }: Props) {
  const state = await publicMenuState(restaurantId);
  if (state.status === 'error') return <Container><MenuState error/></Container>;
  return findMenuSection(state, restaurantId, menuKey) ? children : null;
}
export default function OptionalMenuSection(props: Props) {
  return <Suspense fallback={<Container><MenuSkeleton restaurantId={props.restaurantId} showTabs={false}/></Container>}><ExistingSection {...props}/></Suspense>;
}
