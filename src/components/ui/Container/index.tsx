import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.scss';

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section';
  size?: 'default' | 'text';
  children: ReactNode;
};

export default function Container({ as: Tag = 'div', size = 'default', className, children, ...props }: ContainerProps) {
  return (
    <Tag {...props} className={[styles.container, size === 'text' && styles.text, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
