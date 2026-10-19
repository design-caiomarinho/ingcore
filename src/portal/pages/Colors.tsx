import { assetUrl } from '../paths';
import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { PortalSidebar } from '../components/PortalSidebar';
import { PortalTabletHeader, type NavbarState } from '../components/PortalTabletHeader';
import { MobileSections, type PageSection } from '../components/MobileSections';
import { ColorExplorer } from './ColorExplorer';
import { NavButton, NavLink } from '../components/NavButton';
import { CodeTag, InlineCode } from '../components/CodeTag';
import content from './colors.content.json';
import '../styles/home.scss';
import '../styles/colors.scss';
import '../styles/color-explorer.scss';

const text = (id: keyof typeof content.texts) => content.texts[id];
function Paragraphs({ id }: { id: keyof typeof content.texts }) {
  return <div className="paragraphs">{text(id).split('\n').map((p, index) => <p key={index}><InlineCode>{p}</InlineCode></p>)}</div>;
}
function ColorSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}>
    <header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="section-content">{children}</div>
  </section>;
}
function CodeExample({ id }: { id: keyof typeof content.texts }) {
  return <pre className="code-example code-block"><code>{text(id)}</code></pre>;
}
const sectionIds = ['organizacao', 'explorar', 'temas'] as const;
const sections: PageSection[] = [
  { label: 'Organização dos tokens', target: 'organizacao' },
  { label: 'Explore as cores', target: 'explorar' },
  { label: 'Aplicação e temas', target: 'temas' },
];

/** Conteúdo do recorte atual do Figma, com navegação por seções. */
export function Colors() {
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
  const [currentSection, setCurrentSection] = useState(() => window.location.hash.slice(1) || 'organizacao');
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
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, [navbar.hidden, navbar.menuOpen, sectionsHidden]);
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
  return <div className="portal-theme portal-layout colors-page" data-navbar-hidden={navbar.hidden || undefined} data-menu-open={navbar.menuOpen || undefined} data-sections-hidden={sectionsHidden || undefined}>
    <PortalSidebar currentItem="Cores" />
    <PortalTabletHeader currentItem="Cores" onStateChange={setNavbar} />
    <MobileSections sections={sections} current={currentSection} menuOpen={navbar.menuOpen} onNavigate={navigateToSection} />
    <main className="page-content" id="conteudo" ref={main}>
      <header className="overview-section">
        <p className="overview-label"><span aria-hidden="true" />{text('76:1590')}</p>
        <div><h1>{text('76:1592')}</h1><p className="overview-description">{text('76:1593')}</p></div>
      </header>
      <nav className="sections-bar" aria-label="Seções da página" ref={submenu}
        aria-hidden={sectionsFloating || undefined} inert={sectionsFloating}
        onPointerMove={() => { if (submenu.current) delete submenu.current.dataset.scrollSelection; }}>
        <h2>{text('78:2263')}</h2>
        <div className="section-buttons">{renderSectionLinks()}</div>
      </nav>
      <nav className="sections-bar sections-floating" aria-label="Seções da página" ref={floatingSubmenu}
        aria-hidden={!sectionsFloating || undefined} inert={!sectionsFloating}
        data-floating={sectionsFloating || undefined} data-hidden={sectionsHidden || undefined}
        onPointerMove={() => { if (floatingSubmenu.current) delete floatingSubmenu.current.dataset.scrollSelection; }}>
        <h2>{text('78:2263')}</h2>
        <div className="section-buttons">{renderSectionLinks()}</div>
      </nav>
      <ColorSection title={text('76:1621')} id="organizacao">
        <div className="content-group">
          <p className="justified"><InlineCode>{text('78:2321')}</InlineCode></p>
          <div className="token-cards">{[
            ['78:2324', '78:2325', '83:2352'],
            ['78:2335', '78:2336', '83:2348'],
          ].map(([heading, body, caption]) => <div className="token-column" key={heading}>
            <article className="token-card"><h3>{text(heading as keyof typeof content.texts)}</h3><Paragraphs id={body as keyof typeof content.texts} /></article>
            <p className="token-caption"><InlineCode>{text(caption as keyof typeof content.texts)}</InlineCode></p>
          </div>)}</div>
        </div>
        <div className="content-group">
          <div className="text-group"><h3>{text('83:2354')}</h3><p className="justified"><InlineCode>{text('83:2356')}</InlineCode></p></div>
          <div className="token-connection">
            <div className="token-flow">{[
              ['92:254', '92:256'], ['92:259', '92:261'], ['92:264', '92:266'],
            ].map(([label, value], index) => <div className="flow-step" key={label}>
              {index > 0 && <img className="flow-arrow" src={assetUrl('token-flow-arrow.svg')} width="18" height="15" alt="" />}
              <div><p className="flow-label">{text(label as keyof typeof content.texts)}</p><CodeTag>{text(value as keyof typeof content.texts)}</CodeTag></div>
            </div>)}</div>
            <CodeExample id="85:2452" />
          </div>
        </div>
        <div className="text-group"><h3>{text('92:309')}</h3><Paragraphs id="92:310" /></div>
      </ColorSection>
      <ColorSection title="Explore os tokens de cores" id="explorar"><ColorExplorer /></ColorSection>
      <ColorSection title={text('97:689')} id="temas">
        <div className="content-group">
          <div className="text-group"><h3>{text('97:691')}</h3><p><InlineCode>{text('97:692')}</InlineCode></p></div>
          <div className="theme-examples">{[
            { title: '97:695', body: '97:696', code: '97:697', dark: false },
            { title: '97:701', body: '97:702', code: '97:703', dark: true },
          ].map(theme => <article className={`theme-card${theme.dark ? ' theme-card--dark' : ''}`} key={theme.title}>
            <div className="text-group"><h3>{text(theme.title as keyof typeof content.texts)}</h3><p><InlineCode>{text(theme.body as keyof typeof content.texts)}</InlineCode></p></div>
            <div className="text-group"><pre className="code-block"><code>{text(theme.code as keyof typeof content.texts)}</code></pre>
            </div>
          </article>)}</div>
          <p className="justified"><InlineCode>{text('97:706')}</InlineCode></p>
          <CodeExample id="97:708" />
        </div>
        <div className="content-group">
          <div className="text-group"><h3>{text('97:709')}</h3><p className="justified"><InlineCode>{text('97:710')}</InlineCode></p></div>
          <CodeExample id="97:712" />
        </div>
      </ColorSection>
    </main>
  </div>;
}
