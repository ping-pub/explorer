<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  themes: {
    name: string;
    icon: string;
  }[];
}>();

const themeMap = { system: 'mdi-laptop', light: 'mdi-weather-sunny', dark: 'mdi-weather-night' }

const theme = ref(window.localStorage.getItem('theme') || 'dark');

const changeMode = () => {
  let value = 'dark';
  if (theme.value === 'dark') {
    value = 'light';
  }
  if (
    theme.value === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    value = 'dark';
  }
  if (value === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
  document.documentElement.setAttribute('data-theme', value);
  window.localStorage.setItem('theme', value);
};


onMounted(() => {

});
</script>

<template>
  <div class="tooltip tooltip-bottom delay-1000">
    <button class=" btn btn-ghost btn-circle btn-sm mx-1" @click="changeMode">
      <Icon :icon="props.themes[theme].icon" class="text-2xl" />
    </button>
  </div>
</template>
