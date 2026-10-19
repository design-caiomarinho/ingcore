import snapshot from './explorer-colors.figma.json' with { type: 'json' };

export type ColorLayer = 'semantic' | 'primitive';
type RGBA = { r: number; g: number; b: number; a: number };
type Variable = { id: string; name: string; collectionId: string; codeSyntax: { WEB: string }; valuesByMode: Record<string, RGBA | { type: 'VARIABLE_ALIAS'; id: string }> };
type Collection = { id: string; name: string; defaultModeId: string; modes: { name: string; modeId: string }[] };
const variables = snapshot.variables as unknown as Variable[];
const collections: Collection[] = snapshot.collections;
const byId = new Map(variables.map(variable => [variable.id, variable]));
const byCollection = new Map(collections.map(collection => [collection.id, collection]));

export type ColorValue = { alias: string | null; hex: string; cssValue: string };
export type ColorRow = { id: string; name: string; path: string; layer: ColorLayer; group: string; light: ColorValue; dark: ColorValue };

function resolve(variable: Variable, theme: string, visited = new Set<string>()): RGBA {
  if (visited.has(variable.id)) throw new Error(`Alias circular: ${variable.name}`);
  visited.add(variable.id);
  const collection = byCollection.get(variable.collectionId);
  if (!collection) throw new Error(`Coleção ausente: ${variable.name}`);
  const mode = collection.modes.find(mode => mode.name === theme)?.modeId ?? collection.defaultModeId;
  const value = variable.valuesByMode[mode];
  if (!value) throw new Error(`Modo ausente: ${variable.name}/${theme}`);
  if ('type' in value) {
    const reference = byId.get(value.id);
    if (!reference) throw new Error(`Alias ausente: ${variable.name}`);
    return resolve(reference, theme, visited);
  }
  if (![value.r, value.g, value.b, value.a].every(value => Number.isFinite(value) && value >= 0 && value <= 1)) throw new Error(`Cor inválida: ${variable.name}`);
  return value;
}

function colorValue(variable: Variable, theme: string): ColorValue {
  const collection = byCollection.get(variable.collectionId)!;
  const mode = collection.modes.find(mode => mode.name === theme)?.modeId ?? collection.defaultModeId;
  const raw = variable.valuesByMode[mode];
  const rgba = resolve(variable, theme);
  return {
    alias: 'type' in raw ? byId.get(raw.id)!.codeSyntax.WEB : null,
    hex: '#' + [rgba.r, rgba.g, rgba.b, ...(rgba.a < 1 ? [rgba.a] : [])].map(value => Math.round(value * 255).toString(16).padStart(2, '0')).join('').toUpperCase(),
    cssValue: `color(srgb ${rgba.r} ${rgba.g} ${rgba.b} / ${rgba.a})`,
  };
}

export const semanticGroups = [
  { id: 'canvas', label: 'Canvas', description: 'Cores de fundo da página e das áreas principais da interface.' },
  { id: 'surface', label: 'Surface', description: 'Cores para superfícies, containers e seus diferentes níveis de destaque.' },
  { id: 'content', label: 'Content', description: 'Cores para textos, ícones e conteúdo sobre diferentes superfícies.' },
  { id: 'border', label: 'Border', description: 'Cores para bordas e separadores da interface.' },
  { id: 'action', label: 'Action', description: 'Cores para ações e seus estados de interação.' },
  { id: 'overlay', label: 'Overlay', description: 'Cores com transparência para sobreposições da interface.' },
  { id: 'support', label: 'Support', description: 'Cores de apoio e referências sociais do Design System.' },
  { id: 'shadow', label: 'Shadow', description: 'Cores utilizadas nas sombras da interface.' },
] as const;

export const primitiveGroups = [
  ...['blue', 'gray', 'amber', 'red', 'green'].map(id => ({ id, label: id[0].toUpperCase() + id.slice(1), description: `Valores da escala ${id} na coleção ref do Design System.` })),
  { id: 'alpha', label: 'Alpha', description: 'Cores primitivas com transparência, preservando o canal alpha.' },
  { id: 'variations', label: 'Variations', description: 'Variações de cores que complementam as escalas principais.' },
];

const nameOrder = new Intl.Collator('pt-BR', { numeric: true });
export const colorRows: ColorRow[] = variables.map(variable => {
  const layer: ColorLayer = byCollection.get(variable.collectionId)!.name === 'ref' ? 'primitive' : 'semantic';
  return { id: variable.id, name: variable.codeSyntax.WEB, path: variable.name, layer,
    group: variable.name.split('/')[layer === 'primitive' ? 1 : 0],
    light: colorValue(variable, 'light'), dark: colorValue(variable, 'dark') };
}).sort((a, b) => nameOrder.compare(a.path, b.path));

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Busca em toda a camada selecionada; sem busca, limita ao grupo escolhido. */
export function findColors(layer: ColorLayer, group: string, query: string) {
  const term = normalize(query.trim());
  return colorRows.filter(row => row.layer === layer && (term
    ? normalize([row.name, row.path, row.light.alias, row.dark.alias, row.light.hex, row.dark.hex].join(' ')).includes(term)
    : row.group === group));
}
