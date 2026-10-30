import { useRef, useState, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { DataTable } from '../components/DataTable';
import { TabCell } from '../components/TabCell';
import { Button } from '../components/Button';
import { CodeTag } from '../components/CodeTag';
import { assetUrl } from '../paths';
import { spacingSemantic, spacingPrimitives, spacingValueLabel } from '../../design-system/tokens/spacing';
import '../styles/spacing-page.scss';

const sections = [
  {label: 'Organização dos tokens', target: 'organizacao'},
  {label: 'Explore o espaçamento', target: 'explorar'},
  {label: 'Aplicação', target: 'aplicacao'},
  {label: 'Ritmo e hierarquia', target: 'ritmo'},
];
function SpacingSection({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}>
    <header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="section-content">{children}</div>
  </section>;
}
function SpacingTabs({id, label, labels, selected, onSelect}: {id: string; label: string; labels: [string, string]; selected: number; onSelect: (index: number) => void}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="spacing-tabs" role="tablist" aria-label={label}>{labels.map((text, index) => <TabCell key={text}
    ref={element => { refs.current[index] = element; }} selected={selected === index} id={`${id}-tab-${index}`}
    aria-controls={`${id}-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => onSelect(index)}
    onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      onSelect(next); refs.current[next]?.focus();
    }}>{text}</TabCell>)}</div>;
}
function SpacingExplorer() {
  const [layer, setLayer] = useState(0);
  const tokens = layer === 0 ? spacingSemantic : spacingPrimitives;
  return <div className="spacing-explorer">
    <p>Alterne entre os aliases de <CodeTag>sys-spacing</CodeTag> e a escala completa de <CodeTag>ref</CodeTag>. A tabela mostra os nomes originais, os valores resolvidos e suas referências. A barra permite comparar as medidas na mesma escala visual.</p>
    <div className="spacing-controls">
      <SpacingTabs id="spacing-layer" label="Camadas de espaçamento" labels={['Semânticos', 'Primitivos']} selected={layer} onSelect={setLayer} />
      <div role="tabpanel" id={`spacing-layer-panel-${layer}`} aria-labelledby={`spacing-layer-tab-${layer}`}>
        <DataTable caption={layer === 0 ? 'Tokens semânticos de espaçamento do IngCore Design System' : 'Tokens primitivos de espaçamento do IngCore Design System'} minWidth={900}
          columns={[{id: 'token', label: 'TOKENS'}, ...(layer === 0 ? [{id: 'reference', label: 'PRIMITIVE (REF)'}] : []), {id: 'value', label: 'VALOR'}, {id: 'measure', label: 'MEDIDA'}]}
          rows={tokens.map(token => ({id: token.id, cells: [token.name, ...(layer === 0 ? [token.reference] : []), spacingValueLabel(token.value),
            typeof token.value === 'number' ? <span className="spacing-measure" style={{width: token.value}} aria-label={`${token.value} pixels`} /> : null,
          ]}))} />
      </div>
    </div>
  </div>;
}
function SpacingApplication() {
  const [property, setProperty] = useState(0);
  const [selected, setSelected] = useState('none');
  const token = spacingSemantic.find(item => item.name === selected)!;
  const value = Number(token.value);
  return <div className="spacing-application">
    <p>A mesma medida pode ser aplicada a propriedades diferentes. Escolha um valor existente do DS e compare o efeito de <CodeTag>padding</CodeTag> e <CodeTag>gap</CodeTag>.<br />A composição abaixo é ilustrativa e não define medidas obrigatórias para os componentes.</p>
    <div className="spacing-controls">
      <SpacingTabs id="spacing-property" label="Propriedade de espaçamento" labels={['Padding', 'Gap']} selected={property} onSelect={setProperty} />
      <div className="spacing-options" role="group" aria-label="Medida de espaçamento">{spacingSemantic.map(item => <Button key={item.id} variant="outlined" selected={selected === item.name} onClick={() => setSelected(item.name)}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Button>)}</div>
      <div className="spacing-preview" role="tabpanel" id={`spacing-property-panel-${property}`} aria-labelledby={`spacing-property-tab-${property}`}>
        <div className="spacing-preview-canvas"><div className="spacing-preview-content" style={{padding: property === 0 ? value : 8, gap: property === 1 ? value : 8}} aria-label={`${property === 0 ? 'Padding' : 'Gap'}: ${value} pixels`}>
          <div>Conteúdo A</div><div>Conteúdo B</div>
        </div></div>
      </div>
    </div>
  </div>;
}
function TokenFlow({items}: {items: string[]}) {
  return <div className="spacing-token-flow">{items.map((item, index) => <span className="spacing-flow-item" key={index}>
    {index > 0 && <span className="spacing-flow-icon"><img src={assetUrl('colors-flow-right.svg')} alt="aponta para" /></span>}<CodeTag>{item}</CodeTag>
  </span>)}</div>;
}
export function Spacing() {
  return <DocumentationPage title="Espaçamento" currentItem="Espaçamentos" className="spacing-page" sections={sections}
    description="Organize a relação entre conteúdos, componentes e seções. Conheça a escala do IngCore e consulte os tokens para construir interfaces consistentes.">
    <SpacingSection id="organizacao" title="Como o espaçamento se organiza">
      <div className="content-group"><p>Espaçamento é a distância que separa elementos ou cria respiro dentro de um contêiner. Uma escala compartilhada ajuda a manter um ritmo visual e a reconhecer quais conteúdos pertencem ao mesmo grupo.</p>
        <div className="spacing-cards spacing-organization">
          <div className="spacing-card-flow"><article className="spacing-card"><h3>Uma escala de referência</h3><p>A escala numérica parte de zero e cresce em passos de 4 px, até 80 px.<br />O número do token representa uma posição na escala.</p></article><TokenFlow items={['spacing-4', '16 px']} /></div>
          <div className="spacing-card-flow"><article className="spacing-card"><h3>O papel de cada texto</h3><p>Os nove tokens de <CodeTag>sys-spacing</CodeTag> apontam para valores da coleção <CodeTag>ref</CodeTag>.<br />Eles oferecem uma seleção da escala com nomes como <CodeTag>xs</CodeTag>, <CodeTag>md</CodeTag> e <CodeTag>lg</CodeTag>.</p></article><TokenFlow items={['lg', 'spacing-4', '16 px']} /></div>
        </div>
      </div>
      <div className="text-group"><h3>O contexto define a aplicação</h3><p>Os nomes indicam posições relativas na escala. O arquivo não estabelece, por exemplo, que <CodeTag>lg</CodeTag> seja obrigatório em cards ou que <CodeTag>xl</CodeTag> seja a distância entre seções. Essas regras dependem do contexto e ainda precisam ser documentadas.</p></div>
    </SpacingSection>
    <SpacingSection id="explorar" title="Explore o espaçamento"><SpacingExplorer /></SpacingSection>
    <SpacingSection id="aplicacao" title="Visualize a aplicação"><SpacingApplication /></SpacingSection>
    <SpacingSection id="ritmo" title="Ritmo e hierarquia">
      <div className="content-group"><p>A escolha da distância ajuda a expressar relação e prioridade. Estas orientações são propostas de documentação para o portal e precisam ser alinhadas às regras dos componentes.</p>
        <div className="spacing-cards spacing-guidelines">
          <article className="spacing-card"><h3>Aproxime conteúdos relacionados</h3><p>Elementos do mesmo grupo podem ter uma distância menor que a utilizada entre grupos distintos. Defina essa relação de forma consistente ao longo da página.</p></article>
          <article className="spacing-card"><h3>Preserve a composição</h3><p>Use <CodeTag>padding</CodeTag> para o respiro interno e <CodeTag>gap</CodeTag> para a distância entre itens de um layout. <CodeTag>Margin</CodeTag> controla o espaço externo de um elemento e depende do fluxo em que ele está inserido.</p></article>
          <article className="spacing-card"><h3>Adapte sem inventar uma nova escala</h3><p>Em telas menores, reveja agrupamentos e disposição. Alterações nas medidas devem considerar a escala existente e regras responsivas aprovadas.</p></article>
          <article className="spacing-card"><h3>Trate auto como um caso específico</h3><p>O primitivo <CodeTag>spacing-auto</CodeTag> tem valor <CodeTag>auto</CodeTag>. Ele não representa uma distância fixa em pixels; sua aplicação depende de a propriedade CSS aceitar esse valor, como em determinados usos de <CodeTag>margin</CodeTag>.</p></article>
        </div>
      </div>
    </SpacingSection>
  </DocumentationPage>;
}
