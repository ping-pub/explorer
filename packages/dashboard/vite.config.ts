import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";
import Layouts from "vite-plugin-vue-layouts";
import DefineOptions from "unplugin-vue-define-options/vite";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vuetify({
      styles: {
        configFile: "src/plugins/vuetify/styles/variables/_vuetify.scss",
      },
    }),
    Pages({
      dirs: ["./src/pages", "./src/modules"],
    }),
    Layouts({
      layoutsDirs: "./src/layouts/",
    }),
    Components({
      dirs: ["src/plugins/vuetify/@core/components"],
      dts: true,
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core", "@vueuse/math", "pinia"],
      vueTemplate: true,
    }),
    DefineOptions(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@themeConfig": fileURLToPath(
        new URL("./themeConfig.ts", import.meta.url)
      ),
      "@configured-variables": fileURLToPath(
        new URL(
          "./src/plugins/vuetify/styles/variables/_template.scss",
          import.meta.url
        )
      ),
      "@core": fileURLToPath(
        new URL("./src/plugins/vuetify/@core", import.meta.url)
      ),
      "@layouts": fileURLToPath(
        new URL("./src/plugins/vuetify/@layouts", import.meta.url)
      ),
      "@images": fileURLToPath(
        new URL("./src/plugins/vuetify/images/", import.meta.url)
      ),
      "@styles": fileURLToPath(
        new URL("./src/plugins/vuetify/styles/", import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    exclude: ["vuetify"],
    entries: ["./src/**/*.vue"],
  },
});
