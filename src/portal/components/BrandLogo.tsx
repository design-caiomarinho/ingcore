import type { AnchorHTMLAttributes } from 'react';
import { assetUrl, pageUrl } from '../paths';

export function BrandLogo({ onClick }: Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'>) {
  return <a className="brand-logo" href={pageUrl('/home')} aria-label="IngCore — Início" onClick={onClick}>
    <img src={assetUrl('imgVector.svg')} alt="IngCore" width="117" height="24" />
  </a>;
}
