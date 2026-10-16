import { assetUrl } from '../paths';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import '../styles/text-link.scss';

type CommonProps = {
  children: ReactNode;
  disabled?: boolean;
  arrow?: boolean;
  showIcon?: boolean;
  icon?: ReactNode;
  label?: string;
  className?: string;
};
export type TextLinkProps = CommonProps & (
  | ({ href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>)
  | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>)
);

/** Link para navegação quando recebe href; botão nativo para ações locais. */
export function TextLink(props: TextLinkProps) {
  const disabled = props.disabled ?? false;
  const showIcon = props.showIcon ?? props.arrow ?? true;
  const className = `text-link ${props.className ?? ''}`.trim();
  const content = <><span>{props.children}</span>{showIcon && (props.icon ?? <img src={disabled ? assetUrl('imgArrowRightDisabled.svg') : assetUrl('imgArrowRight.svg')} alt="" />)}</>;
  if (props.href !== undefined) {
    const { children, arrow, showIcon, icon, label, className: ignoredClass, disabled, href, onClick, tabIndex, ...rest } = props;
    return <a {...rest} href={disabled ? undefined : href} role={disabled ? 'link' : undefined}
      className={className} aria-label={label} aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex} onClick={disabled ? undefined : onClick}>{content}</a>;
  }
  const { children, arrow, showIcon: ignoredIcon, icon, label, className: ignoredClass, disabled: ignoredDisabled, href, type = 'button', ...rest } = props;
  return <button {...rest} className={className} type={type} disabled={disabled} aria-label={label}>{content}</button>;
}
