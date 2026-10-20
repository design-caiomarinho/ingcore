import snapshot from './typography.figma.json' with { type: 'json' };

type Value = string | number | { type: 'VARIABLE_ALIAS'; id: string };
type Variable = { id: string; name: string; collectionId: string; valuesByMode: Record<string, Value> };
const variables = snapshot.variables as unknown as Variable[];
const byId = new Map(variables.map(variable => [variable.id, variable]));
const collections = new Map(snapshot.collections.map(collection => [collection.id, collection]));
const semanticCollection = snapshot.collections.find(collection => collection.name === 'sys-type')!;
export const typographyMode = semanticCollection.modes.find(mode => mode.modeId === semanticCollection.defaultModeId)!.name;

function resolve(variable: Variable, visited = new Set<string>()): string | number {
  if (visited.has(variable.id)) throw new Error(`Referência circular: ${variable.name}`);
  visited.add(variable.id);
  const collection = collections.get(variable.collectionId);
  if (!collection) throw new Error(`Coleção ausente: ${variable.name}`);
  const value = variable.valuesByMode[collection.defaultModeId];
  if (value === undefined) throw new Error(`Valor ausente: ${variable.name}`);
  if (typeof value !== 'object') return value;
  const reference = byId.get(value.id);
  if (!reference) throw new Error(`Referência ausente: ${variable.name}`);
  return resolve(reference, visited);
}

export const typographyGroups = ['Display', 'Heading', 'Body', 'Label', 'Caption'] as const;

export type TypographyPrimitive = {id: string; reference: string; value: string | number; css: string};
const primitiveCollection = snapshot.collections.find(collection => collection.name === 'ref')!;
const primitiveProperties = ['family', 'size', 'weight', 'height', 'letter-spacing'];

/** Propriedades CSS equivalentes; não inventa nomes de custom properties para o DS. */
export const typographyPrimitives: TypographyPrimitive[] = variables
  .filter(variable => variable.collectionId === primitiveCollection.id && variable.name.startsWith('font/'))
  .sort((a, b) => {
    const aProperty = a.name.split('/')[1];
    const bProperty = b.name.split('/')[1];
    const groupOrder = primitiveProperties.indexOf(aProperty) - primitiveProperties.indexOf(bProperty);
    if (groupOrder) return groupOrder;
    if (aProperty === 'family') return 0;
    return parseFloat(String(resolve(a))) - parseFloat(String(resolve(b)));
  })
  .map(variable => {
    const property = variable.name.split('/')[1];
    const value = resolve(variable);
    let css: string;
    switch (property) {
      case 'family': css = `font-family: ${JSON.stringify(value)};`; break;
      case 'size': css = `font-size: ${value}px;`; break;
      case 'weight': css = `font-weight: ${value};`; break;
      case 'height': css = `line-height: ${parseFloat(String(value)) / 100};`; break;
      case 'letter-spacing': css = `letter-spacing: ${parseFloat(String(value)) / 100}em;`; break;
      default: throw new Error(`Propriedade tipográfica desconhecida: ${variable.name}`);
    }
    return {id: variable.id, reference: variable.name, value, css};
  });
export type TypographyGroup = typeof typographyGroups[number];
export type TypographyRecipe = {
  id: string;
  group: TypographyGroup;
  label: string;
  family: string;
  size: number;
  weight: number;
  height: string;
  letterSpacing: string;
  properties: { name: string; value: string | number; reference: string | null }[];
};
const sizes: Record<string, string> = {lg: 'Large', md: 'Medium', sm: 'Small', regular: 'Regular', medium: 'Medium'};
const order = ['display/lg', 'display/md', 'display/sm', 'heading/lg', 'heading/md', 'heading/sm',
  'body/lg/regular', 'body/lg/medium', 'body/md/regular', 'body/md/medium', 'body/sm/regular', 'body/sm/medium',
  'label/md', 'label/sm', 'caption'];

/** Dados documentados do DS: nunca dependem das receitas visuais do portal. */
export const typographyRecipes: TypographyRecipe[] = order.map(id => {
  const members = variables.filter(variable => variable.collectionId === semanticCollection.id && variable.name.startsWith(id + '/'));
  const property = (name: string) => {
    const variable = members.find(variable => variable.name === id + '/' + name);
    if (!variable) throw new Error(`Propriedade tipográfica ausente: ${id}/${name}`);
    return resolve(variable);
  };
  const group = typographyGroups.find(group => id.startsWith(group.toLowerCase()))!;
  return {
    id, group, label: [group, ...id.split('/').slice(1).map(part => sizes[part] ?? part)].join(' · '),
    family: String(property('family')), size: Number(property('size')), weight: Number(property('weight')),
    height: String(property('height')), letterSpacing: String(property('letter-spacing')),
    properties: members.map(variable => {
      const raw = variable.valuesByMode[semanticCollection.defaultModeId];
      return {name: variable.name, value: resolve(variable), reference: typeof raw === 'object' ? byId.get(raw.id)!.name : null};
    }),
  };
});

export function typographySampleStyle(recipe: TypographyRecipe) {
  const height = recipe.height.endsWith('%') ? String(parseFloat(recipe.height) / 100) : recipe.height;
  const letterSpacing = recipe.letterSpacing.endsWith('%') ? `${parseFloat(recipe.letterSpacing) / 100}em` : recipe.letterSpacing;
  return {fontFamily: `"${recipe.family}", sans-serif`, fontSize: `${recipe.size}px`, fontWeight: recipe.weight, lineHeight: height, letterSpacing};
}

export function typographyDetails(recipe: TypographyRecipe) {
  const style = typographySampleStyle(recipe);
  const fields = [
    ['family', 'font-family', style.fontFamily],
    ['size', 'font-size', style.fontSize],
    ['weight', 'font-weight', style.fontWeight],
    ['height', 'line-height', style.lineHeight],
    ['letter-spacing', 'letter-spacing', style.letterSpacing],
  ] as const;
  return {
    css: fields.map(([, name, value]) => `${name}: ${value};`).join('\n'),
    references: fields.map(([property, name]) => ({
      name,
      reference: recipe.properties.find(item => item.name === `${recipe.id}/${property}`)!.reference,
    })),
  };
}
