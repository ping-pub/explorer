<script setup lang="ts">
import NewThemeSwitcher from '@/components/ThemeSwitcher.vue';
const themes: Array<{ name: string; icon: string }> = [
  {
    name: 'system',
    icon: 'mdi-laptop',
  },
  {
    name: 'light',
    icon: 'mdi-weather-sunny',
  },
  {
    name: 'dark',
    icon: 'mdi-weather-night',
  },
];
</script>

<template>
  <div>
    <NewThemeSwitcher :themes="themes" />
  </div>
</template>
