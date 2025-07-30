// import 'ping-widget';
import App from '@/App.vue';
import i18n from '@/plugins/i18n';
import '@/style.css';
import { createApp, ref } from 'vue';
import { createPinia } from 'pinia';
import LazyLoad from 'lazy-load-vue3';

import router from './router';
import { useBaseStore } from '@/stores';

// Create vue app
const app = createApp(App);
// Use plugins
app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(LazyLoad, { component: true });
// Mount vue app
app.mount('#app');

const REFRESH_INTERVAL = import.meta.env.VITE_REFRESH_INTERVAL || 6000; // 6 seconds

// fetch latest block every 6s
const blockStore = useBaseStore();
const requestCounter = ref(0);
setInterval(() => {
  requestCounter.value += 1;
  if (requestCounter.value < 5) {
    // max allowed request
    blockStore.fetchLatest().finally(() => (requestCounter.value -= 1));
  }
}, REFRESH_INTERVAL);
