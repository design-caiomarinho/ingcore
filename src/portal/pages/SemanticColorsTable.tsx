import { Table, type TableColumn } from '../components/Table';
import { semanticColorRows } from '../../design-system/tokens/semantic-colors';

type Row = (typeof semanticColorRows)[number];
function ThemeColor({ value }: {value: Row['light']}) {
  return <div className="semantic-color">
    <span className="semantic-swatch" style={{backgroundColor: value.cssValue}} aria-hidden="true" />
    <div className="semantic-value"><code>{`var(${value.alias})`}</code><span>{value.hex}</span></div>
  </div>;
}
const columns: TableColumn<Row>[] = [
  {key: 'token', heading: 'TOKEN SEMÂNTICO', rowHeader: true, render: row => <code>{`var(${row.cssVar})`}</code>},
  {key: 'light', heading: 'LIGHT MODE', render: row => <ThemeColor value={row.light} />},
  {key: 'dark', heading: 'DARK MODE', render: row => <ThemeColor value={row.dark} />},
];

export function SemanticColorsTable() {
  return <Table label="Tokens semânticos de cores: comparação entre light e dark" columns={columns} rows={semanticColorRows} className="semantic-table" />;
}
