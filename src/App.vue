<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  themeChange(false);
  if(window.location.pathname.length == 1)
    router.push('/poktroll')
});
</script>

<template>
  <div>
    <RouterView />
    <TxDialog />
  </div>
</template>
