import type { ReactNode } from 'react';
import styles from './Table.module.scss';

export type TableColumn<Row> = {
  key: string;
  heading: string;
  rowHeader?: boolean;
  render: (row: Row) => ReactNode;
};

/** Tabela de documentação. A primeira utilização é a comparação de cores por tema. */
export function Table<Row extends { id: string }>({ label, columns, rows, className = '' }: {
  label: string;
  columns: TableColumn<Row>[];
  rows: Row[];
  className?: string;
}) {
  return <div className={`${styles.scroll} ${className}`.trim()} role="region" aria-label={label} tabIndex={0}>
    <div className={styles.track}><table className={styles.table}>
      <caption className={styles.caption}>{label}</caption>
      <thead><tr>{columns.map(column => <th key={column.key} scope="col">{column.heading}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}>{columns.map(column => column.rowHeader
        ? <th key={column.key} scope="row">{column.render(row)}</th>
        : <td key={column.key}>{column.render(row)}</td>)}</tr>)}</tbody>
    </table></div>
  </div>;
}
