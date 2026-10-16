import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const inventory = JSON.parse(await readFile(resolve(root, 'src/portal/tokens/portal.tokens.json'), 'utf8'));
const names = new Set(inventory.tokens.map(token => token.cssVar));
const errors = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'generated') await scan(path); continue; }
    if (!['.scss', '.tsx'].includes(extname(path))) continue;
    const text = await readFile(path, 'utf8');
    for (const [, name] of text.matchAll(/var\((--(?:sys|ref)-[a-z0-9-]+)\)/g)) {
      if (!names.has(name)) errors.push(`${entry.name}: token ausente ${name}`);
    }
    for (const [, recipe] of text.matchAll(/@include type\.text\('([^']+)'\)/g)) {
      for (const property of ['family', 'size', 'weight', 'height', 'letter-spacing']) {
        const name = `--sys-type-${recipe}-${property}`;
        if (!names.has(name)) errors.push(`${entry.name}: receita incompleta ${name}`);
      }
    }
  }
}
await scan(resolve(root, 'src/portal'));
for (const asset of ['imgVector', 'imgArrowRight', 'imgArrowRightDisabled', 'imgMarcador', 'imgMarcador1', 'imgMenu', 'imgRecord', 'imgRecordDisabled', 'imgDocumentText', 'imgClose']) {
  if ((await stat(resolve(root, `public/assets/${asset}.svg`))).size === 0) errors.push(`Asset vazio: ${asset}`);
}
if (errors.length) throw new Error(errors.join('\n'));
console.log('Referências de tokens, receitas tipográficas e assets da Home verificados.');
