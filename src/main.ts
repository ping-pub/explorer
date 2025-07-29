// import 'ping-widget';
import App from '@/App.vue';
import i18n from '@/plugins/i18n';
import '@/style.css';
import { createApp, ref, watch } from 'vue';
import { createPinia } from 'pinia';
import LazyLoad from 'lazy-load-vue3';

import router from './router';
import { useBaseStore } from './stores/useBaseStore';

// Create vue app
const app = createApp(App);
// Use plugins
app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(LazyLoad, { component: true });
// Mount vue app
app.mount('#app');

// fetch latest block every <blocktime> ms
const baseStore = useBaseStore();
const requestCounter = ref(0);

let intervalId: NodeJS.Timeout;

const startInterval = () => {
  clearInterval(intervalId); // Clear any existing interval
  // console.log('Starting interval with blocktime:', baseStore.blocktime);

  intervalId = setInterval(() => {
    requestCounter.value += 1;
    if (requestCounter.value < 5) {
      // max allowed request
      baseStore.fetchLatest().finally(() => (requestCounter.value -= 1));
    }
  }, baseStore.blocktime);
};

// Call startInterval initially
startInterval();

// Watch for changes to baseStore.blocktime
watch(
  () => baseStore.blocktime,
  () => {
    startInterval(); // Restart the interval when baseStore.blocktime changes
  }
);
