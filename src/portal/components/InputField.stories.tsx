import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputField } from './InputField';
import '../styles/index.scss';

const meta = {
  title: 'Portal/Componentes/Input Standard',
  component: InputField,
  decorators: [(Story) => <div className="portal-theme" style={{width: 248, padding: 24}}><Story /></div>],
  args: { label: 'Label text', placeholder: 'Value' },
} satisfies Meta<typeof InputField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Standard: Story = {};
export const Filled: Story = { args: { defaultValue: 'Value' } };
export const Critical: Story = { args: { invalid: true, hint: 'Confira o valor informado.' } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledFilled: Story = { args: { disabled: true, defaultValue: 'Value' } };
export const Hint: Story = { args: { hint: 'Hint Text' } };
