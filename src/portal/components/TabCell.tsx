import { forwardRef, type ButtonHTMLAttributes } from 'react';
import '../styles/tab-cell.scss';

export type TabCellProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'aria-selected'> & {
  /** Enabled no Figma representa seleção, não o inverso de disabled. */
  selected?: boolean;
};

/** Célula visual de tab. O grupo controla seleção, painel e navegação por setas. */
export const TabCell = forwardRef<HTMLButtonElement, TabCellProps>(function TabCell({
  selected = false, disabled = false, className = '', children, type = 'button', ...props
}, ref) {
  return <button {...props} ref={ref} type={type} role="tab" aria-selected={selected} disabled={disabled}
    className={`tab-cell ${className}`.trim()}><span>{children}</span></button>;
});
