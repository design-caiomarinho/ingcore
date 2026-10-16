import { assetUrl } from '../paths';
import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { PortalSidebar } from '../components/PortalSidebar';
import { PortalTabletHeader } from '../components/PortalTabletHeader';
import { Button } from '../components/Button';
import { CodeTag, InlineCode } from '../components/CodeTag';
import content from './colors.content.json';
import inventory from '../tokens/portal.tokens.json';
import '../styles/home.scss';
import '../styles/colors.scss';

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
const families = ['Blue', 'Gray', 'Amber', 'Red', 'Green'];
const sectionIds = ['organizacao', 'paleta', 'temas'] as const;
const swatches = content.swatches.map(swatch => {
  // Amber é o rótulo do frame; o primitivo correspondente se chama yellow em ref.
  const name = swatch.name.replace('palette/amber/', 'palette/yellow/');
  const token = inventory.tokens.find(t => t.collection === 'ref' && t.name === name);
  if (!token?.hexPreview) throw new Error(`Primitivo ausente para ${swatch.name}`);
  return { ...swatch, cssVar: token.cssVar, hex: token.hexPreview.toUpperCase() };
});

/** Conteúdo do recorte atual do Figma, com navegação por seções. */
export function Colors() {
  const submenu = useRef<HTMLElement>(null);
  const main = useRef<HTMLElement>(null);
  const [currentSection, setCurrentSection] = useState(() => window.location.hash.slice(1) || 'organizacao');
  useLayoutEffect(() => {
    const menu = submenu.current;
    const page = main.current;
    if (!menu || !page) return;
    let frame = 0;
    const updateCurrentSection = () => {
      frame = 0;
      const menuRect = menu.getBoundingClientRect();
      const threshold = menuRect.height > 0 ? 16 + menuRect.height + 18 : 90;
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
      scheduleUpdate();
    };
    const updateHeight = () => {
      page.style.setProperty('--submenu-height', `${menu.getBoundingClientRect().height}px`);
      scheduleUpdate();
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(menu);
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
  }, []);
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };
  return <div className="portal-theme portal-layout colors-page">
    <PortalSidebar currentItem="Cores" />
    <PortalTabletHeader currentItem="Cores" />
    <main className="page-content" id="conteudo" ref={main}>
      <header className="overview-section">
        <p className="overview-label"><span aria-hidden="true" />{text('76:1590')}</p>
        <div><h1>{text('76:1592')}</h1><p className="overview-description">{text('76:1593')}</p></div>
      </header>
      <nav className="sections-bar" aria-label="Seções da página" ref={submenu}
        onPointerMove={() => { if (submenu.current) delete submenu.current.dataset.scrollSelection; }}>
        <h2>{text('78:2263')}</h2>
        <div className="section-buttons">{[
          { label: 'I78:2265;78:2215', target: 'organizacao' },
          { label: 'I78:2266;31:460', target: 'paleta' },
          { label: 'I78:2267;31:460', target: null },
          { label: 'I78:2268;31:460', target: 'temas' },
        ].map(({ label, target }) => target
          ? <a key={label} href={`#${target}`} aria-current={currentSection === target ? 'location' : undefined}
              className={`button button--ghost button--small ${currentSection === target ? 'section-current' : ''}`}
              onClick={event => navigateToSection(event, target)}>{text(label as keyof typeof content.texts)}</a>
          : <Button key={label} size="small" disabled title="Em breve">{text(label as keyof typeof content.texts)}</Button>)}</div>
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
      <ColorSection title={text('97:243')} id="paleta">
        <div className="content-group">
          <p className="justified"><InlineCode>{text('92:1403')}</InlineCode></p>
          <div className="palette-families">{families.map(family => <section className="palette-family" key={family} aria-labelledby={`palette-${family.toLowerCase()}`}>
            <h3 id={`palette-${family.toLowerCase()}`}>{family}</h3>
            <div className="swatches">{swatches.filter(s => s.name.split('/')[1] === family.toLowerCase()).map(s =>
              <article className="color-swatch" key={s.name}>
                <div className="swatch-preview" style={{ backgroundColor: `var(${s.cssVar})` }} data-token={s.cssVar} aria-label={s.hex} />
                <div className="swatch-details"><p>{s.label}</p><p>{s.hex}</p></div>
              </article>)}</div>
          </section>)}</div>
        </div>
        <div className="text-group"><h3>{text('97:480')}</h3><p className="justified"><InlineCode>{text('97:481')}</InlineCode></p></div>
      </ColorSection>
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
