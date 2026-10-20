import { StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenCatalog } from './portal/tokens/TokenCatalog';
import { Home } from './portal/pages/Home';
import { Colors } from './portal/pages/Colors';
import { Typography } from './portal/pages/Typography';
import './portal/styles/index.scss';
import { appPath } from './portal/paths';

const routePath = () => appPath(window.location.pathname);
const routes = new Set(['/', '/home', '/cores', '/tipografia', '/configuracao']);
function App() {
  const [path, setPath] = useState(routePath);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.inputMode = 'pointer';
    const onPointer = () => { root.dataset.inputMode = 'pointer'; };
    const onKey = (event: KeyboardEvent) => {
      if (['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) root.dataset.inputMode = 'keyboard';
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, []);
  useLayoutEffect(() => {
    const onPopState = () => setPath(routePath());
    const onNavigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href);
      const next = appPath(url.pathname);
      if (url.origin !== window.location.origin || !routes.has(next)) return;
      if (next === routePath()) {
        if (link.classList.contains('brand-logo')) {
          event.preventDefault();
          if (window.location.hash) window.history.pushState(null, '', url.pathname + url.search);
          window.scrollTo({top: 0, left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
          return;
        }
        if (url.hash === window.location.hash && url.search === window.location.search) event.preventDefault();
        return;
      }
      event.preventDefault();
      window.history.pushState(null, '', url.pathname + url.search + url.hash);
      setPath(next);
    };
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onNavigate);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onNavigate);
    };
  }, []);
  useLayoutEffect(() => {
    document.title = path === '/home' ? 'IngCore - Design System' : path === '/tipografia' ? 'Tipografia - IngCore' : path === '/cores' ? 'Cores - IngCore' : 'Configuração - IngCore';
    const anchor = window.location.hash.slice(1);
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [path]);
  return path === '/home' ? <Home /> : path === '/tipografia' ? <Typography /> : path === '/cores' ? <Colors /> : <TokenCatalog />;
}

// Aguarda as faces locais antes de exibir os textos, evitando a troca do fallback.
await Promise.allSettled([400, 500, 600, 700].map(weight =>
  document.fonts.load(weight + ' 14px "Inter"', 'Construção IngCore'),
));
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
