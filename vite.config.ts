import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Layouts from 'vite-plugin-vue-layouts';
import DefineOptions from 'unplugin-vue-define-options/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import type { Plugin } from 'vite';

// Security patterns to block
const SUSPICIOUS_PATTERNS = [
  'eval-stdin.php',
  'think\\app',
  '.git/config',
  '_profiler',
  'wp-login',
  'wp-admin',
  'install.php',
  'phpMyAdmin',
  'invokefunction',
  '../',
  '..%2f',
  '%2e%2e%2f', // URL encoded ../
];

// Create a custom security plugin
const securityPlugin = (): Plugin => ({
  name: 'security-middleware',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      try {
        // Get URL and decode safely
        const url = req.url || '';

        // Check for suspicious patterns
        if (SUSPICIOUS_PATTERNS.some((pattern) => url.includes(pattern))) {
          // Log blocked attempt
          console.log(`Blocked suspicious request: ${url}`);

          // Return 403 Forbidden
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }

        // Process normal requests
        next();
      } catch (error) {
        // Handle any errors during middleware processing
        console.error('Middleware error:', error);
        res.statusCode = 400;
        res.end('Bad Request');
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    // Add the security plugin FIRST to filter requests before other plugins
    securityPlugin(),
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
      imports: ['vue', 'vue-router', '@vueuse/math', 'vue-i18n', 'pinia'],
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
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-charts': ['vue3-apexcharts', 'apexcharts'],
          'vendor-cosm': ['@cosmjs/stargate', '@cosmjs/amino', '@cosmjs/encoding'],
          'vendor-ui': ['@iconify/vue', 'daisyui'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
    include: ['vue', 'vue-router', 'pinia', '@iconify/vue'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://pocket_indexer_api:3006',
        // target: 'http://127.0.0.1:3005',
        // target: 'https://explorer.pocket.network',
        changeOrigin: true,
      },
    },
    fs: {
      // Deny access to .git directory
      deny: ['.git'],
    },
  },
});
