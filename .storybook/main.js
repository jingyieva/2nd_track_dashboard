const config = {
  framework: '@storybook/react-vite',
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions'
  ],
};

export default config;