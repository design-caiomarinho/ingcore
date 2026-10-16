import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('src/portal/tokens/figma.tokens.json', root), 'utf8'));
const byId = new Map();
const cssNames = new Set();
const slug = name => name.toLowerCase().replace(/[\s/]+/g, '-');
const round = number => Number(number.toFixed(9));

for (const collection of source.collections) {
  if (collection.count !== collection.variables.length) throw new Error(`Contagem divergente: ${collection.name}`);
  for (const variable of collection.variables) {
    add(variable, collection, `--${slug(collection.name)}-${slug(variable.name)}`, collection.tier);
  }
}
for (const variable of source.dependencies) {
  add(variable, variable.collection, `--external-${slug(variable.collection.name)}-${slug(variable.name)}`, 'dependency');
}

function add(variable, collection, cssVar, tier) {
  if (!/^--[a-z][a-z0-9-]*$/.test(cssVar) || cssNames.has(cssVar) || byId.has(variable.id)) {
    throw new Error(`Nome ou ID inválido/duplicado: ${variable.name}`);
  }
  if (!['COLOR', 'FLOAT', 'STRING'].includes(variable.type)) throw new Error(`Tipo ainda não suportado: ${variable.type}`);
  cssNames.add(cssVar);
  byId.set(variable.id, { ...variable, collection, cssVar, tier });
}

function rawValue(token) {
  const value = token.values[token.collection.defaultModeId];
  if (value === undefined) throw new Error(`Modo padrão ausente: ${token.name}`);
  return value;
}

function resolve(token, path = []) {
  if (path.includes(token.id)) throw new Error(`Referência circular: ${token.name}`);
  const value = rawValue(token);
  if (value.type === 'VARIABLE_ALIAS') {
    const target = byId.get(value.id);
    if (!target) throw new Error(`Alias não resolvido: ${token.name} → ${value.id}`);
    if (target.type !== token.type) throw new Error(`Tipo incompatível no alias: ${token.name} → ${target.name}`);
    return resolve(target, [...path, token.id]);
  }
  if (token.type === 'FLOAT') {
    if (!Number.isFinite(value)) throw new Error(`Número inválido: ${token.name}`);
    return value;
  }
  if (token.type === 'STRING') {
    if (typeof value !== 'string') throw new Error(`Texto inválido: ${token.name}`);
    return value;
  }
  for (const channel of ['r', 'g', 'b', 'a']) {
    if (!Number.isFinite(value[channel]) || value[channel] < 0 || value[channel] > 1) {
      throw new Error(`Canal inválido: ${token.name}/${channel}`);
    }
  }
  return value;
}

function color(value) {
  // Mantém precisão e alpha (inclusive 0.001) sem quantizar em hexadecimal de 8 bits.
  return `color(srgb ${round(value.r)} ${round(value.g)} ${round(value.b)} / ${round(value.a)})`;
}

function property(token) {
  if (token.type === 'COLOR') return 'color';
  if (/\/family(?:\/|$)/.test(token.name)) return 'fontFamily';
  if (/\/weight(?:\/|$)/.test(token.name)) return 'fontWeight';
  if (/\/size(?:\/|$)/.test(token.name)) return 'fontSize';
  if (/\/line\//.test(token.name) || /\/height$/.test(token.name)) return 'lineHeight';
  if (/\/space\//.test(token.name) || /\/letter-spacing$/.test(token.name)) return 'letterSpacing';
  throw new Error(`Propriedade CSS não mapeada: ${token.name}`);
}

function cssValue(token, value) {
  const prop = property(token);
  if (prop === 'color') return color(value);
  if (prop === 'fontFamily') return JSON.stringify(value);
  if (prop === 'fontSize') return `${value}px`;
  if (prop === 'fontWeight') return String(value);
  if (prop === 'lineHeight' && value === 'AUTO') return 'normal';
  if (typeof value === 'string' && /^-?\d+(\.\d+)?%$/.test(value)) {
    const ratio = round(parseFloat(value) / 100);
    return prop === 'letterSpacing' ? `${ratio}em` : String(ratio);
  }
  throw new Error(`Valor tipográfico não mapeado: ${token.name} = ${value}`);
}

const tokens = [...byId.values()].map(token => {
  const raw = rawValue(token);
  const target = raw.type === 'VARIABLE_ALIAS' ? byId.get(raw.id) : null;
  const resolved = resolve(token);
  const isColor = token.type === 'COLOR';
  return {
    id: token.id, name: token.name, collection: token.collection.name, tier: token.tier,
    type: token.type, category: isColor ? 'color' : 'typography', property: property(token),
    group: isColor ? token.name.includes('/variations/') || token.name.startsWith('extented/') ? token.name.replace(/-\d+$/, '') : token.name.split('/').slice(0, -1).join('/') : token.tier === 'typography' ? token.name.split('/').slice(0, -1).join('/') : token.name.split('/').slice(0, 2).join('/'),
    cssVar: token.cssVar, originalCodeSyntax: token.codeSyntax?.WEB ?? null,
    value: target ? `var(${target.cssVar})` : cssValue(token, resolved),
    resolvedValue: cssValue(token, resolved), sourceValue: resolved,
    hexPreview: isColor ? '#' + ['r', 'g', 'b'].map(c => Math.round(resolved[c] * 255).toString(16).padStart(2, '0')).join('') : null,
    alpha: isColor ? round(resolved.a) : null, alias: target ? { id: target.id, name: target.name, cssVar: target.cssVar, external: target.tier === 'dependency' } : null,
  };
});

const recipeMap = new Map();
for (const token of tokens.filter(t => t.tier === 'typography')) {
  const name = token.name.split('/').slice(0, -1).join('/');
  const recipe = recipeMap.get(name) ?? { name, properties: {} };
  recipe.properties[token.property] = { cssVar: token.cssVar, value: token.resolvedValue, sourceValue: token.sourceValue };
  recipeMap.set(name, recipe);
}
const recipes = [...recipeMap.values()];
const incompleteRecipes = recipes.filter(recipe => ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].some(prop => !recipe.properties[prop])).map(recipe => recipe.name);

const codeSyntax = new Map();
for (const token of tokens.filter(t => t.tier !== 'dependency' && t.originalCodeSyntax)) {
  const group = codeSyntax.get(token.originalCodeSyntax) ?? [];
  group.push(`${token.collection}/${token.name}`);
  codeSyntax.set(token.originalCodeSyntax, group);
}
const duplicateCodeSyntax = [...codeSyntax].filter(([, names]) => names.length > 1).map(([syntax, names]) => ({ syntax, names }));
const report = {
  status: source.status,
  counts: { primary: tokens.filter(t => t.tier === 'primary').length, secondary: tokens.filter(t => t.tier === 'secondary').length, typography: tokens.filter(t => t.tier === 'typography').length, primaryColors: tokens.filter(t => t.tier === 'primary' && t.category === 'color').length, primaryTypography: tokens.filter(t => t.tier === 'primary' && t.category === 'typography').length, recipes: recipes.length, dependencies: source.dependencies.length },
  unresolvedAliases: [],
  incompleteRecipes,
  duplicateCodeSyntax,
  namingNotes: ['Nomes e grupos atuais do Figma preservados, inclusive surface/empashis e extented/*.', 'CSS local derivado de coleção + nome, sem reutilizar codeSyntax duplicado.'],
  conversions: ['font/size: número do Figma aplicado em px.', 'font/weight: número sem unidade.', 'font/line: percentual convertido em razão sem unidade; AUTO convertido em normal.', 'font/space: percentual convertido em em (4% = 0.04em).', 'Valores originais preservados em figma.tokens.json e sourceValue.'],
};

const files = new Map();
for (const [tier, filename] of [['primary', 'primitives'], ['secondary', 'semantics'], ['typography', 'typography'], ['dependency', 'dependencies']]) {
  const list = tokens.filter(t => t.tier === tier);
  files.set(`src/portal/styles/generated/_${filename}.scss`, `// Gerado de figma.tokens.json. Não editar manualmente.\n.portal-theme {\n${list.map(t => `  ${t.cssVar}: ${t.value};`).join('\n')}\n}\n`);
}
files.set('src/portal/styles/tokens.scss', "// Gerado por npm run tokens. Escopo exclusivo do portal.\n@use './generated/primitives';\n@use './generated/dependencies';\n@use './generated/semantics';\n@use './generated/typography';\n");
files.set('src/portal/tokens/portal.tokens.json', JSON.stringify({ source: source.source, status: source.status, report, recipes, tokens }, null, 2) + '\n');
files.set('src/portal/tokens/audit.json', JSON.stringify(report, null, 2) + '\n');

// Preserva modos alternativos do arquivo, mas não os descarta silenciosamente na geração.
if (source.collections.some(c => c.modes.length !== 1)) {
  throw new Error('Foram encontrados novos modos. Atualize a geração para representar cada modo antes de continuar.');
}
for (const [path, contents] of files) {
  const target = new URL(path, root);
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== contents) throw new Error(`Arquivo desatualizado: ${path}`);
  } else {
    await mkdir(new URL('.', target), { recursive: true });
    await writeFile(target, contents);
  }
}
console.log(`${report.counts.primary} primários + ${report.counts.secondary} cores semânticas + ${report.counts.typography} tokens tipográficos; ${report.counts.recipes} conjuntos de texto; ${report.counts.dependencies} dependências externas; nenhum alias pendente.`);
console.log(`${duplicateCodeSyntax.length} nomes de codeSyntax duplicados no Figma, preservados no relatório sem colisões no CSS local.`);
