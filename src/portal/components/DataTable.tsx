import type { CSSProperties, ReactNode, Ref } from 'react';
import '../styles/data-table.scss';

export type TableRow = { id: string; cells: ReactNode[] };
type Props = {
  caption: string;
  columns: {id: string; label: string}[];
  rows: TableRow[];
  minWidth?: number;
  scrollRef?: Ref<HTMLDivElement>;
  emptyMessage?: string;
  children?: ReactNode;
};

/** Tabela de documentação compartilhada; dados e paginação pertencem à página. */
export function DataTable({caption, columns, rows, minWidth = 960, scrollRef, emptyMessage = 'Nenhum item encontrado.', children}: Props) {
  return <div className="table-frame" style={{'--table-min-width': `${minWidth}px`} as CSSProperties}>
    <div className="table-scroll" ref={scrollRef} role="region" aria-label={caption} tabIndex={0}>
      <div className="table-track"><table className="data-table">
        <caption>{caption}</caption>
        <thead><tr>{columns.map(column => <th key={column.id} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}>{row.cells.map((cell, index) => index === 0
          ? <th scope="row" key={columns[index].id}>{cell}</th>
          : <td key={columns[index].id}>{cell}</td>)}</tr>)}
          {!rows.length && <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>}
        </tbody>
      </table></div>
    </div>
    {children}
  </div>;
}
