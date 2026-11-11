import { useRef, useState, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { TabCell } from '../components/TabCell';
import { Button } from '../components/Button';
import { CodeTag } from '../components/CodeTag';
import { radiusPrimitives, radiusSemantic } from '../../design-system/tokens/radius';
import '../styles/radius-page.scss';

const sections = [
  {label: 'Como se organiza', target: 'organizacao'},
  {label: 'Explore os tokens', target: 'explorar'},
  {label: 'Aplicação', target: 'aplicacao'},
];
function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}><header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header><div className="section-content">{children}</div></section>;
}
function RadiusExplorer() {
  const [layer, setLayer] = useState(0);
  const [semantic, setSemantic] = useState('sm');
  const [primitive, setPrimitive] = useState('radius-2');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tokens = layer === 0 ? radiusSemantic : radiusPrimitives;
  const selected = tokens.find(token => token.name === (layer === 0 ? semantic : primitive)) ?? tokens[0];
  const selectLayer = (index: number) => { setLayer(index); refs.current[index]?.focus(); };
  return <div className="radius-explorer">
    <p>Alterne entre os aliases semânticos e a escala primitiva. Selecione um token para comparar o mesmo valor em uma superfície retangular e em uma forma quadrada.</p>
    <div className="radius-controls">
      <div className="radius-tabs" role="tablist" aria-label="Camadas de arredondamento">{['Semânticos', 'Primitivos'].map((label, index) => <TabCell key={label} ref={el => {refs.current[index] = el;}} selected={index === layer} id={`radius-tab-${index}`} aria-controls={`radius-panel-${index}`} tabIndex={index === layer ? 0 : -1} onClick={() => setLayer(index)} onKeyDown={event => {if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {event.preventDefault(); selectLayer(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index);}}}>{label}</TabCell>)}</div>
      <div role="tabpanel" id={`radius-panel-${layer}`} aria-labelledby={`radius-tab-${layer}`} className="radius-panel">
        <div className="radius-options" role="group" aria-label="Tokens de arredondamento">{tokens.map(token => <Button key={token.name} variant="outlined" selected={token.name === selected.name} onClick={() => layer === 0 ? setSemantic(token.name) : setPrimitive(token.name)}>{layer === 0 ? token.name.charAt(0).toUpperCase() + token.name.slice(1) : token.name}</Button>)}</div>
        <p className="radius-selection" aria-live="polite">{selected.name} {layer === 0 && <>→ {selected.reference}</>} → {selected.value} px · <CodeTag>border-radius: {selected.value}px;</CodeTag></p>
        <div className="radius-preview"><div className="radius-canvas"><div className="radius-surface" data-max={selected.value === 999 || undefined} style={{borderRadius: selected.value}}><span>Superfície</span><i className="radius-corners" aria-hidden="true" /><div className="radius-shape" style={{borderRadius: selected.value}}>Forma<i className="radius-corners" aria-hidden="true" /></div></div></div></div>
      </div>
    </div>
  </div>;
}
export function Radius() {
  return <DocumentationPage title="Arredondamento" currentItem="Arredondamento" className="radius-page" sections={sections} description="Consulte os tokens de radius e compare como os cantos definem a forma de elementos e superfícies na interface.">
    <Section id="organizacao" title="Como o arredondamento se organiza">
      <div className="radius-content"><p><CodeTag>Radius</CodeTag> determina a curvatura dos cantos. A escala primitiva armazena os valores; os tokens semânticos oferecem nomes de referência para utilizá-los no sistema.</p>
        <div className="radius-organization"><article className="radius-card"><h3>A escala de valores</h3><p>Tokens como <CodeTag>radius-2</CodeTag> representam uma medida concreta: neste caso, 8 px. Eles formam a base para os aliases e permitem manter uma escala consistente.</p></article>
          <article className="radius-card"><h3>Os nomes de aplicação</h3><p>Tokens como <CodeTag>sm</CodeTag> apontam para a escala primitiva. No DS atual, <CodeTag>sm</CodeTag> → <CodeTag>radius-2</CodeTag> → 8 px. A escolha de cada token em um componente depende da sua especificação.</p></article></div>
        <div className="radius-text"><h3>Nome do token e propriedade CSS</h3><p>Os nomes primitivos são apresentados com traços, mantendo o padrão das outras páginas. A propriedade é <CodeTag>border-radius</CodeTag>. O arquivo ainda não registra nomes de variáveis CSS para esses tokens; as declarações abaixo mostram os valores resolvidos.</p></div>
      </div>
    </Section>
    <Section id="explorar" title="Explore os tokens"><RadiusExplorer /></Section>
    <Section id="aplicacao" title="Aplicação nas interfaces">
      <p>O mesmo valor pode produzir formas diferentes conforme a largura e a altura do elemento. Compare a escala e preserve as definições do componente ao aplicar um token.</p>
      <div className="radius-examples">
        <article className="radius-card"><div className="radius-example" style={{borderRadius: 0}}><i /></div><h3>Sem arredondamento</h3><p>Mantém os cantos retos e preserva a forma angular do elemento.</p></article>
        <article className="radius-card"><div className="radius-example" style={{borderRadius: 8}}><i /></div><h3>Curvatura intermediária</h3><p>Suaviza os cantos e mantém o contorno retangular do elemento.</p></article>
        <article className="radius-card"><div className="radius-example" style={{borderRadius: 999}}><i /></div><h3>Arredondamento máximo</h3><p>Arredonda as extremidades e cria uma forma alongada de cápsula.</p></article>
      </div>
      <div className="radius-text"><h3>Full não significa uma dimensão fixa</h3><p>No IngCore, <CodeTag>full</CodeTag> referencia <CodeTag>radius-max</CodeTag>, de 999 px. A curvatura efetiva é limitada pelas dimensões da forma: um quadrado pode se tornar circular, enquanto um retângulo alongado assume formato de cápsula.</p></div>
      <div className="radius-text"><h3>Consistência entre elementos</h3><p>Use a especificação do componente como referência para escolher o token. Não associe automaticamente um tamanho como <CodeTag>sm</CodeTag> a um tipo de controle: esse mapeamento precisa estar documentado no próprio componente.</p></div>
    </Section>
  </DocumentationPage>;
}
