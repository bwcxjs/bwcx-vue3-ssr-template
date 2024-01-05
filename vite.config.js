const { defineConfig } = require('vite');
const path = require('path');
const viteSSR = require('vite-ssr/plugin');
const vue = require('@vitejs/plugin-vue');

const isProd = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  server: {
    fs: {
      // The API logic is in outside of the project
      strict: false,
    },
  },
  // If using CDN, you can set base like 'https://yourcdn.com/dist/'
  base: isProd ? '/dist/' : undefined,
  define: {
    'process.env': {
      BWCX_RUNTIME_SCOPE: 'client',
    },
  },
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, './public'),
      '@client': path.resolve(__dirname, './src/client'),
      '@common': path.resolve(__dirname, './src/common'),
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    viteSSR({
      build: {
        keepIndexHtml: true,
      },
    }),
    vue(),
  ],
});
