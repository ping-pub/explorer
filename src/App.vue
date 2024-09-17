<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';

onMounted(() => {
  // Clear Local Storage temporarily until dukong is ready
  localStorage.clear();

  themeChange(false);
});
</script>

<template>
  <div>
    <RouterView />
    <TxDialog />
  </div>
</template>
