<script lang="ts" setup>
import { useRouter } from 'vue-router';
const props = defineProps(['chain']);
const router = useRouter();
router.push(`/${props.chain}/ibc/connection/connection-0`);
</script>
<template>
  <div></div>
</template>
<route>
    {
      meta: {
        i18n: 'ibc',
        order: 9
      }
    }
  </route>
