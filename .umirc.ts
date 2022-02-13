import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'like-tool',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  base: '/like',
  publicPath: '/like/',
  exportStatic: {},
  mode: 'site',
  resolve: {
    includes: ['docs', 'packages/hooks/src', 'packages/hocs/src','packages/components/src'],
  },
  navs: [
    {
      title: 'Hooks',
      path: '/hooks',
    },
    {
      title: 'Hocs',
      path: '/hocs',
    },
    {
      title: 'Components',
      path: '/components',
    },
  ],
  // more config: https://d.umijs.org/config
});
