import { useState } from 'react';
import { DataTable } from './DataTable';
import { TablePagination } from './TablePagination';
import '../styles/data-table-lab.scss';

const rows = [
  {id: 'family', cells: [<code>font/family/display</code>, 'Inter', <code>font-family: "Inter";</code>]},
  {id: 'size', cells: [<code>font/size/7</code>, '14', <code>font-size: 14px;</code>]},
  {id: 'height', cells: [<code>font/height/tight</code>, '120%', <code>line-height: 1.2;</code>]},
];
export const tableExample = {columns: [{id: 'reference', label: 'REFERÊNCIA · REF'}, {id: 'value', label: 'VALOR'}, {id: 'css', label: 'PROPRIEDADE CSS'}], rows};

export function DataTableLab() {
  const [page, setPage] = useState(1);
  return <section className="nav-button-lab data-table-lab" id="componentes-tabela" aria-labelledby="data-table-lab-title">
    <h2 id="data-table-lab-title">Componente · Tabela</h2>
    <p>Tabela usada em Cores e Tipografia. Cabeçalho de 48px, linhas de 67px e fundos alternados. As colunas e o conteúdo são configuráveis.</p>
    <p>Em espaços menores, o conteúdo mantém uma largura de leitura segura com scroll horizontal. A paginação é opcional e preserva o padrão de botões existente.</p>
    <DataTable caption="Exemplo de tabela com referências tipográficas" {...tableExample} rows={rows.slice((page - 1) * 2, page * 2)}>
      <TablePagination total={rows.length} page={page} pageSize={2} onPageChange={setPage} label="Paginação do exemplo de tabela" />
    </DataTable>
  </section>;
}
