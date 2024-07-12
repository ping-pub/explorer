import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Layouts from 'vite-plugin-vue-layouts';
import DefineOptions from 'unplugin-vue-define-options/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import fs from 'fs';
import path from 'path';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  build: { chunkSizeWarningLimit: 20000 },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            [
              'ping-connect-wallet',
              'ping-token-convert',
              'ping-tx-dialog',
            ].includes(tag),
        },
      },
    }),
    vueJsx(),
    Pages({
      dirs: ['./src/modules', './src/pages'],
      exclude: ['**/*.ts'], // only load .vue as modules
    }),
    Layouts({
      layoutsDirs: './src/layouts/',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/math',
        'vue-i18n',
        'pinia',
      ],
      vueTemplate: true,
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [
        fileURLToPath(
          new URL('./src/plugins/i18n/locales/**', import.meta.url)
        ),
      ],
    }),
    DefineOptions(),

    // createHtmlPlugin({
    //   inject: {
    //     // Inject data into ejs template
    //     ejsOptions: {
    //       customCss: () => {
    //         const filepath = path.resolve(__dirname, './src/style.output.css');
    //         if (fs.existsSync(filepath)) {
    //           const css = fs.readFileSync(filepath, 'utf-8');
    //           console.log('css', css);
    //           return `<style>${css}</style>`;
    //         }
    //         return '';
    //       },
    //     },
    //   },
    // }),
    cssInjectedByJsPlugin({
      styleId: 'app-styles',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
  },
});
