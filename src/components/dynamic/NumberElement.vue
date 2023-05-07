<script lang="ts" setup>
const props = defineProps(['value']);
</script>
<template>
  <span>{{ Number(props.value) }}</span>
</template>
