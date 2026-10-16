import type { Preview } from '@storybook/react-vite';
import '../src/portal/styles/index.scss';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: {
        desktop: { name: 'Desktop · Figma', styles: { width: '1440px', height: '1079px' } },
        tablet: { name: 'Tablet · Figma', styles: { width: '1024px', height: '1296px' } },
        mobile: { name: 'Mobile · Figma', styles: { width: '430px', height: '1739px' } },
      },
    },
  },
};
export default preview;
