import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { TabList } from '../components/TabList';
import { TabCell } from '../components/TabCell';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { CodeTag } from '../components/CodeTag';
import { strokePrimitives, strokeSemantic } from '../../design-system/tokens/stroke';
import '../styles/border-page.scss';

const sections = [
  { label: 'Como se organiza', target: 'organizacao' },
  { label: 'Explore os tokens', target: 'explorar' },
  { label: 'Aplicação', target: 'aplicacao' },
];
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}><header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header><div className="section-content">{children}</div></section>;
}
function BorderExplorer() {
  const [name, setName] = useState('none');
  const [layer, setLayer] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = strokeSemantic.find(token => token.name === name)!;
  return <div className="border-explorer">
    <p>Alterne entre os aliases semânticos e os valores primitivos. Selecione um token para visualizar a espessura em um contorno e em uma linha divisória.</p>
    <div className="border-controls">
      <TabList className="border-tabs" aria-label="Camadas de bordas">
        {['Semânticos', 'Primitivos'].map((label, index) => <TabCell key={label}
          ref={element => { tabRefs.current[index] = element; }} selected={layer === index}
          id={index === 0 ? 'border-semantic-tab' : 'border-primitive-tab'}
          aria-controls={index === 0 ? 'border-semantic-panel' : 'border-primitive-panel'}
          tabIndex={layer === index ? 0 : -1} onClick={() => setLayer(index)} onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
            setLayer(next);
            tabRefs.current[next]?.focus();
          }}>{label}</TabCell>)}
      </TabList>
      {layer === 0 ? <div role="tabpanel" id="border-semantic-panel" aria-labelledby="border-semantic-tab" className="border-panel">
        <div className="border-options" role="group" aria-label="Tokens de espessura">{strokeSemantic.map(token => <Button key={token.name} variant="outlined" selected={name === token.name} onClick={() => setName(token.name)}>{token.name.charAt(0).toUpperCase() + token.name.slice(1)}</Button>)}</div>
        <div className="border-preview" style={{ '--stroke-width': `${Math.max(1, selected.value)}px`, '--stroke-opacity': selected.value === 0 ? 0 : 1 } as CSSProperties}>
          <div className="border-canvas"><div className="border-surface"><span>{selected.reference.charAt(0).toUpperCase() + selected.reference.slice(1)}</span><span className="border-value">Valor: {selected.value}px</span></div></div>
        </div>
        <span className="sr-only" aria-live="polite">{selected.name}: {selected.reference}, {selected.value} px</span>
      </div> : <div role="tabpanel" id="border-primitive-panel" aria-labelledby="border-primitive-tab" className="border-primitives">
        <DataTable caption="Primitivos de bordas do IngCore Design System" minWidth={660}
          columns={[{id: 'reference', label: 'REFERÊNCIAS'}, {id: 'value', label: 'VALOR'}, {id: 'css', label: 'PROPRIEDADE CSS'}]}
          rows={strokePrimitives.map(token => ({id: token.name, cells: [token.name, token.value + ' px', 'border-width: ' + token.value + 'px;']}))} />
      </div>}
    </div>
  </div>;
}
const descriptions = [
  'Apresenta um contorno fino, com menor presença visual na forma.',
  'Apresenta um contorno médio, com maior presença visual na forma.',
  'Apresenta um contorno espesso, com forte presença visual na forma.',
];
export function Border() {
  return <DocumentationPage title="Bordas" currentItem="Bordas" className="border-page" sections={sections} description="Consulte os tokens de espessura e entenda como os contornos ajudam a delimitar elementos e organizar o conteúdo da interface.">
    <Section id="organizacao" title="Como as bordas se organizam">
      <p>Uma borda combina espessura, estilo e cor. Os tokens de <CodeTag>stroke</CodeTag> do IngCore definem a espessura; a cor deve ser consultada nos tokens de cores e o estilo deve seguir a especificação do componente.</p>
      <div className="border-organization">
        <article className="border-card"><h3>A escala de espessuras</h3><p>Tokens como <CodeTag>border-width-1</CodeTag> guardam valores concretos. Neste caso, 1 px. A coleção <CodeTag>ref</CodeTag> contém cinco medidas: 0, 1, 2, 4 e 8 px.</p></article>
        <article className="border-card"><h3>Os aliases do sistema</h3><p>Nomes como <CodeTag>subtle</CodeTag> referenciam a escala primitiva. No DS atual, <CodeTag>subtle</CodeTag> → <CodeTag>border-width-1</CodeTag> → 1 px. O componente define qual alias utilizar.</p></article>
      </div>
      <div className="border-text"><h3>Espessura não define o estado</h3><p>Um token como <CodeTag>strong</CodeTag> indica uma espessura de 4 px. Seu nome, por si só, não determina foco, seleção, erro ou outro estado de interação.</p></div>
    </Section>
    <Section id="explorar" title="Explore os tokens"><BorderExplorer /></Section>
    <Section id="aplicacao" title="Aplicação nas interfaces">
      <p>Compare os níveis de espessura no mesmo contexto. A aplicação de cada nível em campos, cards e outros elementos deve seguir as definições do componente.</p>
      <div className="border-examples">{strokeSemantic.slice(1).map((token, index) => <article className="border-card" key={token.name}><div className="border-example" style={{ borderWidth: token.value }} aria-hidden="true" /><h3>{token.name.charAt(0).toUpperCase() + token.name.slice(1)}</h3><p>{descriptions[index]}</p></article>)}</div>
      <div className="border-text"><h3>Espessura e cor trabalham juntas</h3><p>Uma borda mais espessa não substitui a escolha de uma cor adequada ao fundo. Consulte a documentação de Cores para selecionar os tokens semânticos de borda previstos no sistema.</p></div>
      <div className="border-text"><h3>Foco tem sua própria definição</h3><p>O indicador de foco deve seguir os tokens e as regras de foco do DS. Não associe automaticamente <CodeTag>medium</CodeTag> ou <CodeTag>strong</CodeTag> à navegação por teclado.</p></div>
      <div className="border-text"><h3>Espessura zero</h3><p><CodeTag>none</CodeTag> referencia <CodeTag>border-width-0</CodeTag>, de 0 px. Na prévia, esse token remove o contorno visível e mantém o espaço do conteúdo para facilitar a comparação.</p></div>
    </Section>
  </DocumentationPage>;
}
