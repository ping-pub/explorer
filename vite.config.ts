import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Layouts from 'vite-plugin-vue-layouts';
import tsconfigPaths from 'vite-tsconfig-paths';
import AutoImport from 'unplugin-auto-import/vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    tsconfigPaths(),
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
          new URL('./src/plugins/i18n/locales/**', import.meta.url),
        ),
      ],
    }),
    DefineOptions(),
  ],
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
  },
});
