import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { TabList } from '../components/TabList';
import { TabCell } from '../components/TabCell';
import { Button } from '../components/Button';
import { CodeTag } from '../components/CodeTag';
import { DataTable } from '../components/DataTable';
import { TablePagination } from '../components/TablePagination';
import { transparencyLabelInverse, transparencyGroups, transparencySemantic, transparencyPrimitives, type TransparencyGroup } from '../../design-system/tokens/transparency';
import '../styles/transparency-page.scss';

const sections = [{label: 'Como se organiza', target: 'organizacao'}, {label: 'Explore as referências', target: 'explorar'}, {label: 'Aplicação', target: 'aplicacao'}];
function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}><header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header><div className="section-content">{children}</div></section>;
}
function TransparencyExplorer() {
  const intensityId = useId();
  const [layer, setLayer] = useState(0);
  const [group, setGroup] = useState<TransparencyGroup>('Neutral');
  const [name, setName] = useState('overlay-neutral-none');
  const [page, setPage] = useState(1);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const dragging = useRef(false);
  const pointerValue = useRef(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const table = useRef<HTMLDivElement>(null);
  const tokens = transparencySemantic.filter(token => token.group === group);
  const selected = tokens.find(token => token.name === name) ?? tokens[0];
  const selectedIndex = tokens.indexOf(selected);
  const sliderPosition = dragValue ?? selectedIndex;
  const progress = sliderPosition / (tokens.length - 1) * 100;
  const finishDrag = () => {
    if (!dragging.current) return;
    setName(tokens[Math.round(pointerValue.current)].name);
    dragging.current = false;
    setDragValue(null);
  };
  const selectedLabel = selected.label.charAt(0).toUpperCase() + selected.label.slice(1);
  return <div className="transparency-explorer">
    <p>Consulte os overlays semânticos e as cores alpha primitivas. Selecione uma referência para ver a transparência sobre o fundo ou a opacidade aplicada ao elemento inteiro.</p>
    <div className="transparency-controls">
      <TabList className="transparency-tabs" aria-label="Camadas de transparência">{['Semânticos', 'Primitivos'].map((label, index) => <TabCell key={label} ref={el => {tabs.current[index] = el;}} selected={layer === index} id={`transparency-tab-${index}`} aria-controls={`transparency-panel-${index}`} tabIndex={layer === index ? 0 : -1} onClick={() => setLayer(index)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
        setLayer(next); tabs.current[next]?.focus();
      }}>{label}</TabCell>)}</TabList>
      {layer === 0 ? <div role="tabpanel" id="transparency-panel-0" aria-labelledby="transparency-tab-0" className="transparency-panel">
        <div className="transparency-options" role="group" aria-label="Grupos de transparência">{transparencyGroups.map(item => <Button key={item} variant="outlined" selected={item === group} onClick={() => {setGroup(item); setName(''); setDragValue(null); dragging.current = false;}}>{item}</Button>)}</div>
        <div className="transparency-intensity">
          <div className="intensity-heading"><label htmlFor={intensityId}>Intensidade</label><output htmlFor={intensityId}>{selectedLabel} · {selected.amount.toLocaleString('pt-BR')}%</output></div>
          <input id={intensityId} type="range" min={0} max={tokens.length - 1} step="any" value={sliderPosition}
            style={{'--slider-fill': `calc(${progress}% + ${8 - progress * 0.16}px)`} as CSSProperties}
            aria-valuetext={selectedLabel + ', ' + selected.amount.toLocaleString('pt-BR') + '%'}
            onPointerDown={event => {event.currentTarget.setPointerCapture(event.pointerId); dragging.current = true; pointerValue.current = sliderPosition;}}
            onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag} onBlur={finishDrag}
            onChange={event => {
              const value = Number(event.target.value);
              pointerValue.current = value;
              setName(tokens[Math.round(value)].name);
              setDragValue(dragging.current ? value : null);
            }}
            onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) return;
              event.preventDefault();
              const direction = ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(event.key) ? -1 : 1;
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? tokens.length - 1 : Math.max(0, Math.min(tokens.length - 1, selectedIndex + direction));
              setName(tokens[next].name); setDragValue(null);
            }} />
          <div className="intensity-scale" aria-hidden="true">{tokens.map(token => <span key={token.name}><i />{token.amount.toLocaleString('pt-BR')}%</span>)}</div>
        </div>
        <div className="transparency-preview"><div className="transparency-canvas"><div className="transparency-composition" data-zero={selected.amount === 0 || undefined}>{group !== 'Transparent' && <div className="transparency-backdrop" aria-hidden="true" />}<div className="transparency-surface" data-inverse={selected.property !== 'opacity' && transparencyLabelInverse(selected.css) || undefined} style={{'--preview-color': selected.property === 'opacity' ? 'var(--sys-color-surface-brand-subtle-emphasis)' : selected.css, opacity: selected.property === 'opacity' ? Number(selected.css) : 1} as CSSProperties}><span>Superfície</span></div><svg className="transparency-outline" aria-hidden="true"><rect width="100%" height="100%" rx="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" /></svg></div></div></div>
        {group === 'Transparent' && <p className="transparency-caption">O percentual controla a visibilidade da camada inteira, incluindo fundo, texto, bordas e elementos internos. Ele não representa a transparência de uma cor isolada. Em 0%, toda a camada fica invisível.</p>}
      </div> : <div role="tabpanel" id="transparency-panel-1" aria-labelledby="transparency-tab-1">
        <DataTable caption="Primitivos de transparência do IngCore Design System" minWidth={900} scrollRef={table} columns={[{id: 'reference', label: 'REFERÊNCIAS'}, {id: 'value', label: 'VALOR'}, {id: 'css', label: 'PROPRIEDADE CSS'}]} rows={transparencyPrimitives.slice((page - 1) * 10, page * 10).map(token => ({id: token.name, cells: [token.name, token.value, token.css]}))}>
          <TablePagination total={transparencyPrimitives.length} page={page} pageSize={10} onPageChange={next => {setPage(next); table.current?.scrollTo({left: 0});}} label="Páginas dos primitivos de transparência" />
        </DataTable>
      </div>}
    </div>
  </div>;
}
export function Transparency() {
  return <DocumentationPage title="Transparência e opacidade" currentItem="Transparência" className="transparency-page" sections={sections} description="Entenda como a transparência combina camadas e como a opacidade altera a presença visual de elementos e conteúdos na interface.">
    <Section id="organizacao" title="Como transparência e opacidade se organizam">
      <p>Transparência permite perceber o que está atrás de uma camada. Opacidade expressa quanto essa camada permanece visível: 0 representa transparência total e 1 representa opacidade total.</p>
      <div className="transparency-organization"><article className="transparency-card"><h3>As cores com alpha</h3><p>Uma cor pode incluir um canal alpha, que define sua opacidade. Referências como <CodeTag>palette-alpha-gray-400</CodeTag> combinam a cor de base com um valor de alpha disponível no DS.</p></article><article className="transparency-card"><h3>As referências de aplicação</h3><p>Tokens de overlay apontam para cores com transparência e comunicam uma função. Por exemplo, <CodeTag>overlay-neutral-medium</CodeTag> referencia uma cor alpha da escala de cinzas. A coleção <CodeTag>sys-transparent</CodeTag> reúne os aliases de opacidade.</p></article></div>
      <div className="transparency-text"><h3>Cor transparente e opacidade do elemento</h3><p>O alpha de <CodeTag>background-color</CodeTag> afeta o fundo. A propriedade <CodeTag>opacity</CodeTag> afeta a composição visual do elemento inteiro, incluindo texto, bordas e elementos filhos.</p></div>
    </Section>
    <Section id="explorar" title="Explore as referências"><TransparencyExplorer /></Section>
    <Section id="aplicacao" title="Aplicação nas interfaces">
      <p>Escolha a referência conforme o que precisa ficar transparente. Preserve as definições de cor, estado e legibilidade previstas para cada componente.</p>
      <div className="transparency-organization"><article className="transparency-card"><h3>Transparência no fundo</h3><p>Use uma cor com alpha para permitir que o fundo apareça através da camada, preservando a opacidade do texto e dos demais conteúdos.</p><pre className="code-block"><code>{'background-color: rgba(21, 27, 36, 0.4);'}</code></pre></article><article className="transparency-card"><h3>Opacidade no elemento</h3><p>Use <CodeTag>opacity</CodeTag> quando a composição inteira deve ter sua presença visual reduzida. O texto e os elementos filhos também recebem esse efeito.</p><pre className="code-block"><code>{'opacity: 0.4;'}</code></pre></article></div>
      <div className="transparency-text"><h3>O resultado depende do fundo</h3><p>Uma cor transparente se mistura com a superfície atrás dela. Verifique o contraste no contexto de uso e consulte as referências semânticas para cada tema.</p></div>
    </Section>
  </DocumentationPage>;
}
