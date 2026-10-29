import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { PortalSidebar } from './PortalSidebar';
import { PortalTabletHeader, type NavbarState } from './PortalTabletHeader';
import { MobileSections, type PageSection } from './MobileSections';
import { NavButton, NavLink } from './NavButton';
import '../styles/home.scss';
import '../styles/page-sections.scss';

type Props = {
  title: string;
  description: string;
  currentItem: string;
  className: string;
  sections: PageSection[];
  children: ReactNode;
};

/** Estrutura e navegação compartilhadas pelas páginas de fundamentos. */
export function DocumentationPage({title, description, currentItem, className, sections, children}: Props) {
  const sectionIds = sections.flatMap(section => section.target ? [section.target] : []);
  const submenu = useRef<HTMLElement>(null);
  const floatingSubmenu = useRef<HTMLElement>(null);
  const floatingActive = useRef(false);
  const floatingRevealUntil = useRef(0);
  const main = useRef<HTMLElement>(null);
  const [navbar, setNavbar] = useState<NavbarState>({hidden: false, menuOpen: false});
  const [sectionsHidden, setSectionsHidden] = useState(false);
  const [sectionsFloating, setSectionsFloating] = useState(false);
  const [sectionNavigating, setSectionNavigating] = useState(false);
  const sectionDestination = useRef<number | null>(null);
  const [currentSection, setCurrentSection] = useState(() => window.location.hash.slice(1) || sections[0].target || '');
  useLayoutEffect(() => {
    const menu = submenu.current;
    const floatingMenu = floatingSubmenu.current;
    if (!menu || !floatingMenu) return;
    let previousY = window.scrollY;
    let frame = 0;
    let focusFrame = 0;
    let timer: number | undefined;
    const setFloating = (value: boolean) => {
      if (floatingActive.current === value) return;
      const from = value ? menu : floatingMenu;
      const to = value ? floatingMenu : menu;
      const focused = from.querySelector<HTMLAnchorElement>('a:focus-visible');
      floatingActive.current = value;
      floatingRevealUntil.current = value ? performance.now() + 1500 : 0;
      setSectionsFloating(value);
      if (focused) {
        const href = focused.getAttribute('href');
        window.cancelAnimationFrame(focusFrame);
        focusFrame = window.requestAnimationFrame(() => {
          const link = [...to.querySelectorAll<HTMLAnchorElement>('a')].find(link => link.getAttribute('href') === href);
          link?.focus({preventScroll: true});
        });
      }
    };
    const scheduleHide = () => {
      window.clearTimeout(timer);
      if (!floatingActive.current || sectionDestination.current !== null) return;
      timer = window.setTimeout(() => {
        if (floatingActive.current && sectionDestination.current === null && !floatingMenu.querySelector(':focus-visible')) setSectionsHidden(true);
      }, 3000);
    };
    const show = () => { setSectionsHidden(false); scheduleHide(); };
    const update = () => {
      frame = 0;
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      const originBottom = menu.getBoundingClientRect().bottom;
      floatingMenu.toggleAttribute('data-origin-visible', originBottom >= 0);
      // Recolhe antes de o submenu original voltar à tela.
      if (window.innerWidth < 1200 || originBottom >= -192) {
        setFloating(false);
        window.clearTimeout(timer);
        setSectionsHidden(false);
        previousY = y;
        return;
      }
      // A faixa de 64 px entre saída e entrada evita alternâncias na borda.
      // Na navegação por âncora, mantém o menu disponível durante o deslocamento.
      if (!floatingActive.current) {
        if (originBottom <= -256 || sectionDestination.current !== null) {
          setFloating(true);
          show();
        }
        previousY = y;
        return;
      }
      if (sectionDestination.current !== null || floatingMenu.querySelector(':focus-visible')) {
        previousY = y;
        show();
        return;
      }
      // Apresenta o submenu por 1,5 s, mesmo que a primeira rolagem continue.
      if (performance.now() < floatingRevealUntil.current) {
        previousY = y;
        return;
      }
      const delta = y - previousY;
      if (Math.abs(delta) < 8) return;
      if (delta > 0) { window.clearTimeout(timer); setSectionsHidden(true); }
      else show();
      previousY = y;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onResize = () => { previousY = window.scrollY; update(); if (floatingActive.current) show(); };
    update();
    if (floatingActive.current) scheduleHide();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onResize);
    floatingMenu.addEventListener('pointermove', show);
    floatingMenu.addEventListener('pointerdown', show);
    floatingMenu.addEventListener('focusin', show);
    floatingMenu.addEventListener('focusout', scheduleHide);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      floatingMenu.removeEventListener('pointermove', show);
      floatingMenu.removeEventListener('pointerdown', show);
      floatingMenu.removeEventListener('focusin', show);
      floatingMenu.removeEventListener('focusout', scheduleHide);
    };
  }, [sectionNavigating]);
  useLayoutEffect(() => {
    if (!sectionNavigating) return;
    let frame = 0;
    const started = performance.now();
    const finish = () => { sectionDestination.current = null; setSectionNavigating(false); };
    const checkArrival = () => {
      const target = sectionDestination.current;
      if (target === null || Math.abs(window.scrollY - target) < 2 || performance.now() - started > 4000) { finish(); return; }
      frame = window.requestAnimationFrame(checkArrival);
    };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) finish();
    };
    frame = window.requestAnimationFrame(checkArrival);
    window.addEventListener('wheel', finish, {passive: true});
    window.addEventListener('touchstart', finish, {passive: true});
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', finish);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchstart', finish);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', finish);
    };
  }, [sectionNavigating]);
  useLayoutEffect(() => {
    const menu = submenu.current;
    const page = main.current;
    if (!menu || !page) return;
    let frame = 0;
    const updateCurrentSection = () => {
      frame = 0;
      if (document.body.style.position === 'fixed') return;
      const menuRect = menu.getBoundingClientRect();
      const threshold = window.innerWidth < 1200 ? (navbar.hidden ? 82 : 154) : 16 + menuRect.height + 18;
      let current: string = sectionIds[0];
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1];
      }
      setCurrentSection(current);
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateCurrentSection); };
    const onScroll = () => {
      // Um cursor parado não deve manter a seção anterior visualmente ativa.
      menu.dataset.scrollSelection = 'true';
      if (floatingSubmenu.current) floatingSubmenu.current.dataset.scrollSelection = 'true';
      scheduleUpdate();
    };
    const updateHeight = () => {
      const rect = menu.getBoundingClientRect();
      page.style.setProperty('--submenu-height', `${Math.max(rect.height, floatingSubmenu.current?.offsetHeight ?? 0)}px`);
      page.style.setProperty('--sections-center', `${rect.left + rect.width / 2}px`);
      page.style.setProperty('--sections-width', `${rect.width}px`);
      scheduleUpdate();
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(menu);
    if (floatingSubmenu.current) observer.observe(floatingSubmenu.current);
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateHeight);
    window.addEventListener('hashchange', scheduleUpdate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, [navbar.hidden, navbar.menuOpen, sections]);
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    const top = window.scrollY + section.getBoundingClientRect().top;
    const offset = window.innerWidth < 1200 ? (top > window.scrollY ? 80 : 152) : Math.max(submenu.current?.offsetHeight ?? 82, floatingSubmenu.current?.offsetHeight ?? 0) + 32;
    const destination = Math.max(0, Math.min(top - offset, document.documentElement.scrollHeight - window.innerHeight));
    if (window.innerWidth >= 1200) {
      sectionDestination.current = destination;
      setSectionNavigating(true);
      setSectionsHidden(false);
    }
    window.scrollTo({
      top: destination,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  const renderSectionLinks = () => sections.map(({ label, target }) => target
    ? <NavLink key={label} href={`#${target}`} selected={currentSection === target} aria-current="location"
        onClick={event => navigateToSection(event, target)}>{label}</NavLink>
    : <NavButton key={label} disabled title="Em breve">{label}</NavButton>);
  return <div className={`portal-theme portal-layout ${className}`} data-navbar-hidden={navbar.hidden || undefined} data-menu-open={navbar.menuOpen || undefined} data-sections-hidden={sectionsHidden || undefined}>
    <PortalSidebar currentItem={currentItem} />
    <PortalTabletHeader currentItem={currentItem} onStateChange={setNavbar} />
    <MobileSections sections={sections} current={currentSection} menuOpen={navbar.menuOpen} onNavigate={navigateToSection} />
    <main className="page-content" id="conteudo" ref={main}>
      <header className="overview-section">
        <p className="overview-label"><span aria-hidden="true" />FUNDAMENTOS</p>
        <div><h1>{title}</h1><p className="overview-description">{description}</p></div>
      </header>
      <nav className="sections-bar" aria-label="Seções da página" ref={submenu}
        aria-hidden={sectionsFloating || undefined} inert={sectionsFloating}
        onPointerMove={() => { if (submenu.current) delete submenu.current.dataset.scrollSelection; }}>
        <h2>Seções</h2>
        <div className="section-buttons">{renderSectionLinks()}</div>
      </nav>
      <nav className="sections-bar sections-floating" aria-label="Seções da página" ref={floatingSubmenu}
        aria-hidden={!sectionsFloating || undefined} inert={!sectionsFloating}
        data-floating={sectionsFloating || undefined} data-hidden={sectionsHidden || undefined}
        onPointerMove={() => { if (floatingSubmenu.current) delete floatingSubmenu.current.dataset.scrollSelection; }}>
        <h2>Seções</h2>
        <div className="section-buttons">{renderSectionLinks()}</div>
      </nav>
      {children}
    </main>
  </div>;
}
