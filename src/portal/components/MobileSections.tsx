import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { assetUrl } from '../paths';
import { Button } from './Button';
import { NavButton, NavLink } from './NavButton';
import '../styles/mobile-sections.scss';

export type PageSection = { label: string; target: string | null };

export function MobileSections({ sections, current, menuOpen, onNavigate }: {
  sections: PageSection[];
  current: string;
  menuOpen: boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const currentLabel = sections.find(section => section.target === current)?.label ?? sections[0].label;


  useLayoutEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const onResize = () => { if (window.innerWidth >= 1200) setOpen(false); };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return <div className="mobile-sections-space">
    <nav ref={root} className="mobile-sections" aria-label="Seções da página" data-open={open || undefined}
      inert={menuOpen} aria-hidden={menuOpen || undefined}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
      }}>
      <div className="sections-header">
        <h2>{currentLabel}</h2>
        <Button ref={trigger} iconOnly aria-label={open ? 'Fechar seções' : 'Abrir seções'}
          aria-expanded={open} aria-controls="mobile-section-options"
          icon={<img src={assetUrl('sections-chevron.svg')} width="16" height="16" alt="" />}
          onClick={() => setOpen(value => !value)} />
      </div>
      <div className="sections-dropdown" id="mobile-section-options" inert={!open} aria-hidden={!open}>
        <div className="sections-clip"><div className="sections-options">
          {sections.map(({label, target}) => target
            ? <NavLink key={label} href={`#${target}`} selected={current === target}
                aria-current="location" onClick={event => {
                  onNavigate(event, target);
                  if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                    setOpen(false); trigger.current?.focus({ preventScroll: true });
                  }
                }}>{label}</NavLink>
            : <NavButton key={label} disabled title="Em breve">{label}</NavButton>)}
        </div></div>
      </div>
    </nav>
  </div>;
}
