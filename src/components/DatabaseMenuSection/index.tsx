import { menuText } from '@/utils/menuText';
import { Suspense } from 'react';
import MenuList from '@/components/MenuList';
import MenuTabs from '@/components/MenuTabs';
import MenuSkeleton from '@/components/MenuSkeleton';
import MenuState from '@/components/MenuState';
import { publicMenuState } from '@/server/content/public';
import { findMenuSection, hasPublishedItems, publishedCategories } from '@/server/content/menu-state';
import type { RestaurantId } from '@/server/content/dishes';

type Props = { restaurantId: RestaurantId; menuKey: string; tabs?: boolean | 'auto'; label?: string; columns?: 2; noteClassName?: string };

async function Content({ restaurantId, menuKey, tabs = false, label = 'Kategorie menu', columns, noteClassName }: Props) {
  const state = await publicMenuState(restaurantId);
  if (state.status === 'error') return <MenuState error/>;
  const menu = findMenuSection(state, restaurantId, menuKey);
  if (!menu || !hasPublishedItems(menu)) return <MenuState/>;
  const categories = publishedCategories(menu);
  const renderTabs = tabs === true || (tabs === 'auto' && categories.length > 1);
  return renderTabs ? <MenuTabs variant={restaurantId} label={label} tabs={categories.map(category => ({
    id: category.id, label: category.label, content: <>
      {category.note && <p className={noteClassName}>{menuText(category.note)}</p>}
      {category.groups.some(group => group.items.length) ? <MenuList variant={restaurantId} groups={category.groups} columns={category.columns} columnBreak={category.columnBreak}/> : <MenuState/>}
    </>,
  }))}/> : <>{categories[0]?.note && <p className={noteClassName}>{menuText(categories[0].note)}</p>}<MenuList variant={restaurantId} groups={categories.flatMap(category => category.groups)} columns={columns}/></>;
}

export default function DatabaseMenuSection(props: Props) {
  return <Suspense fallback={<MenuSkeleton restaurantId={props.restaurantId} showTabs={!!props.tabs}/>}><Content {...props}/></Suspense>;
}
