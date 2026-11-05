import { Suspense, type ComponentProps } from 'react';
import ImageBanner from '@/components/ImageBanner';
import { menuHeadings } from '@/config/menu-headings';
import { publicMenuState } from '@/server/content/public';
import { findMenuSection } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = Omit<ComponentProps<typeof ImageBanner>, 'title' | 'subtitle' | 'content'> & { restaurantId: RestaurantId; menuKey: string };
async function ResolvedBanner({ restaurantId, menuKey, ...props }: Props) {
  const fallback = (menuHeadings[restaurantId] as Record<string, { title: string; subtitle: string }>)[menuKey];
  const menu = findMenuSection(await publicMenuState(restaurantId), restaurantId, menuKey);
  return <ImageBanner {...props} restaurantId={restaurantId} revealKey={`menu:${menuKey}`} title={menu?.title ?? fallback.title} subtitle={menu?.subtitle ?? fallback.subtitle} image={menu?.bannerImage ?? props.image}/>;
}
export default function MenuBanner(props: Props) {
  const fallback = (menuHeadings[props.restaurantId] as Record<string, { title: string; subtitle: string }>)[props.menuKey];
  return <Suspense fallback={<ImageBanner {...props} {...fallback} revealKey={`menu:${props.menuKey}`}/>}><ResolvedBanner {...props}/></Suspense>;
}
