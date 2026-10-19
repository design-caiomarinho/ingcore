import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabCell } from './TabCell';
import '../styles/index.scss';

const meta = {
  title: 'Portal/Componentes/Tab Cell',
  component: TabCell,
  decorators: [(Story) => <div className="portal-theme" style={{padding: 24}} role="tablist"><Story /></div>],
  args: { children: 'LABEL' },
} satisfies Meta<typeof TabCell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledSelected: Story = { args: { selected: true, disabled: true } };
