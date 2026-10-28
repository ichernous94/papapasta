'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './MenuTabs.module.scss';

type MenuTab = { id: string; label: string; content: ReactNode };
type MenuTabsProps = { label: string; tabs: readonly MenuTab[] };

function revealTab(list: HTMLDivElement, index: number, focus = false) {
  const tab = list.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index];
  if (!tab) return;
  if (focus) tab.focus({ preventScroll: true });
  const container = list.getBoundingClientRect();
  const bounds = tab.getBoundingClientRect();
  // Scroll only the horizontal tablist, keeping the document position intact.
  if (bounds.left < container.left) list.scrollLeft += bounds.left - container.left;
  else if (bounds.right > container.right) list.scrollLeft += bounds.right - container.right;
}

export default function MenuTabs({ label, tabs }: MenuTabsProps) {
  const groupId = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
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
    setActive(index);
    const list = listRef.current;
    if (list) revealTab(list, index, focus);
  };

  return (
    <div className={styles.tabs}>
      <div ref={listRef} className={styles.tablist} role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${groupId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${groupId}-panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              let next: number;
              switch (event.key) {
                case 'ArrowRight': next = (index + 1) % tabs.length; break;
                case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
                case 'Home': next = 0; break;
                case 'End': next = tabs.length - 1; break;
                default: return;
              }
              event.preventDefault();
              select(next, true);
            }}
          >{tab.label}</button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.id} id={`${groupId}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${groupId}-tab-${tab.id}`} hidden={index !== active} tabIndex={0} className={styles.panel}>
          <h2 className={styles.visuallyHidden}>{tab.label}</h2>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
