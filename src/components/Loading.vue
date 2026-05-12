<script lang="ts" setup>
defineProps({
  height: { type: String, default: '72px' },
  size: { type: String, default: 'md' },
  text: { type: String, default: 'Loading ...' },
  bordered: { type: Boolean, default: true },
});
</script>

<template>
  <div
    class="flex justify-center items-center w-full gap-3"
    :class="{ 'bg-base-100 rounded shadow': bordered }"
    :style="{ height }"
  >
    <span class="loading loading-spinner text-primary" :class="`loading-${size}`"></span>
    <span class="text-center">{{ text }}</span>
  </div>
</template>
