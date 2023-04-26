<script setup lang="ts">
import { useThemeConfig } from '@core/composable/useThemeConfig';
import type { ThemeSwitcherTheme } from '@layouts/types';
import { onMounted, watch } from 'vue';

const props = defineProps<{
  themes: ThemeSwitcherTheme[];
}>();

const { theme } = useThemeConfig();
const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(
  props.themes.map(t => t.name),
  { initialValue: theme.value }
);

const changeTheme = () => {
  theme.value = getNextThemeName();
  console.log(theme.value, 'theme.value', window.matchMedia('(prefers-color-scheme: dark)').matches)
  
};

const changeMode = (val: 'dark' | 'light' | 'system') => {
  let value = val;
  if (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    value = 'dark';
  }
  if (value === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
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
  <IconBtn @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip activator="parent" open-delay="1000">
      <span class="text-capitalize">{{ currentThemeName }}</span>
    </VTooltip>
  </IconBtn>
</template>
