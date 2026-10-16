/** Endereços compatíveis com a raiz local e com /ingcore/ no GitHub Pages. */
export const assetUrl = (name: string) => import.meta.env.BASE_URL + 'assets/' + name;
export const pageUrl = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\//, '').replace(/\/$/, '') + (import.meta.env.PROD ? '/' : '');
export const appPath = (pathname: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const relative = base && (pathname === base || pathname.startsWith(base + '/'))
    ? pathname.slice(base.length) : pathname;
  const path = relative.replace(/\/$/, '') || '/';
  return path === '/' && import.meta.env.PROD ? '/home' : path;
};
