import { StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenCatalog } from './portal/tokens/TokenCatalog';
import { Home } from './portal/pages/Home';
import { Colors } from './portal/pages/Colors';
import './portal/styles/index.scss';
import { appPath } from './portal/paths';

const routePath = () => appPath(window.location.pathname);
const routes = new Set(['/', '/home', '/cores', '/configuracao']);
function App() {
  const [path, setPath] = useState(routePath);
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
    document.title = path === '/home' ? 'IngCore — Primeiros passos' : path === '/cores' ? 'IngCore — Cores' : 'IngCore — Tokens do portal';
    const anchor = window.location.hash.slice(1);
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [path]);
  return path === '/home' ? <Home /> : path === '/cores' ? <Colors /> : <TokenCatalog />;
}

// Aguarda as faces locais antes de exibir os textos, evitando a troca do fallback.
await Promise.allSettled([400, 500, 600, 700].map(weight =>
  document.fonts.load(weight + ' 14px "Inter"', 'Construção IngCore'),
));
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
