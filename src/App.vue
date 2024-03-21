<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { inject } from "@vercel/analytics";

onMounted(() => {
  themeChange(false);
});
</script>

<template>
  <SpeedInsights />
  <inject />
  <div>
    <RouterView />
    <TxDialog />
  </div>
</template>
