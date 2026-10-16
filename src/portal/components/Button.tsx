import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import '../styles/button.scss';

type CommonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'ghost' | 'outlined';
  size?: 'medium' | 'small';
  /** Estado Enabled do Figma: seleção persistente, distinto de disabled. */
  selected?: boolean;
};
export type ButtonProps = CommonProps & (
  | { iconOnly: true; icon: ReactNode; 'aria-label': string; children?: never; leftIcon?: never; rightIcon?: never }
  | { iconOnly?: false; icon?: never; children: ReactNode; leftIcon?: ReactNode; rightIcon?: ReactNode }
);

/** Variantes do portal mantidas no mesmo componente e catálogo. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'ghost', size = 'medium', selected, iconOnly = false, icon, leftIcon, rightIcon, children, className = '', type = 'button', ...props }, ref) {
    return <button {...props} ref={ref} type={type}
      className={`button button--${variant} button--${size} ${className}`.trim()}
      data-icon-only={iconOnly || undefined} data-selected={selected || undefined} aria-pressed={selected ?? props['aria-pressed']}>
      {iconOnly ? <span className="button-icon" aria-hidden="true">{icon}</span> : <>
        {leftIcon && <span className="button-icon" aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="button-icon" aria-hidden="true">{rightIcon}</span>}
      </>}
    </button>;
  },
);
