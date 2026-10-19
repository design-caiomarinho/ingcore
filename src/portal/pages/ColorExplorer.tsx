import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../paths';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { TabCell } from '../components/TabCell';
import { InlineCode } from '../components/CodeTag';
import { findColors, primitiveGroups, semanticGroups, type ColorLayer, type ColorValue } from '../../design-system/tokens/explorer-colors';

function ColorSample({ value }: { value: ColorValue }) {
  return <div className="semantic-color">
    <span className="semantic-swatch" style={{ backgroundColor: value.cssValue }} aria-hidden="true" />
    <div className="semantic-value">{value.alias && <code>{value.alias}</code>}<span>{value.hex}</span></div>
  </div>;
}

/** Explorador específico de Cores; ainda não registrado como componente de catálogo. */
export function ColorExplorer() {
  const [layer, setLayer] = useState<ColorLayer>('semantic');
  const [group, setGroup] = useState('canvas');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const groups = layer === 'semantic' ? semanticGroups : primitiveGroups;
  const currentGroup = groups.find(item => item.id === group)!;
  const matches = findColors(layer, group, query);
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = matches.slice(start, start + pageSize);
  const windowStart = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => windowStart + index);
  const searching = query.trim().length > 0;

  useEffect(() => { scrollRef.current?.scrollTo({ left: 0 }); }, [layer, group, query, page, pageSize]);

  function selectLayer(next: ColorLayer) {
    if (next === layer) return;
    setLayer(next);
    setGroup(next === 'semantic' ? 'canvas' : 'blue');
    setQuery('');
    setPage(1);
  }

  function selectPage(next: number) {
    if (next === currentPage || next < 1 || next > pageCount) return;
    setPage(next);
  }

  return <div className="color-explorer">
    <p><InlineCode>Consulte as duas camadas de cores do IngCore em um único lugar. Os primitivos da coleção ref definem os valores da paleta; os semânticos de sys-color indicam onde essas cores se aplicam. Escolha um grupo para consultar seus tokens ou pesquise em todo o catálogo pelo nome CSS, referência ou valor hexadecimal.</InlineCode></p>
    <div className="color-controls">
      <div className="color-tabs" role="tablist" aria-label="Camadas de cores">
        {(['semantic', 'primitive'] as const).map((value, index) => <TabCell key={value} ref={element => { tabRefs.current[index] = element; }}
          id={`color-tab-${value}`}
          selected={layer === value} aria-controls="color-panel" tabIndex={layer === value ? 0 : -1}
          onClick={() => selectLayer(value)}
          onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
            selectLayer(next === 0 ? 'semantic' : 'primitive');
            tabRefs.current[next]?.focus();
          }}>{value === 'semantic' ? 'Semânticos' : 'Primitivos'}</TabCell>)}
      </div>
      <div className="color-groups" role="group" aria-label="Grupos de cores">
        {groups.map(item => <Button key={item.id} variant="outlined" selected={!searching && group === item.id}
          onClick={() => {
            if (group === item.id && !query) return;
            setGroup(item.id); setQuery(''); setPage(1);
          }}>{item.label}</Button>)}
      </div>
      <InputField className="color-search" label="Buscar cores" type="search" value={query}
        onChange={event => { setQuery(event.target.value); setPage(1); }}
        placeholder="Ex: content-primary, blue-500 ou #395ABF"
        rightIcon={<img src={assetUrl('color-search.svg')} width="16" height="16" alt="" />} />
    </div>
    <div className="color-results" id="color-panel" role="tabpanel" aria-labelledby={`color-tab-${layer}`}>
      <div className="color-results-heading"><div className="text-group">
        <h3>{searching ? 'Resultados da busca' : currentGroup.label}</h3>
        <p><InlineCode>{searching ? `Cores encontradas em toda a coleção ${layer === 'semantic' ? 'sys-color' : 'ref'} para “${query.trim()}”.` : currentGroup.description}</InlineCode></p>
      </div></div>
      <div className="color-table-frame">
        <div ref={scrollRef} className="color-table-scroll" role="region" aria-label={layer === 'semantic' ? 'Tokens de cores: light e dark' : 'Tokens primitivos de cores'} tabIndex={0}>
          <div className="color-table-track" data-layer={layer}><table className="color-table">
            <caption>{layer === 'semantic' ? 'Tokens de cores: comparação entre light e dark' : 'Valores da coleção ref do Design System'}</caption>
            <thead><tr><th scope="col">TOKENS</th><th scope="col">{layer === 'semantic' ? 'LIGHT MODE' : 'VALOR'}</th>{layer === 'semantic' && <th scope="col">DARK MODE</th>}</tr></thead>
            <tbody>{rows.map(row => <tr key={row.id}>
              <th scope="row"><code>{row.name}</code></th>
              <td><ColorSample value={row.light} /></td>
              {layer === 'semantic' && <td><ColorSample value={row.dark} /></td>}
            </tr>)}
            {rows.length === 0 && <tr><td colSpan={layer === 'semantic' ? 3 : 2}>Nenhuma cor encontrada. Tente outro nome, referência ou hexadecimal.</td></tr>}
            </tbody>
          </table></div>
        </div>
        <div className="color-pagination">
          <div className="color-pagination-summary">
            <p className="color-page-size">Linhas por página:</p>
            <p role="status" aria-live="polite" aria-atomic="true">Mostrando {matches.length ? start + 1 : 0}-{Math.min(start + pageSize, matches.length)} de {matches.length} itens</p>
          </div>
          <nav className="color-page-buttons" aria-label="Páginas de cores">
            <Button size="small" iconOnly disabled={currentPage === 1} onClick={() => selectPage(currentPage - 1)} icon={<img src={assetUrl('color-page-previous.svg')} width="16" height="16" alt="" />} aria-label="Página anterior" />
            {pages.map(value => <Button key={value} size="small" selected={value === currentPage} onClick={() => selectPage(value)} aria-label={`Página ${value}`} aria-current={value === currentPage ? 'page' : undefined}>{value}</Button>)}
            <Button size="small" iconOnly disabled={currentPage === pageCount} onClick={() => selectPage(currentPage + 1)} icon={<img src={assetUrl('color-page-next.svg')} width="16" height="16" alt="" />} aria-label="Próxima página" />
          </nav>
        </div>
      </div>
    </div>
  </div>;
}
