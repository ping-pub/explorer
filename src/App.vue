<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';
import { Analytics } from '@vercel/analytics/vue';

onMounted(() => {
  themeChange(false);
});
</script>

<template>
  <div class='h-full'>
    <Analytics />
    <RouterView />
    <TxDialog />
  </div>
</template>
