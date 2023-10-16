// import 'ping-widget';
import App from '@/App.vue';
import i18n from '@/plugins/i18n';
import './styles/global.scss';
import { createApp, ref,onMounted } from 'vue';
import { createPinia } from 'pinia';
import LazyLoad from 'lazy-load-vue3';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import 'vuetify/dist/vuetify.min.css'
 // Ensure you are using css-loader
import { useBaseStore } from './stores/useBaseStore';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { useBlock } from '@/stores/useBlock';

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
// Create vue app
const app = createApp(App);
// Use plugins
app.use(i18n);
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },});
app.use(vuetify)
app.use(createPinia());
app.use(router);
app.use(LazyLoad, { component: true });
// Mount vue app
app.mount('#app');
const socket = useBlock();
onMounted(() => {
  socket.subscribeToWebSocket();
});
// fetch latest block every 6s
const blockStore = useBaseStore();
const requestCounter = ref(0);
setInterval(() => {
  requestCounter.value += 1;
  if (requestCounter.value < 5) {
    // max allowed request
    blockStore.fetchLatest().finally(() => (requestCounter.value -= 1));
  }
}, 6000);
