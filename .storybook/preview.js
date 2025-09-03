import '../src/styles/index.css'; 
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      return Story();
    },
  ],
  globals: {
    theme: 'dark',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: '全域主題切換',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;