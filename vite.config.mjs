import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const tokenSource = fileURLToPath(new URL('./src/portal/tokens/figma.tokens.json', import.meta.url));
const tokenGenerator = fileURLToPath(new URL('./scripts/generate-tokens.mjs', import.meta.url));

export default defineConfig({ base: process.env.BASE_PATH || '/', plugins: [react(), {
  name: 'portal-token-source',
  configureServer(server) {
    // Alterações na fonte local atualizam catálogo e CSS; Figma só é relido sob solicitação.
    const generate = () => {
      try { execFileSync(process.execPath, [tokenGenerator], { stdio: 'pipe' }); }
      catch (error) { server.config.logger.error(`Falha ao gerar tokens: ${String(error)}`); }
    };
    generate();
    server.watcher.add(tokenSource);
    server.watcher.on('change', path => { if (resolve(path) === tokenSource) generate(); });
  },
}] });
