import snapshot from './spacing.figma.json' with { type: 'json' };

type Value = string | number | {type: string; id: string};
type Variable = {id: string; name: string; collectionId: string; valuesByMode: Record<string, Value>};
export type SpacingToken = {id: string; name: string; reference: string; value: string | number};
const variables = snapshot.variables as unknown as Variable[];
const byId = new Map(variables.map(variable => [variable.id, variable]));
const collections = new Map(snapshot.collections.map(collection => [collection.id, collection]));
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
const ref = snapshot.collections.find(collection => collection.name === 'ref')!;
const semantic = snapshot.collections.find(collection => collection.name === 'sys-spacing')!;
export const spacingPrimitives: SpacingToken[] = variables.filter(variable => variable.collectionId === ref.id)
  .map(variable => ({id: variable.id, name: variable.name.replaceAll('/', '-'), reference: '—', value: resolve(variable)}))
  .sort((a, b) => typeof a.value === 'number' && typeof b.value === 'number' ? a.value - b.value : typeof a.value === 'number' ? -1 : 1);
export const spacingSemantic: SpacingToken[] = variables.filter(variable => variable.collectionId === semantic.id)
  .map(variable => {
    const value = variable.valuesByMode[semantic.defaultModeId];
    const reference = typeof value === 'object' ? byId.get(value.id) : undefined;
    return {id: variable.id, name: variable.name, reference: reference?.name.replaceAll('/', '-') ?? '—', value: resolve(variable)};
  }).sort((a, b) => Number(a.value) - Number(b.value));
export const spacingValueLabel = (value: string | number) => typeof value === 'number' ? `${value} px` : value;
