import { useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react';
import '../styles/tab-cell.scss';

/** Indicador único que acompanha a posição e a largura da aba selecionada. */
export function TabList({ children, className = '', ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'role'>) {
  const root = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const list = root.current;
    if (!list) return;
    const measure = () => {
      const active = list.querySelector<HTMLButtonElement>(':scope > .tab-cell[aria-selected="true"]:not(:disabled)');
      const next = active ? { left: active.offsetLeft, width: active.offsetWidth } : null;
      setIndicator(previous => previous?.left === next?.left && previous?.width === next?.width ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list.querySelectorAll(':scope > .tab-cell').forEach(tab => observer.observe(tab));
    return () => observer.disconnect();
  }, [children]);
  return <div {...props} ref={root} role="tablist" className={`tab-list ${className}`.trim()}>
    {children}
    {indicator && <span className="tab-indicator" aria-hidden="true" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }} />}
  </div>;
}
