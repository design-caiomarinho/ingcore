import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { TabList } from '../components/TabList';
import { TabCell } from '../components/TabCell';
import { Button } from '../components/Button';
import { CodeTag } from '../components/CodeTag';
import { DataTable } from '../components/DataTable';
import { TablePagination } from '../components/TablePagination';


import { elevationSemantic, elevationPrimitives, elevationShadow } from '../../design-system/tokens/elevation';
import '../styles/elevation-page.scss';

const sections = [
  { label: 'Como se organiza', target: 'organizacao' },
  { label: 'Explore as sombras', target: 'explorar' },
  { label: 'Aplicação', target: 'aplicacao' },
];
function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}><header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header><div className="section-content">{children}</div></section>;
}
function ElevationExplorer() {
  const [layer, setLayer] = useState(0);
  const [name, setName] = useState('subtle');

  const [page, setPage] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const table = useRef<HTMLDivElement>(null);
  const selected = elevationSemantic.find(token => token.name === name)!;
  return <div className="elevation-explorer">
    <p>Selecione um token para comparar a sombra na mesma superfície. Na aba Primitivos, consulte as medidas que compõem a escala.</p>
    <div className="elevation-controls">
      <TabList className="elevation-tabs" aria-label="Camadas de elevação">{['Semânticos', 'Primitivos'].map((label, index) => <TabCell key={label} ref={el => {tabs.current[index] = el;}} selected={index === layer} id={`elevation-tab-${index}`} aria-controls={`elevation-panel-${index}`} tabIndex={layer === index ? 0 : -1} onClick={() => setLayer(index)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
        setLayer(next); tabs.current[next]?.focus();
      }}>{label}</TabCell>)}</TabList>
      {layer === 0 ? <div role="tabpanel" id="elevation-panel-0" aria-labelledby="elevation-tab-0" className="elevation-panel">
        <div className="elevation-options" role="group" aria-label="Níveis de elevação">{elevationSemantic.map(token => <Button key={token.name} variant="outlined" selected={token.name === name} onClick={() => setName(token.name)}>{token.name.charAt(0).toUpperCase() + token.name.slice(1)}</Button>)}</div>
        <div className="elevation-preview"><div className="elevation-canvas"><div className="elevation-surface" style={{boxShadow: elevationShadow(selected)}}><span>Superfície</span></div></div></div>
      </div> : <div role="tabpanel" id="elevation-panel-1" aria-labelledby="elevation-tab-1">
        <DataTable caption="Primitivos de sombras do IngCore Design System" minWidth={720} scrollRef={table} columns={[{id: 'reference', label: 'REFERÊNCIAS'}, {id: 'value', label: 'VALOR'}, {id: 'property', label: 'PARÂMETRO CSS'}]} rows={elevationPrimitives.slice((page - 1) * 10, page * 10).map(token => ({id: token.name, cells: [token.name, `${token.value} px`, token.property]}))}>
          <TablePagination total={elevationPrimitives.length} page={page} pageSize={10} onPageChange={next => {setPage(next); table.current?.scrollTo({left: 0});}} label="Páginas dos primitivos de sombras" />
        </DataTable>
        <p className="elevation-note">Esses parâmetros compõem <CodeTag>box-shadow</CodeTag>; não são propriedades CSS independentes.</p>
      </div>}
    </div>
  </div>;
}
export function Elevation() {
  return <DocumentationPage title="Elevação e sombras" currentItem="Elevação e sombras" className="elevation-page" sections={sections} description="Entenda como a profundidade visual ajuda a distinguir superfícies, indicar sobreposições e organizar a hierarquia da interface.">
    <Section id="organizacao" title="Como elevação e sombras se organizam">
      <p>Elevação representa a distância visual entre uma superfície e seu plano de fundo. A sombra é um dos recursos que ajudam a comunicar essa distância, junto à posição, à cor e à sobreposição dos elementos.</p>
      <div className="elevation-organization">
        <article className="elevation-card"><h3>Os valores de base</h3><p>Uma sombra combina deslocamento horizontal e vertical, desfoque, expansão e cor. Os valores da coleção <CodeTag>ref</CodeTag> permitem organizar essas medidas e manter composições consistentes.</p></article>
        <article className="elevation-card"><h3>As referências de elevação</h3><p>A coleção <CodeTag>sys-elevation</CodeTag> reúne os níveis <CodeTag>subtle</CodeTag>, <CodeTag>medium</CodeTag> e <CodeTag>strong</CodeTag>. Cada um referencia medidas da escala primitiva e a cor semântica da sombra.</p></article>
      </div>
      <div className="elevation-text"><h3>Sombra e ordem de sobreposição</h3><p><CodeTag>box-shadow</CodeTag> desenha a sombra, enquanto <CodeTag>z-index</CodeTag> participa da ordem de empilhamento. Aumentar a sombra não coloca um elemento à frente de outro.</p></div>
    </Section>
    <Section id="explorar" title="Explore as sombras"><ElevationExplorer /></Section>
    <Section id="aplicacao" title="Aplicação nas interfaces">
      <p>Compare os níveis na mesma superfície. A escolha da elevação em cards, menus e outros elementos deve seguir a especificação de cada componente.</p>
      <div className="elevation-examples">{elevationSemantic.map((token, index) => <article className="elevation-card" key={token.name}><div className="elevation-example-canvas"><div className="elevation-example" style={{boxShadow: elevationShadow(token)} as CSSProperties} /></div><h3>{token.name.charAt(0).toUpperCase() + token.name.slice(1)}</h3><p>{['Uma sombra discreta, com menor distância visual em relação ao fundo.', 'Uma sombra intermediária, com maior presença visual na superfície.', 'Uma sombra mais ampla, com maior separação visual em relação ao fundo.'][index]}</p></article>)}</div>
      <div className="elevation-text"><h3>Elevação reforça a hierarquia</h3><p>Use a sombra em conjunto com o espaçamento, a cor e a posição dos elementos. O nível de elevação não define sozinho a função ou o estado de um componente.</p></div>
      <div className="elevation-text"><h3>A cor acompanha o tema</h3><p>A referência <CodeTag>shadow-default</CodeTag> aponta para <CodeTag>palette-alpha-gray-100</CodeTag> em light e <CodeTag>palette-alpha-gray-400</CodeTag> em dark. A prévia mostra a composição em light, mantendo as medidas do DS.</p></div>
    </Section>
  </DocumentationPage>;
}
