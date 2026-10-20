import { mkdir, readFile, writeFile } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
// Entradas físicas permitem abrir e atualizar URLs diretamente no GitHub Pages.
for (const route of ['home', 'cores', 'tipografia', 'configuracao']) {
  await mkdir(new URL(route + '/', dist), { recursive: true });
  await writeFile(new URL(route + '/index.html', dist), html);
}
await writeFile(new URL('.nojekyll', dist), '');
console.log('Entradas estáticas preparadas: Home, Cores, Tipografia e configuração.');
