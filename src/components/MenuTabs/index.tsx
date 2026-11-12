'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import usePanelClip from './usePanelClip';
import useCategoryTransition from './useCategoryTransition';
import styles from './MenuTabs.module.scss';
import type { FixedMenuKey } from '@/types/menu';
import { menuCategoryAnchor, readMenuHash } from '@/utils/menuAnchor';
import { navigateMenuAnchor } from '@/components/MenuAnchors';

type MenuTab = { id: string; label: string; content: ReactNode };
type MenuTabsProps = { label: string; tabs: readonly MenuTab[]; menuKey?: FixedMenuKey; variant?: 'default' | 'centro' | 'papapasta' };

function revealTab(list: HTMLDivElement, index: number, focus = false) {
  const tab = list.querySelectorAll<HTMLElement>('[role="tab"]')[index];
  if (!tab) return;
  if (focus) tab.focus({ preventScroll: true });
  const container = list.getBoundingClientRect();
  const bounds = tab.getBoundingClientRect();
  // Scroll only the horizontal tablist, keeping the document position intact.
  if (bounds.left < container.left) list.scrollLeft += bounds.left - container.left;
  else if (bounds.right > container.right) list.scrollLeft += bounds.right - container.right;
}

export default function MenuTabs({ label, tabs, menuKey, variant = 'default' }: MenuTabsProps) {
  const groupId = useId();
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const transition = useCategoryTransition(rootRef, stickyRef, variant !== 'default');
  usePanelClip(rootRef, stickyRef, variant !== 'default', tabs[active]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuKey) return;
    const restore = () => {
      const anchor = readMenuHash(window.location.hash);
      const index = tabs.findIndex(tab => menuCategoryAnchor(menuKey, tab.id) === anchor);
      if (index >= 0) setActive(index);
    };
    restore();
    window.addEventListener('hashchange', restore);
    window.addEventListener('popstate', restore);
    return () => { window.removeEventListener('hashchange', restore); window.removeEventListener('popstate', restore); };
  }, [menuKey, tabs]);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const revealActive = () => revealTab(list, active);
    const observer = new ResizeObserver(revealActive);
    observer.observe(list);
    revealActive();
    return () => observer.disconnect();
  }, [active]);
  const select = (index: number, focus = false) => {
    if (menuKey) navigateMenuAnchor(menuCategoryAnchor(menuKey, tabs[index].id));
    if (index !== active) { transition(index); setActive(index); }
    const list = listRef.current;
    if (list) revealTab(list, index, focus);
  };

  return (
    <div ref={rootRef} data-menu-tabs className={[styles.tabs, variant === 'default' ? '' : styles[variant]].filter(Boolean).join(' ')}>
      <div ref={stickyRef} className={styles.sticky}>
        <div ref={listRef} className={styles.tablist} role="tablist" aria-label={label}>
          {tabs.map((tab, index) => (
            <a
              key={tab.id}
              id={`${groupId}-tab-${tab.id}`}
              href={`#${encodeURIComponent(menuKey ? menuCategoryAnchor(menuKey, tab.id) : `${groupId}-panel-${tab.id}`)}`}
              role="tab"
              aria-selected={index === active}
              aria-controls={menuKey ? menuCategoryAnchor(menuKey, tab.id) : `${groupId}-panel-${tab.id}`}
              tabIndex={index === active ? 0 : -1}
              onClick={event => {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault(); select(index);
              }}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case 'ArrowRight': next = (index + 1) % tabs.length; break;
                  case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
                  case 'Home': next = 0; break;
                  case 'End': next = tabs.length - 1; break;
                  case 'Enter': case ' ': next = index; break;
                  default: return;
                }
                event.preventDefault();
                select(next, true);
              }}
            >{tab.label}</a>
          ))}
        </div>
      </div>
      {variant !== 'default' && <noscript><style>{`.${styles.papapasta} > .${styles.sticky},.${styles.centro} > .${styles.sticky}{position:relative;inset-block-start:auto}`}</style></noscript>}
      {tabs.map((tab, index) => (
        <div key={tab.id} id={menuKey ? menuCategoryAnchor(menuKey, tab.id) : `${groupId}-panel-${tab.id}`} data-menu-category role="tabpanel" aria-labelledby={`${groupId}-tab-${tab.id}`} hidden={index !== active} tabIndex={0} className={styles.panel}>
          <h2 className={variant === 'default' ? styles.visuallyHidden : styles.categoryTitle}>{tab.label}</h2>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
