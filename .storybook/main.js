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
  viteFinal: async (config) => {
    // 讓打包後的資產路徑以 /storybook/ 為根
    return { ...config, base: '/storybook/' };
  },
};

export default config;