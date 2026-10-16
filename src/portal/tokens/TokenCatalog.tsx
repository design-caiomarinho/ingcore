import { useState, type CSSProperties } from 'react';
import inventory from './portal.tokens.json';
import changes from './changes.json';
import { SidebarButtonLab } from '../components/SidebarButtonLab';
import { TextLinkLab } from '../components/TextLinkLab';
import { ButtonLab } from '../components/ButtonLab';
import { pageUrl } from '../paths';

type Token = (typeof inventory.tokens)[number];
const layers = [
  { tier: 'primary', title: 'Referências · ref' },
  { tier: 'secondary', title: 'Cores semânticas · sys-color' },
  { tier: 'typography', title: 'Tipografia semântica · sys-type' },
  { tier: 'dependency', title: 'Dependências externas' },
];

function TokenSample({ token }: { token: Token }) {
  if (token.category === 'color') return <span className="token-swatch" aria-label={`Cor ${token.hexPreview}, alpha ${token.alpha}`} style={{ backgroundColor: `var(${token.cssVar})` }} />;
  const fallback = token.property === 'fontFamily' && (token.name.startsWith('code/') || token.name === 'font/family/mono') ? ', monospace' : '';
  return <span className="token-type-sample" data-property={token.property} style={{ [token.property]: `var(${token.cssVar})${fallback}` } as CSSProperties}>Aa — IngCore<br />Texto para validação</span>;
}

export function TokenCatalog() {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState(() => new URLSearchParams(window.location.search).get('category') === 'color' ? 'color' : 'typography');
  const query = filter.trim().toLowerCase();
  const visible = inventory.tokens.filter(token => (category === 'all' || token.category === category) && (!query || `${token.name} ${token.cssVar} ${token.alias?.name ?? ''}`.toLowerCase().includes(query)));
  const recipes = inventory.recipes.filter(recipe => !query || recipe.name.toLowerCase().includes(query) || Object.values(recipe.properties).some(prop => prop.cssVar.toLowerCase().includes(query)));
  return (
    <main className="portal-theme token-catalog" lang="pt-BR">
      <h1>Tokens do portal</h1>
      <p><a href={pageUrl('/home')}>Abrir Home</a></p>
      <p className="token-notice"><strong>Base em construção.</strong> {inventory.report.counts.primaryColors + inventory.report.counts.secondary} tokens de cores e {inventory.report.counts.primaryTypography + inventory.report.counts.typography} de tipografia nas três coleções atuais do Figma. Valores e referências preservados.</p>
      <p>Estes tokens pertencem ao portal. Os futuros tokens do Design System IngCore continuam separados.</p>
      <p><a href={inventory.source.url} target="_blank" rel="noreferrer">Consultar referência no Figma</a></p>
      <SidebarButtonLab />
      <TextLinkLab />
      <ButtonLab />
      <div className="token-controls">
        <label>Categoria<select value={category} onChange={event => setCategory(event.target.value)}>
          <option value="typography">Tipografia</option><option value="color">Cores</option><option value="all">Todos os tokens</option>
        </select></label>
        <label>Buscar token por nome ou CSS Variable<input type="search" value={filter} onChange={event => setFilter(event.target.value)} placeholder="Ex.: heading/lg, palette/blue, content" /></label>
      </div>
      <p role="status">{visible.length} tokens exibidos</p>
      {category !== 'color' && <section aria-labelledby="type-samples">
        <h2 id="type-samples">Tipografia · amostras para validação</h2>
        <p>Família, tamanho, peso, altura de linha e espaçamento aplicados juntos, conforme os aliases de sys-type.</p>
        <div className="type-recipes">{recipes.map(recipe => <article key={recipe.name} aria-label={recipe.name}>
          <h3><code>{recipe.name}</code></h3>
          <p className="type-recipe-sample" data-recipe={recipe.name} style={Object.fromEntries(Object.entries(recipe.properties).map(([property, token]) => [property, `var(${token.cssVar})${property === 'fontFamily' && recipe.name.startsWith('code/') ? ', monospace' : ''}`])) as CSSProperties}>{recipe.name.startsWith('code/') ? <><code style={{ font: 'inherit', letterSpacing: 'inherit' }}>{'const portal = "IngCore";'}</code><br /><code style={{ font: 'inherit', letterSpacing: 'inherit' }}>{'color: var(--sys-color-content-brand);'}</code></> : <>Construa experiências consistentes.<br />Tipografia do portal IngCore.</>}</p>
          {recipe.name.startsWith('code/') && <p>Família definida no Figma: Roboto Mono. Fallback: monospace. O arquivo da fonte ainda não está empacotado localmente.</p>}
          <dl>{Object.entries(recipe.properties).map(([property, token]) => <div key={property}><dt>{property}</dt><dd>{String(token.sourceValue)}<span> → {token.value}</span></dd></div>)}</dl>
        </article>)}</div>
        {recipes.length === 0 && <p>Nenhuma amostra encontrada para esta busca.</p>}
      </section>}
      {layers.map(layer => {
        const items = visible.filter(token => token.tier === layer.tier);
        if (items.length === 0) return null;
        const groups = [...new Set(items.map(token => token.group))].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
        return <section key={layer.tier} aria-labelledby={`layer-${layer.tier}`}>
          <h2 id={`layer-${layer.tier}`}>{layer.title} · {items.length}</h2>
          {groups.map(group => <div key={group} className="token-group">
            <h3><code>{group}</code></h3>
            <div className="token-table-wrapper"><table>
              <caption className="sr-only">{layer.title} / {group}</caption>
              <thead><tr><th scope="col">Figma</th><th scope="col">CSS Variable local</th><th scope="col">Valor / referência</th><th scope="col">Amostra</th></tr></thead>
              <tbody>{items.filter(token => token.group === group).map(token => <tr key={token.id} data-token={token.cssVar}>
                <th scope="row"><code>{token.name}</code></th><td><code>{token.cssVar}</code></td>
                <td>{token.alias && <><code>{token.alias.name}</code><br /></>}
                  <code title={token.resolvedValue}>{token.category === 'color' ? token.hexPreview : String(token.sourceValue)}</code>
                  {token.category === 'typography' && <small>CSS: {token.resolvedValue}</small>}
                  {token.category === 'color' && token.alpha !== 1 && <small>alpha {Number(token.alpha!.toPrecision(4))}</small>}
                </td><td><TokenSample token={token} /></td>
              </tr>)}</tbody>
            </table></div>
          </div>)}
        </section>;
      })}
      {visible.length === 0 && <p>Nenhum token encontrado.</p>}
      <section aria-labelledby="sync-notes"><h2 id="sync-notes">Notas da atualização</h2>
        <p>Tipografia revisada: heading/lg, md e sm com −2% de espaçamento; body com −1%; body/sm/medium com altura de linha de 150%. A referência primitiva font/space/tighter está disponível nas amostras e nos aliases semânticos.</p>
        <p>{changes.renamed.length} nomes atualizados e {changes.added.length} variáveis adicionadas em relação ao inventário anterior. Nenhuma variável anterior foi excluída.</p>
        <p>Os primitivos de cor agora seguem os caminhos <code>palette/*</code>, com o mesmo agrupamento do Figma.</p>
        <p>As ações ghost agora apontam para os primitivos locais. Não há dependências externas nesta leitura.</p>
        <p>Conversões para o navegador: tamanhos em px; pesos sem unidade; alturas percentuais em razão sem unidade; AUTO como normal; espaçamento percentual em em. Ex.: 4% → 0.04em. Os valores originais continuam no inventário.</p>
        <p>{inventory.report.incompleteRecipes.length === 0 ? `Os ${inventory.recipes.length} conjuntos tipográficos têm as cinco propriedades definidas.` : `Conjuntos incompletos: ${inventory.report.incompleteRecipes.join(', ')}.`}</p>
        <details><summary>Nomes CSS repetidos no Figma · {inventory.report.duplicateCodeSyntax.length}</summary><ul>{inventory.report.duplicateCodeSyntax.map(issue => <li key={issue.syntax}><code>{issue.syntax}</code>: {issue.names.join(', ')}</li>)}</ul></details>
        <p>O CSS local usa nomes únicos. Grafias como <code>surface/empashis</code> e <code>extented/*</code> foram preservadas. O Figma não foi alterado e novos modos ou escalas não foram presumidos.</p>
      </section>
    </main>
  );
}
