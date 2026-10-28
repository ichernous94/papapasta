import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonProps = (ButtonActionProps | ButtonLinkProps) & {
  variant?: 'light' | 'dark';
};

export default function Button({ className, variant = 'light', ...props }: ButtonProps) {
  const buttonClassName = [styles.button, variant === 'dark' && styles.dark, className]
    .filter(Boolean).join(' ');

  if (props.href !== undefined) {
    const { href, ...linkProps } = props;
    const isExternal = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);

    if (isExternal) {
      return <a {...linkProps} href={href} className={buttonClassName} />;
    }

    return <Link {...linkProps} href={href} className={buttonClassName} />;
  }

  const { type = 'button', ...buttonProps } = props;

  return <button {...buttonProps} type={type} className={buttonClassName} />;
}
