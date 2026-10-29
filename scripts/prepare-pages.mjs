import { mkdir, readFile, writeFile } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
// Entradas físicas permitem abrir e atualizar URLs diretamente no GitHub Pages.
const pageTitles = { home: 'IngCore - Design System', cores: 'Cores - IngCore', tipografia: 'Tipografia - IngCore', espacamento: 'Espaçamento - IngCore', configuracao: 'Configuração - IngCore' };
for (const [route, title] of Object.entries(pageTitles)) {
  await mkdir(new URL(route + '/', dist), { recursive: true });
  await writeFile(new URL(route + '/index.html', dist), html.replace(/<title>.*?<\/title>/, '<title>' + title + '</title>'));
}
await writeFile(new URL('.nojekyll', dist), '');
console.log('Entradas estáticas preparadas: Home, Cores, Tipografia, Espaçamento e configuração.');
