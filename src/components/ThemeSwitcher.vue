<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@layouts/types';
import { Icon } from '@iconify/vue';
import { onMounted, watch, ref } from 'vue';

const props = defineProps<{
  themes: ThemeSwitcherTheme[];
}>();

const theme = ref('light');
const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(
  props.themes.map((t) => t.name),
  { initialValue: theme.value }
);

const changeTheme = () => {
  theme.value = getNextThemeName();
};

const changeMode = (val: 'dark' | 'light' | 'system') => {
  let value = val;
  if (
    theme.value === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    value = 'dark';
  }
  if (value === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
  document.documentElement.setAttribute('data-theme', value);
};
// Update icon if theme is changed from other sources
watch(theme, (val: 'dark' | 'light' | 'system') => {
  currentThemeName.value = val;
  changeMode(val);
});

onMounted(() => {
  if (currentThemeName.value) {
    changeMode(currentThemeName.value);
  }
});
</script>

<template>
  <div class="tooltip tooltip-bottom delay-1000" :data-tip="currentThemeName">
    <button class="btn btn-ghost btn-circle btn-sm mx-1" @click="changeTheme">
      <Icon :icon="props.themes[currentThemeIndex].icon" class="text-2xl" />
    </button>
  </div>
</template>
