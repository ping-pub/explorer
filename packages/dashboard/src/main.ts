import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './scss/index.scss'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createVuetify({
    components,
    directives,
}));

app.mount("#app");
