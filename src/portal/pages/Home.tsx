import { useScrollFade } from '../hooks/useScrollFade';
import { assetUrl, pageUrl } from '../paths';
import { PortalSidebar } from '../components/PortalSidebar';
import { PortalTabletHeader } from '../components/PortalTabletHeader';
import { TextLink } from '../components/TextLink';
import { recentUpdates, updateTones, formatUpdateDate, formatUpdateDescription } from '../content/updates';
import '../styles/home.scss';
import '../styles/home-layout.scss';

const library = [
  { title: 'Fundamentos', description: 'Cores, tipografia, espaçamentos e tokens.' },
  { title: 'Componentes', description: 'Playgrounds, variantes e implementação.' },
  { title: 'Diretrizes', description: 'Boas práticas e soluções reutilizáveis.' },
  { title: 'Recursos', description: 'Figma, código, versões e documentação.' },
];
/** Página inicial com atualizações do histórico editorial local. */
export function Home() {
  const updatesFade = useScrollFade<HTMLOListElement>();
  return <div className="portal-theme portal-layout home-page">
    <PortalSidebar />
    <PortalTabletHeader />
    <main className="page-content" id="conteudo">
      <div className="home-content">
      <header className="overview-section">
        <p className="overview-label"><span aria-hidden="true" />VISÃO GERAL</p>
        <div><h1>Construa experiências consistentes</h1><p className="overview-description">Encontre fundamentos, componentes e diretrizes para projetar e desenvolver interfaces com o IngCore.</p></div>
      </header>
      <section className="section-panel explore-section" aria-labelledby="biblioteca">
        <header className="section-header"><h2 id="biblioteca">Explore a biblioteca</h2></header>
        <div className="cards-container">{library.map(card => <article className="explore-card" key={card.title}>
          <div><h3>{card.title}</h3><p>{card.description}</p></div>
          <TextLink label={`Explorar ${card.title.toLowerCase()}`}>Explorar</TextLink>
        </article>)}</div>
      </section>
      </div>
      <section className="section-panel updates-section" aria-labelledby="atualizacoes">
        <header className="section-header"><h2 id="atualizacoes">Atualizações</h2></header>
        <div className="updates-container"><div className="updates-scroll" ref={updatesFade.scrollRef} onScroll={updatesFade.onScroll} style={updatesFade.style}><ol className="timeline" ref={updatesFade.contentRef}>{recentUpdates.map(update => <li key={update.id}>
          <div className="timeline-marker" aria-hidden="true"><img src={assetUrl(`timeline-${updateTones[update.status]}.svg`)} width="12" height="12" alt="" /><span /></div>
          <article className="update-item">
            <div className="update-content">
            <span className={`status-badge status-badge--${updateTones[update.status]}`}>{update.status}</span>
            <div className="update-details"><div className="update-text"><h3>{update.title}</h3><p>{formatUpdateDescription(update.description)}</p></div>
              <time dateTime={update.date}>{formatUpdateDate(update.date)}</time>
            </div>
            {update.href ? <TextLink href={pageUrl(update.href)} label={`Ver alteração: ${update.title}`}>Ver alteração</TextLink>
              : <TextLink label={`Ver alteração: ${update.title}`}>Ver alteração</TextLink>}
            </div>
          </article>
        </li>)}</ol></div>
          {/* O histórico será disponibilizado quando sua página estiver definida. */}
        </div>
      </section>
    </main>
  </div>;
}
