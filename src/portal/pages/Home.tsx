import { assetUrl } from '../paths';
import { PortalSidebar } from '../components/PortalSidebar';
import { PortalTabletHeader } from '../components/PortalTabletHeader';
import { TextLink } from '../components/TextLink';
import { Button } from '../components/Button';
import '../styles/home.scss';
import '../styles/home-layout.scss';

const library = [
  { title: 'Fundamentos', description: 'Cores, tipografia, espaçamentos e tokens.' },
  { title: 'Componentes', description: 'Playgrounds, variantes e implementação.' },
  { title: 'Diretrizes', description: 'Boas práticas e soluções reutilizáveis.' },
  { title: 'Recursos', description: 'Figma, código, versões e documentação.' },
];
const updates = [
  { date: '15 out 2026', iso: '2026-10-15', title: 'Button', status: 'Atualizado', tone: 'updated', description: 'Novos estados e ajustes de comportamento.' },
  { date: '10 out 2026', iso: '2026-10-10', title: 'Tokens de cores', status: 'Novo', tone: 'new', description: 'Mapeamento semântico para o Dark Mode.' },
  { date: '02 out 2026', iso: '2026-10-02', title: 'Input', status: 'Removido', tone: 'removed', description: 'Melhorias na documentação de acessibilidade.' },
];

/** Protótipo visual estático. Conteúdo editorial e histórico reproduzem o Figma. */
export function Home() {
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
        <header className="section-header"><h2 id="atualizacoes">Atualizações recentes</h2></header>
        <div className="updates-container"><ol className="timeline">{updates.map((update, index) => <li key={update.iso}>
          <div className="timeline-marker" aria-hidden="true"><img src={index === 0 ? assetUrl('imgMarcador.svg') : assetUrl('imgMarcador1.svg')} alt="" /><span /></div>
          <article className="update-item"><time dateTime={update.iso}>{update.date}</time>
            <div><div className="update-header"><span className={`status-badge status-badge--${update.tone}`}>{update.status}</span><h3>{update.title}</h3></div><p>{update.description}</p></div>
            <TextLink label={`Ver alteração: ${update.title}`}>Ver alteração</TextLink>
          </article>
        </li>)}</ol>
          <Button variant="outlined" className="history-button" leftIcon={<img src={assetUrl('imgDocumentText.svg')} alt="" />}>Ver histórico</Button>
        </div>
      </section>
    </main>
  </div>;
}
