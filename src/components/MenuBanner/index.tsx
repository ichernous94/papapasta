import { Suspense, type ComponentProps } from 'react';
import ImageBanner, { ImageBannerHeading } from '@/components/ImageBanner';
import { menuHeadings } from '@/config/menu-headings';
import { publicMenuState } from '@/server/content/public';
import { findMenuSection } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = Omit<ComponentProps<typeof ImageBanner>, 'title' | 'subtitle' | 'content'> & {
  restaurantId: RestaurantId; menuKey: string;
};
async function Heading({ restaurantId, menuKey, fallback, headingLevel }: Pick<Props, 'restaurantId' | 'menuKey' | 'headingLevel'> & { fallback: { title: string; subtitle: string } }) {
  const menu = findMenuSection(await publicMenuState(restaurantId), restaurantId, menuKey);
  return <ImageBannerHeading title={menu?.title ?? fallback.title} subtitle={menu?.subtitle ?? fallback.subtitle} headingLevel={headingLevel}/>;
}
export default function MenuBanner({ restaurantId, menuKey, ...props }: Props) {
  const headings: Record<string, { title: string; subtitle: string }> = menuHeadings[restaurantId];
  const fallback = headings[menuKey];
  return <ImageBanner {...props} {...fallback} content={<Suspense fallback={<ImageBannerHeading {...fallback} headingLevel={props.headingLevel}/>}>
    <Heading restaurantId={restaurantId} menuKey={menuKey} fallback={fallback} headingLevel={props.headingLevel}/>
  </Suspense>}/>;
}
