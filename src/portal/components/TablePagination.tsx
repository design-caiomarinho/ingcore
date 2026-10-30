import { Button } from './Button';
import { assetUrl } from '../paths';
import '../styles/data-table.scss';

export function TablePagination({total, page, pageSize = 10, onPageChange, label = 'Páginas da tabela'}: {
  total: number; page: number; pageSize?: number; onPageChange: (page: number) => void; label?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(1, Math.min(page, pageCount));
  const windowStart = Math.max(1, Math.min(current - 2, pageCount - 4));
  const pages = Array.from({length: Math.min(5, pageCount)}, (_, index) => windowStart + index);
  const start = (current - 1) * pageSize;
  return <div className="table-pagination">
    <div className="table-pagination-summary"><p className="table-page-size">Linhas por página:</p>
      <p role="status" aria-live="polite" aria-atomic="true">Mostrando {total ? start + 1 : 0}-{Math.min(start + pageSize, total)} de {total} itens</p>
    </div>
    <nav className="table-page-buttons" aria-label={label}>
      <Button size="small" iconOnly disabled={current === 1} onClick={() => onPageChange(current - 1)} icon={<img src={assetUrl('colors-page-previous.svg')} alt="" />} aria-label="Página anterior" />
      {pages.map(value => <Button key={value} size="small" selected={value === current} onClick={() => onPageChange(value)} aria-label={`Página ${value}`} aria-current={value === current ? 'page' : undefined}>{value}</Button>)}
      <Button size="small" iconOnly disabled={current === pageCount} onClick={() => onPageChange(current + 1)} icon={<img src={assetUrl('colors-page-next.svg')} alt="" />} aria-label="Próxima página" />
    </nav>
  </div>;
}
