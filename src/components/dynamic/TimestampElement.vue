<script lang="ts" setup>
import { useFormatter } from '@/stores';
const props = defineProps(['value']);
const format = useFormatter();
</script>
<template>
  <div class="overflow-auto">
    {{ format.toLocaleDate(value) }}
  </div>
</template>
