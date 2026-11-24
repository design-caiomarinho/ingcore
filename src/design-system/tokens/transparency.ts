import snapshot from './transparency.figma.json';
type Color = {r: number; g: number; b: number; a: number};
type Value = Color | number | {type: string; id: string};
type Variable = {id: string; name: string; values: Record<string, Value>};
// Ajustes aprovados para o código; a captura original do Figma permanece preservada.
const variables: Variable[] = (snapshot as unknown as Variable[]).map(variable => {
  if (/^palette\/alpha\/[^/]+\/0$/.test(variable.name)) {
    const color = Object.values(variable.values)[0] as Color;
    return {...variable, values: {'248:12': {...color, a: 0}}};
  }
  return variable;
});
for (const family of ['brand', 'critical']) {
  const subtle = variables.find(variable => variable.name === 'overlay/' + family + '/subtle')!;
  const reference = variables.find(variable => variable.name === 'palette/alpha/' + (family === 'brand' ? 'blue' : 'red') + '/50')!;
  variables.push({...subtle, id: 'local:overlay-' + family + '-none', name: 'overlay/' + family + '/none'});
  const modes = Object.keys(subtle.values);
  variables[variables.indexOf(subtle)] = {...subtle, values: Object.fromEntries(modes.map(mode => [mode, {type: 'VARIABLE_ALIAS', id: reference.id}]))};
}
// Neutral também possui o nível none, aprovado após a captura do Figma.
const neutralBase = variables.find(variable => variable.name === 'overlay/neutral/subtle')!;
const neutralZero = variables.find(variable => variable.name === 'palette/alpha/gray/0')!;
variables.push({
  id: 'local:overlay-neutral-none',
  name: 'overlay/neutral/none',
  values: Object.fromEntries(Object.keys(neutralBase.values).map(mode => [mode, {type: 'VARIABLE_ALIAS', id: neutralZero.id}])),
});
// Nível de opacidade total aprovado para o explorador, independente da captura do Figma.
variables.push({id: 'local:opacity-100', name: 'opacity/100', values: {'248:12': 100}});
variables.push({id: 'local:transparent-full', name: 'full', values: {'2146:7': {type: 'VARIABLE_ALIAS', id: 'local:opacity-100'}}});
// Opacidade total aprovada também para os overlays e suas referências primitivas.
for (const family of ['gray', 'blue', 'red', 'white']) {
  const base = variables.find(variable => variable.name === 'palette/alpha/' + family + (family === 'white' ? '/100' : '/0'))!;
  const color = Object.values(base.values)[0] as Color;
  variables.push({id: 'local:alpha-' + family + '-1000', name: 'palette/alpha/' + family + '/1000', values: {'248:12': {...color, a: 1}}});
}
for (const [family, palette] of [['neutral', 'gray'], ['brand', 'blue'], ['critical', 'red']]) {
  const base = variables.find(variable => variable.name === 'overlay/' + family + '/subtle')!;
  variables.push({
    id: 'local:overlay-' + family + '-full', name: 'overlay/' + family + '/full',
    values: Object.fromEntries(Object.keys(base.values).map(mode => [mode, {type: 'VARIABLE_ALIAS', id: 'local:alpha-' + (family === 'neutral' && mode === '2270:3' ? 'white' : palette) + '-1000'}])),
  });
}
const byId = new Map(variables.map(variable => [variable.id, variable]));
function resolve(variable: Variable): Color | number {
  const value = Object.values(variable.values)[0];
  return typeof value === 'object' && 'id' in value ? resolve(byId.get(value.id)!) : value as Color | number;
}
const tidy = (value: number) => Math.round(value * 10000) / 10000;
const cssColor = (color: Color) => `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${tidy(color.a)})`;
export const transparencyGroups = ['Neutral', 'Brand', 'Critical', 'Transparent'] as const;
export type TransparencyGroup = typeof transparencyGroups[number];
export const transparencySemantic = variables.filter(variable => variable.name.startsWith('overlay/') || (/^VariableID:2146:96[0-5]$/.test(variable.id) || variable.id === 'local:transparent-full')).map(variable => {
  const value = resolve(variable);
  const opacity = typeof value === 'number';
  const parts = variable.name.split('/');
  return {name: variable.name.replaceAll('/', '-'), label: parts.at(-1)!, group: opacity ? 'Transparent' : parts[1].charAt(0).toUpperCase() + parts[1].slice(1), css: opacity ? String(value / 100) : cssColor(value), amount: opacity ? value : tidy(value.a * 100), property: opacity ? 'opacity' : 'background-color'};
}).sort((a, b) => ['none', 'muted', 'subtle', 'soft', 'medium', 'strong', 'emphasis', 'full'].indexOf(a.label) - ['none', 'muted', 'subtle', 'soft', 'medium', 'strong', 'emphasis', 'full'].indexOf(b.label));
export const transparencyPrimitives = variables.filter(variable => variable.name.startsWith('palette/alpha/') || variable.name.startsWith('opacity/')).map(variable => {
  const value = resolve(variable);
  return {name: variable.name.replaceAll('/', '-'), value: typeof value === 'number' ? `${value}%` : cssColor(value), css: typeof value === 'number' ? `opacity: ${value / 100};` : `background-color: ${cssColor(value)};`};
}).sort((a, b) => a.name.localeCompare(b.name, 'en', {numeric: true}));

// Compara os dois tons de texto sobre a cor alpha composta nos fundos da prévia.
export function transparencyLabelInverse(color: string): boolean {
  const channels = color.match(/[\d.]+/g)?.map(Number);
  if (!channels || channels.length !== 4) return false;
  const [r, g, b, alpha] = channels;
  const luminance = (rgb: number[]) => rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const backgrounds = [[245, 247, 250], [234, 236, 240]].map(background => luminance([r, g, b].map((channel, index) => channel * alpha + background[index] * (1 - alpha))));
  const primary = luminance([23, 29, 38]);
  return Math.min(...backgrounds.map(bg => contrast(bg, 1))) > Math.min(...backgrounds.map(bg => contrast(bg, primary)));
}