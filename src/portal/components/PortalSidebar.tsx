import { pageUrl } from '../paths';
import { BrandLogo } from './BrandLogo';
import { NavButton, NavLink } from './NavButton';

const groups = [
  { title: 'Introdução', items: [{ label: 'Primeiros passos', current: true }] },
  { title: 'Fundamentos', items: [{ label: 'Cores' }, { label: 'Tipografia' }, { label: 'Espaçamentos' }] },
  { title: 'Componentes', items: [{ label: 'Button' }, { label: 'Input' }, { label: 'Select' }] },
  { title: 'Padrões', items: [{ label: 'Formulários' }] },
  { title: 'Recursos', items: [{ label: 'Biblioteca Figma' }] },
];
const routes: Record<string, string> = { 'Primeiros passos': '/home', Cores: '/cores', Tipografia: '/tipografia' };

export function PortalNavigation({ currentItem = 'Primeiros passos' }: { currentItem?: string }) {
  return <nav aria-label="Navegação principal">{groups.map(group => <div className="nav-group" key={group.title}>
      <h2>{group.title}</h2><ul>{group.items.map(item => <li key={item.label}>
        {routes[item.label]
          ? <NavLink href={pageUrl(routes[item.label])} selected={item.label === currentItem}>{item.label}</NavLink>
          : <NavButton disabled title="Em breve" aria-label={`${item.label} — em breve`}>{item.label}</NavButton>}
      </li>)}</ul>
    </div>)}</nav>;
}

export function PortalSidebar({ currentItem }: { currentItem?: string }) {
  return <aside className="sidebar">
    <BrandLogo />
    <PortalNavigation currentItem={currentItem} />
  </aside>;
}
