/* eslint-disable import/order */
import "@/plugins/vuetify/@iconify/icons-bundle";
import App from "@/App.vue";
import layoutsPlugin from "@/plugins/vuetify/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/vuetify/webfontloader";
import "@/plugins/vuetify/@core/scss/template/index.scss";
import "@/plugins/vuetify/styles/styles.scss";
import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { useDashboard } from "./stores/useDashboard";
// import router from "@/plugins/vuetify/router";
import router from "./router";

loadFonts();

// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(layoutsPlugin);
app.use(router);


// Mount vue app
app.mount("#app");
