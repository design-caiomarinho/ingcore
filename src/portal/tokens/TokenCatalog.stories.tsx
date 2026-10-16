import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenCatalog } from './TokenCatalog';

const meta = { title: 'Portal/Tokens/Base parcial', component: TokenCatalog, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof TokenCatalog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Inventario: Story = { name: 'Inventário do Figma' };
