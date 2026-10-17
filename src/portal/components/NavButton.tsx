import { assetUrl } from '../paths';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import '../styles/nav-button.scss';

export type NavButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Estado Enabled do Figma: item selecionado, independente de disabled. */
  selected?: boolean;
};

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  function NavButton({ selected = false, disabled = false, className = '', type = 'button', children, ...props }, ref) {
    return <button {...props} ref={ref} type={type} disabled={disabled}
      className={`nav-button ${className}`.trim()}
      data-selected={selected ? 'true' : undefined} aria-pressed={selected}>
      {disabled && <img className="sidebar-lock" src={assetUrl('sidebar-lock.svg')} width="16" height="16" alt="" aria-hidden="true" />}
      <span>{children}</span>
    </button>;
  },
);

export function NavLink({ selected = false, className = '', children, 'aria-current': current = 'page', ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { selected?: boolean }) {
  return <a {...props} className={`nav-button ${className}`.trim()}
    data-selected={selected ? 'true' : undefined} aria-current={selected ? current : undefined}>
    {children}
  </a>;
}
