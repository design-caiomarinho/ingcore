import raw from './semantic-colors.figma.json';

type Color = { r: number; g: number; b: number; a: number };
type Variable = {
  id: string;
  name: string;
  collectionId: string;
  codeSyntax: { WEB?: string };
  valuesByMode: Record<string, Color | { type: 'VARIABLE_ALIAS'; id: string }>;
};
type Collection = { id: string; modes: {name: string; modeId: string}[]; defaultModeId: string };
const snapshot = raw as { collection: Collection & {count: number}; tokens: Variable[]; references: Variable[]; referenceCollections: Collection[] };
const variables = new Map([...snapshot.references, ...snapshot.tokens].map(token => [token.id, token]));
const collections = new Map([snapshot.collection, ...snapshot.referenceCollections].map(collection => [collection.id, collection]));

function cssName(token: Variable) {
  const name = /^var\((--[a-z0-9-]+)\)$/.exec(token.codeSyntax.WEB ?? '')?.[1];
  if (!name) throw new Error(`Nome CSS ausente no DS: ${token.name}`);
  return name;
}

function resolveColor(token: Variable, theme: string, path: string[] = []): Color {
  if (path.includes(token.id)) throw new Error(`Alias circular no DS: ${token.name}`);
  const collection = collections.get(token.collectionId);
  const mode = collection?.modes.find(mode => mode.name === theme)?.modeId ?? collection?.defaultModeId;
  const value = mode && token.valuesByMode[mode];
  if (!value) throw new Error(`Valor ausente no DS: ${token.name}/${theme}`);
  if ('type' in value) {
    const target = variables.get(value.id);
    if (!target) throw new Error(`Referência ausente no DS: ${token.name}`);
    return resolveColor(target, theme, [...path, token.id]);
  }
  if (![value.r, value.g, value.b, value.a].every(v => Number.isFinite(v) && v >= 0 && v <= 1)) {
    throw new Error(`Cor inválida no DS: ${token.name}`);
  }
  return value;
}

function themeValue(token: Variable, theme: string) {
  const mode = snapshot.collection.modes.find(mode => mode.name === theme);
  const value = mode && token.valuesByMode[mode.modeId];
  if (!value || !('type' in value)) throw new Error(`Alias ausente no DS: ${token.name}/${theme}`);
  const target = variables.get(value.id);
  if (!target) throw new Error(`Referência ausente no DS: ${token.name}/${theme}`);
  const color = resolveColor(token, theme);
  const channels = [color.r, color.g, color.b, ...(color.a < 1 ? [color.a] : [])];
  return {
    alias: cssName(target),
    hex: '#' + channels.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase(),
    cssValue: `color(srgb ${color.r} ${color.g} ${color.b} / ${color.a})`,
  };
}

export const semanticColorCount = snapshot.collection.count;
export const semanticColorRows = snapshot.tokens.map(token => ({
  id: token.id, cssVar: cssName(token), light: themeValue(token, 'light'), dark: themeValue(token, 'dark'),
}));
