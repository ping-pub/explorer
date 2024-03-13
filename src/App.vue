<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';
import { SpeedInsights } from "@vercel/speed-insights/vue"

onMounted(() => {
  themeChange(false);
});
</script>

<template>
  <SpeedInsights />
  <div>
    <RouterView />
    <TxDialog />
  </div>
</template>
