import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { assetUrl } from '../paths';
import '../styles/input.scss';

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  hintIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  invalid?: boolean;
};

/** Input da interface do portal; separado dos componentes documentados do DS. */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField({
  id, label, hint, hintIcon, leftIcon, rightIcon, invalid = false, disabled = false,
  className = '', placeholder = ' ', 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ...props
}, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = inputId + '-hint';
  const critical = invalid || ariaInvalid === true || ariaInvalid === 'true';
  return <div className={`input-field ${className}`.trim()} data-invalid={critical || undefined} data-disabled={disabled || undefined}>
    {label && <label className="input-label" htmlFor={inputId}>{label}</label>}
    <label className="input-control" htmlFor={inputId}>
      <div className="input-content">
        {leftIcon && <span className="input-icon input-icon-left" aria-hidden="true">{leftIcon}</span>}
        <input {...props} ref={ref} id={inputId} className="input" disabled={disabled} placeholder={placeholder}
          aria-invalid={critical || undefined} aria-describedby={[describedBy, hint ? hintId : undefined].filter(Boolean).join(' ') || undefined} />
      </div>
      {rightIcon && <span className="input-icon" aria-hidden="true">{rightIcon}</span>}
    </label>
    {hint && <div className="input-hint" id={hintId}>
      <span className="input-hint-icon" aria-hidden="true">{hintIcon ?? <img src={assetUrl('input-info.svg')} alt="" />}</span>
      <p>{hint}</p>
    </div>}
  </div>;
});
