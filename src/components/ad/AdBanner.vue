<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute()

const aa = computed(() => {
  const hostname = location.hostname
  if (hostname === 'testnet.ping.pub') {
    return '2396360'
  } else if (hostname === 'ping.pub') {
    return '2395639'
  } else {
    return '2396360'
  }
});
</script>
<template>
  <iframe :data-aa='`${aa}`' :src="`//acceptable.a-ads.com/${aa}?${route.path}`" style='border:0px; padding:0; width:100%; height:70px; overflow:hidden; margin-bottom: 5px; background-color: transparent;'></iframe>
</template>
