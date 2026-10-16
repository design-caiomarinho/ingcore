import { assetUrl } from '../paths';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import '../styles/sidebar-button.scss';

export type SidebarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Estado Enabled do Figma: item selecionado, independente de disabled. */
  selected?: boolean;
};

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  function SidebarButton({ selected = false, disabled = false, className = '', type = 'button', children, ...props }, ref) {
    return <button {...props} ref={ref} type={type} disabled={disabled}
      className={`sidebar-button ${className}`.trim()}
      data-selected={selected ? 'true' : undefined} aria-pressed={selected}>
      {disabled && <img className="sidebar-lock" src={assetUrl('sidebar-lock.svg')} width="16" height="16" alt="" aria-hidden="true" />}
      <span>{children}</span>
    </button>;
  },
);

export function SidebarLink({ selected = false, className = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { selected?: boolean }) {
  return <a {...props} className={`sidebar-button ${className}`.trim()}
    data-selected={selected ? 'true' : undefined} aria-current={selected ? 'page' : undefined}>
    {children}
  </a>;
}
