import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: [
          // Make the variables defined in these files available to all components, without requiring an explicit
          // @import of the files themselves
          '@import "./src/scss/index"',
          '@import "vuetify/src/styles/settings/_variables"',
          '', // end with newline
        ].join('\n'),
      },
    },
  },
});
