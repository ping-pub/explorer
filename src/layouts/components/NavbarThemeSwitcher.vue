<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@layouts/types'
import NewThemeSwitcher from '@/components/ThemeSwitcher.vue'
const themes: ThemeSwitcherTheme[] = [
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
]
</script>

<template>
  <div>
    <NewThemeSwitcher :themes="themes"/>
  </div>
</template>
