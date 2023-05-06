<script lang="ts" setup>
import { select } from './index';

const props = defineProps(['value', 'direct']);
</script>
<template>
  <Component :is="select(value, direct)" :value="value"></Component>
</template>
