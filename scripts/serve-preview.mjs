import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, isAbsolute, extname } from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const basePath = html.match(/src="([^"]*)assets\/index-/)?.[1] || '/';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (pathname === '/' && basePath !== '/') { response.writeHead(302, { Location: basePath }).end(); return; }
    if (!pathname.startsWith(basePath)) { response.writeHead(404).end(); return; }
    pathname = '/' + pathname.slice(basePath.length);
    let path = resolve(root, '.' + pathname);
    const relativePath = relative(root, path);
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const contents = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    response.end(contents);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Arquivo não encontrado.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(5174, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:5174' + basePath + '\nMantenha esta janela aberta. Ctrl+C encerra.'));
