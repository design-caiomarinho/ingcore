import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import type { PageSection } from '../components/MobileSections';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { TablePagination } from '../components/TablePagination';
import { InputField } from '../components/InputField';
import { TabCell } from '../components/TabCell';
import { TextLink } from '../components/TextLink';
import { InlineCode } from '../components/CodeTag';
import { assetUrl } from '../paths';
import { typographyPrimitives, typographyGroups, typographyRecipes, typographySampleStyle, typographyDetails, type TypographyRecipe, type TypographyGroup } from '../../design-system/tokens/typography';
import '../styles/typography-page.scss';

const sections: PageSection[] = [
  {label: 'Organização dos tokens', target: 'organizacao'},
  {label: 'Família tipográfica', target: 'familia'},
  {label: 'Explore a tipografia', target: 'explorar'},
  {label: 'Hierarquia e aplicação', target: 'hierarquia'},
];
const defaultSample = 'Construa experiências consistentes.';
const recipe = (id: string) => typographyRecipes.find(recipe => recipe.id === id)!;

function TypographySection({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}>
    <header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="section-content">{children}</div>
  </section>;
}

function TypographySample({item, sample}: {item: TypographyRecipe; sample: string}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const details = typographyDetails(item);
  return <article className="type-sample">
    <div className="type-sample-heading"><h3>{item.label}</h3><p>{item.family} · {item.size} px · {item.weight} · {item.height} · {item.letterSpacing}</p></div>
    <p className="type-preview" style={typographySampleStyle(item)}>{sample || defaultSample}</p>
    <div className="type-disclosure">
      <TextLink className="type-reference-link" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-details`}
        onClick={() => setOpen(value => !value)} icon={<span className="type-reference-icon"><img src={assetUrl('type-arrow-down.svg')} alt="" /></span>}>Valores CSS e referências</TextLink>
      <div className="type-details" id={`${id}-details`} role="region" aria-label={`Valores CSS e referências de ${item.label}`}
        aria-hidden={!open} inert={!open} data-open={open || undefined}>
        <div className="type-details-clip"><div className="type-details-content">
          <pre className="type-css code-block"><code>{details.css}</code></pre>
          <dl className="type-references">{details.references.map(property => <div key={property.name}>
            <dt>{property.name}</dt><dd>{property.reference}</dd>
          </div>)}</dl>
        </div></div>
      </div>
    </div>
  </article>;
}
function TypographyExplorer() {
  const [layer, setLayer] = useState<'semantic' | 'primitive'>('semantic');
  const [page, setPage] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tableScroll = useRef<HTMLDivElement>(null);
  const pageSize = 10;
  useEffect(() => { tableScroll.current?.scrollTo({left: 0}); }, [page, layer]);
  const [group, setGroup] = useState<TypographyGroup>('Display');
  const [sample, setSample] = useState(defaultSample);
  return <div className="type-explorer">
    <p>Na aba Semânticos, consulte os conjuntos por papel e compare suas amostras. Na aba Primitivos, veja os valores que compõem esses conjuntos. Cada amostra apresenta suas medidas; os detalhes reúnem a declaração CSS equivalente e as referências da origem.</p>
    <div className="type-controls">
      <div className="type-tabs" role="tablist" aria-label="Camadas de tipografia">
        {(['semantic', 'primitive'] as const).map((value, index) => <TabCell key={value}
          ref={element => { tabRefs.current[index] = element; }} id={`type-tab-${value}`}
          selected={layer === value} aria-controls={`type-panel-${value}`} tabIndex={layer === value ? 0 : -1}
          onClick={() => setLayer(value)} onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
            setLayer(next === 0 ? 'semantic' : 'primitive');
            tabRefs.current[next]?.focus();
          }}>{value === 'semantic' ? 'Semânticos' : 'Primitivos'}</TabCell>)}
      </div>
      {layer === 'semantic' && <><div className="type-groups" role="group" aria-label="Papéis tipográficos">
        {typographyGroups.map(item => <Button key={item} variant="outlined" selected={item === group} onClick={() => setGroup(item)}>{item}</Button>)}
      </div>
      <InputField label="Texto para visualizar a escala" value={sample} maxLength={200} onChange={event => setSample(event.target.value)} /></>}
    </div>
    {layer === 'semantic' ? <div className="type-samples" role="tabpanel" id="type-panel-semantic" aria-labelledby="type-tab-semantic">
      {typographyRecipes.filter(item => item.group === group).map(item => <TypographySample key={item.id} item={item} sample={sample} />)}
    </div> : <div className="type-primitives" role="tabpanel" id="type-panel-primitive" aria-labelledby="type-tab-primitive">
      <DataTable caption="Primitivos tipográficos do IngCore Design System" minWidth={960} scrollRef={tableScroll}
        columns={[{id: 'reference', label: 'REFERÊNCIA · REF'}, {id: 'value', label: 'VALOR'}, {id: 'css', label: 'PROPRIEDADE CSS'}]}
        rows={typographyPrimitives.slice((page - 1) * pageSize, page * pageSize).map(item => ({id: item.id, cells: [
          <code>{item.reference}</code>, String(item.value), <code>{item.css}</code>,
        ]}))}>
        <TablePagination total={typographyPrimitives.length} page={page} pageSize={pageSize} onPageChange={setPage} label="Páginas dos primitivos tipográficos" />
      </DataTable>
    </div>}
    <p>As amostras usam os valores dos tokens, sem criar uma nova escala. O modo existente não define, por si só, as regras de tablet e mobile.</p>
  </div>;
}

export function Typography() {
  return <DocumentationPage title="Tipografia" currentItem="Tipografia" className="typography-page" sections={sections}
    description="Conheça as famílias, a escala e os estilos tipográficos do IngCore. Consulte os valores e entenda como construir a hierarquia dos textos.">
    <TypographySection id="organizacao" title="Como a tipografia se organiza">
      <div className="content-group">
        <p><InlineCode>A tipografia reúne decisões que trabalham em conjunto: família, tamanho, peso, entrelinha e espaçamento entre letras. Os primitivos da coleção ref guardam os valores de referência. A coleção sys-type combina essas referências em papéis para diferentes tipos de texto.</InlineCode></p>
        <div className="type-cards">
          <article className="type-card"><h3>Os valores da tipografia</h3><p>Definem famílias, tamanhos, pesos e espaçamentos que podem ser compartilhados entre estilos.</p></article>
          <article className="type-card"><h3>O papel de cada texto</h3><p>Organizam os valores em Display, Heading, Body, Label e Caption, com variações conforme a necessidade.</p></article>
        </div>
      </div>
      <div className="text-group"><h3>Um estilo é uma combinação de propriedades</h3><p>Heading Medium, por exemplo, combina {recipe('heading/md').family}, tamanho de {recipe('heading/md').size} px, peso {recipe('heading/md').weight}, entrelinha de {recipe('heading/md').height} e espaçamento entre letras de {recipe('heading/md').letterSpacing}. As propriedades são consultadas juntas para preservar a relação entre os textos da interface.</p></div>
    </TypographySection>
    <TypographySection id="familia" title="Família tipográfica">
      <div className="content-group">
        <p>Inter é a família utilizada nos conjuntos tipográficos consultados do Design System. As referências de família base e display apontam para a mesma fonte; a hierarquia é construída pelas demais propriedades.</p>
        <div className="type-family-card">
          <div className="type-family-specimen"><h3>Família base e display</h3><div style={{fontFamily: recipe('display/lg').family}}><p className="type-family-name">{recipe('display/lg').family}</p><p className="type-alphabet">Aa Bb Cc - 0123456789</p></div></div>
          <dl className="type-weights">{[['Regular', 'body/lg/regular'], ['Medium', 'body/lg/medium'], ['Semibold', 'heading/lg']].map(([label, id]) => <div key={id}><dt>{label}</dt><dd>{recipe(id).weight}</dd></div>)}</dl>
        </div>
      </div>
    </TypographySection>
    <TypographySection id="explorar" title="Explore a tipografia"><TypographyExplorer /></TypographySection>
    <TypographySection id="hierarquia" title="Hierarquia e aplicação">
      <div className="content-group">
        <p>Os papéis tipográficos ajudam a organizar a leitura. O exemplo abaixo propõe uma relação entre título, subtítulo e texto de apoio com conjuntos existentes do DS. Sua aplicação é uma proposta para discussão.</p>
        <div className="type-hierarchy-content">
          <div className="type-hierarchy">
            <div><p style={typographySampleStyle(recipe('display/sm'))}>Uma hierarquia que orienta a leitura</p><p className="type-role-label">Display · Small (Circunstancial)</p></div>
            <div><p style={typographySampleStyle(recipe('heading/lg'))}>Organize o conteúdo por importância</p><p className="type-role-label">Heading · Large</p></div>
            <div><p style={typographySampleStyle(recipe('body/lg/regular'))}>Títulos apresentam o assunto. Subtítulos dividem as seções. O texto de apoio desenvolve a informação e mantém a leitura contínua.</p><p className="type-role-label">Body · Large · Regular</p></div>
          </div>
          <div className="type-cards type-guidelines">
            <article className="type-card"><h3>Defina o papel antes do tamanho</h3><p>Escolha o conjunto pela função do texto. Display e Heading podem estabelecer destaque e hierarquia; Body desenvolve a leitura; Label e Caption atendem a textos de interface e apoio.</p></article>
            <article className="type-card"><h3>Preserve a estrutura do conteúdo</h3><p>A aparência visual e o nível do título no HTML são decisões relacionadas. Organize os níveis conforme a estrutura da página, sem depender apenas do tamanho da fonte.</p></article>
          </div>
        </div>
      </div>
    </TypographySection>
  </DocumentationPage>;
}
