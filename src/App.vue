<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted, onUnmounted, ref } from 'vue';
import TxDialog from './components/TxDialog.vue';
import { useBaseStore } from '@/stores';

const REFRESH_INTERVAL = import.meta.env.VITE_REFRESH_INTERVAL || 6000;

const blockStore = useBaseStore();
const requestCounter = ref(0);
let pollingTimer: ReturnType<typeof setInterval> | null = null;

function startPolling() {
  if (pollingTimer !== null) return;
  pollingTimer = setInterval(() => {
    if (requestCounter.value >= 5) return;
    requestCounter.value += 1;
    blockStore.fetchLatest().finally(() => {
      requestCounter.value -= 1;
    });
  }, REFRESH_INTERVAL);
}

function stopPolling() {
  if (pollingTimer !== null) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopPolling();
  } else {
    startPolling();
  }
}

onMounted(() => {
  themeChange(false);
  startPolling();
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  stopPolling();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <div>
    <RouterView />
    <TxDialog />
  </div>
</template>
