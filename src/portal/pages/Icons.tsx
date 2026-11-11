import { useMemo, useState } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { TextLink } from '../components/TextLink';
import { TablePagination } from '../components/TablePagination';
import iconCatalog from '../../design-system/icons/icons.json';
import { assetUrl } from '../paths';
import '../styles/icons-page.scss';

const sections = [
  { label: 'Explore os ícones', target: 'explorar' },
  { label: 'Significado e acessibilidade', target: 'acessibilidade' },
];

// A ordem inicial acompanha o protótipo; os demais itens vêm do Design System.
const featured = ['2147-16877', '2147-16674', '2147-16262', '2147-16688', '2147-16682', '2147-16558', '2147-16093', '2147-15986', '2147-16241', '2147-16232', '2147-16218', '2147-16231', '2147-16734', '2147-16748', '2147-16772', '2147-16649', '2147-16600', '2147-16680'];
const keywords: Record<string, string> = { 'search-normal': 'busca pesquisar procurar', home: 'início casa', user: 'usuário pessoa perfil', add: 'adicionar mais', trash: 'lixeira excluir remover', edit: 'editar', folder: 'pasta', document: 'documento arquivo', 'arrow-right': 'seta direita avançar', 'arrow-left': 'seta esquerda voltar', 'arrow-up': 'seta cima subir', 'arrow-down': 'seta baixo descer', notification: 'notificação sino', 'setting-2': 'configuração ajustes', calendar: 'calendário data', filter: 'filtro filtrar', 'close-circle': 'fechar cancelar', 'tick-circle': 'confirmar certo' };
const order = new Map(featured.map((id, index) => [id, index]));
const icons = [...iconCatalog].sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
const pageSize = 18;
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function Icons() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(icons[1]);
  const [page, setPage] = useState(1);
  const [copyMessage, setCopyMessage] = useState('');
  const filtered = useMemo(() => icons.filter(icon => normalize(`${icon.name} ${icon.group} ${keywords[icon.name] ?? ''}`).includes(normalize(query.trim()))), [query]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const reference = `vuesax/linear/${selected.name}`;
  const copy = async () => {
    try {
      const response = await fetch(assetUrl(`design-system-icons/${selected.id}.svg`));
      if (!response.ok) throw new Error('SVG indisponível');
      const svg = await response.text();
      if (!svg.trimStart().startsWith('<svg')) throw new Error('SVG inválido');
      await navigator.clipboard.writeText(svg);
      setCopyMessage('SVG copiado.');
    } catch { setCopyMessage('Não foi possível copiar o SVG.'); }
  };
  return <DocumentationPage title="Ícones" currentItem="Ícones" className="icons-page" sections={sections}
    description="Consulte a seleção de ícones utilizada pelo IngCore e encontre símbolos para apoiar a navegação, as ações e a comunicação nas interfaces.">
    <aside className="icons-callout">
      <h2>Aprofunde sua consulta</h2>
      <p>Acesse os guias do Iconsax para tirar dúvidas sobre a biblioteca e encontrar informações diretamente na fonte.</p>
      <TextLink href="https://iconsax.io/" target="_blank" rel="noreferrer" className="icons-doc-link">Consultar documentação</TextLink>
    </aside>
    <section className="section-panel" id="explorar" aria-labelledby="icons-explore-title">
      <header className="section-header"><h2 id="icons-explore-title">Explore os ícones</h2></header>
      <div className="section-content">
        <p>A equipe utiliza a biblioteca gratuita do Iconsax. O portal documenta a seleção incorporada ao IngCore: os nomes e desenhos devem ser consultados no arquivo do Design System para manter a continuidade entre os projetos. Encontre um ícone pelo nome técnico ou por um termo em português. Selecione uma amostra para consultar sua referência e abrir o componente no Figma. Os grupos abaixo são uma proposta de organização para facilitar a busca.</p>
        <div className="icons-explorer">
          <InputField label="Buscar ícone" placeholder="Ex: search, pesquisar, pasta ou usuário" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} rightIcon={<img src={assetUrl('colors-search.svg')} alt="" />} />
          {filtered.length ? <>
            <div className="icons-grid" aria-label="Ícones disponíveis">{visible.map(icon => <button type="button" className="icon-card" key={icon.id} aria-label={`${icon.name} — ${icon.group}`} aria-pressed={selected.id === icon.id} onClick={() => { setSelected(icon); setCopyMessage(''); }}>
              <span className="icon-image"><img src={assetUrl(`design-system-icons/${icon.id}.svg`)} alt="" /></span><span>{icon.name}</span>
            </button>)}</div>
            <TablePagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} label="Páginas de ícones" summaryLabel="Ícones por página:" />
          </> : <p className="icons-empty" role="status">Nenhum ícone encontrado.</p>}
          <div className="icon-detail">
            <span className="icon-detail-preview"><span className="icon-image"><img src={assetUrl(`design-system-icons/${selected.id}.svg`)} alt="" /></span></span>
            <div className="icon-detail-info"><h3>{selected.name}</h3><p>{reference}</p><p>Frame de origem: 24 × 24 px</p></div>
            <div className="icon-detail-actions"><a className="button button--outlined button--medium" href={`https://www.figma.com/design/rDna8D13lVQpYDLx4Yjbzf/IngCore---Design-System?node-id=${selected.id}`} target="_blank" rel="noreferrer">Abrir Figma</a>
              <Button variant="outlined" iconOnly icon={<img src={assetUrl('icons/copy.svg')} alt="" />} aria-label="Copiar SVG do ícone" onClick={copy} /></div>
            <span className="icons-status" role="status">{copyMessage}</span>
          </div>
        </div>
        <p className="icons-caption">Os tamanhos de prévia ajudam a comparar a leitura e não estabelecem regras de tamanho para os componentes.</p>
      </div>
    </section>
    <section className="section-panel" id="acessibilidade" aria-labelledby="icons-accessibility-title">
      <header className="section-header"><h2 id="icons-accessibility-title">Significado e acessibilidade</h2></header>
      <div className="section-content"><p>A escolha da distância ajuda a expressar relação e prioridade. Estas orientações são propostas de documentação para o portal e precisam ser alinhadas às regras dos componentes.</p>
        <div className="icons-guidelines">
          <article><h3>Uma intenção consistente</h3><p>Use o mesmo símbolo para a mesma ação ao longo da interface. Nomes técnicos iguais devem apontar para a mesma referência do catálogo.</p></article>
          <article><h3>Ícone informativo ou decorativo</h3><p>Se o ícone transmite informação sem um texto equivalente, forneça uma alternativa acessível. Quando apenas repete o texto ao lado, trate-o como apoio decorativo.</p></article>
          <article><h3>Nomeie a ação, não o desenho</h3><p>Uma ação de busca pode ser chamada de “Pesquisar”. O nome interno search-normal ajuda a localizar o arquivo, mas não precisa ser o texto apresentado ao usuário.</p></article>
          <article><h3>Considere o alvo de interação</h3><p>O tamanho visível do ícone e a área clicável do controle são medidas distintas. A definição dessa área pertence ao componente que recebe o ícone.</p></article>
        </div>
      </div>
    </section>
  </DocumentationPage>;
}
