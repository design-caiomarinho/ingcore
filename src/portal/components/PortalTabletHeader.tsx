import { assetUrl } from '../paths';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { PortalNavigation } from './PortalSidebar';

export function PortalTabletHeader({ currentItem }: { currentItem?: string }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeMenu = () => setClosing(true);

  useLayoutEffect(() => {
    if (!open || !dialog.current) return;
    const modal = dialog.current;
    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyStyle = body.getAttribute('style');
    const rootStyle = root.getAttribute('style');
    // Fixed body also locks background scrolling in mobile Safari.
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, left: `-${scrollX}px`, width: '100%', overflow: 'hidden' });
    root.style.overflow = 'hidden';
    modal.showModal();
    const desktop = window.matchMedia('(min-width: 1200px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', onResize);
    return () => {
      desktop.removeEventListener('change', onResize);
      modal.close();
      if (bodyStyle === null) body.removeAttribute('style'); else body.setAttribute('style', bodyStyle);
      if (rootStyle === null) root.removeAttribute('style'); else root.setAttribute('style', rootStyle);
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [open]);

  return <header className="navbar">
    <div className="brand-logo"><img src={assetUrl('imgVector.svg')} alt="IngCore" /></div>
    <Button iconOnly icon={<img src={assetUrl('imgMenu.svg')} alt="" />} aria-label="Abrir menu de navegação"
      aria-expanded={open} aria-controls="portal-mobile-menu" aria-haspopup="dialog" onClick={() => { setClosing(false); setOpen(true); }} />
    <dialog ref={dialog} id="portal-mobile-menu" className="mobile-menu" aria-label="Menu de navegação"
      data-closing={closing || undefined}
      onAnimationEnd={event => {
        if (event.animationName === 'portal-menu-close' && closing) {
          setOpen(false);
          setClosing(false);
        }
      }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }}
      onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className="menu-header">
        <div className="brand-logo"><img src={assetUrl('imgVector.svg')} alt="IngCore" /></div>
        <Button iconOnly icon={<img src={assetUrl('imgClose.svg')} alt="" />} aria-label="Fechar menu de navegação" onClick={closeMenu} autoFocus />
      </div>
      <div className="menu-container"><div className="menu-scroll"><PortalNavigation currentItem={currentItem} /></div></div>
    </dialog>
  </header>;
}
