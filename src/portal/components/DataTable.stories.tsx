import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './DataTable';
import { tableExample, DataTableLab } from './DataTableLab';
import '../styles/index.scss';

const meta = {
  title: 'Portal/Componentes/Tabela',
  component: DataTable,
  decorators: [(Story) => <div className="portal-theme" style={{padding: 24, maxWidth: 1102}}><Story /></div>],
  args: {caption: 'Referências tipográficas', ...tableExample},
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Standard: Story = {};
export const Empty: Story = {args: {rows: []}};
export const Pagination: Story = {render: () => <DataTableLab />};
