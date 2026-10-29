import { assetUrl } from '../paths';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { PortalNavigation } from './PortalSidebar';
import { BrandLogo } from './BrandLogo';

export type NavbarState = { hidden: boolean; menuOpen: boolean };

export function PortalTabletHeader({ currentItem, onStateChange }: { currentItem?: string; onStateChange?: (state: NavbarState) => void }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeMenu = () => setClosing(true);

  useLayoutEffect(() => {
    onStateChange?.({ hidden: hidden && !open, menuOpen: open && !closing });
  }, [hidden, open, closing, onStateChange]);

  useLayoutEffect(() => {
    let previousY = window.scrollY;
    let previousWidth = window.innerWidth;
    let frame = 0;
    let hideTimer: number | undefined;
    const navbar = header.current;
    const scrollSafety = 144;
    const hasKeyboardFocus = () => document.documentElement.dataset.inputMode !== 'pointer' && !!navbar?.querySelector(':focus-visible');
    const scheduleHide = () => {
      window.clearTimeout(hideTimer);
      if (open || window.scrollY <= scrollSafety) return;
      hideTimer = window.setTimeout(() => {
        if (window.innerWidth < 1200 && window.scrollY > scrollSafety && !hasKeyboardFocus()) setHidden(true);
      }, 1000);
    };
    const showNavbar = () => { setHidden(false); scheduleHide(); };
    const updateVisibility = () => {
      frame = 0;
      if (open || window.innerWidth >= 1200) return;
      // Limita o overscroll dos dispositivos móveis e ignora pequenos movimentos.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      if (y <= scrollSafety || hasKeyboardFocus()) {
        showNavbar();
        previousY = y;
        return;
      }
      const delta = y - previousY;
      if (Math.abs(delta) < 8) return;
      if (delta > 0) {
        window.clearTimeout(hideTimer);
        setHidden(true);
      } else showNavbar();
      previousY = y;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateVisibility); };
    const onResize = () => {
      // A barra do navegador móvel altera a altura durante o scroll.
      // Só uma mudança de largura deve reiniciar a posição da navegação.
      if (window.innerWidth === previousWidth) return;
      previousWidth = window.innerWidth;
      previousY = window.scrollY;
      showNavbar();
    };
    showNavbar();
    navbar?.addEventListener('pointermove', scheduleHide);
    navbar?.addEventListener('pointerdown', scheduleHide);
    navbar?.addEventListener('focusin', showNavbar);
    navbar?.addEventListener('focusout', scheduleHide);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      navbar?.removeEventListener('pointermove', scheduleHide);
      navbar?.removeEventListener('pointerdown', scheduleHide);
      navbar?.removeEventListener('focusin', showNavbar);
      navbar?.removeEventListener('focusout', scheduleHide);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

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

  return <header ref={header} className="navbar" data-hidden={hidden && !open || undefined} onFocusCapture={() => setHidden(false)}>
    <BrandLogo />
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
        <BrandLogo onClick={() => { setOpen(false); setClosing(false); }} />
        <Button iconOnly icon={<img src={assetUrl('imgClose.svg')} alt="" />} aria-label="Fechar menu de navegação" onClick={closeMenu} autoFocus />
      </div>
      <div className="menu-container"><div className="menu-scroll"><PortalNavigation currentItem={currentItem} /></div></div>
    </dialog>
  </header>;
}
