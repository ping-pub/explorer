<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, computed } from 'vue';
import { useBaseStore } from '@/stores';

const themeMap: Record<string, string> = {
    system: 'mdi-laptop',
    light: 'mdi-weather-sunny',
    dark: 'mdi-weather-night',
};
const baseStore = useBaseStore();
const theme = computed(() => {
    return baseStore.theme;
});

const changeMode = (val?: 'dark' | 'light') => {
    let value: 'dark' | 'light' = 'dark';
    const currentValue: 'dark' | 'light' = val || theme.value;
    if (currentValue === 'dark') {
        value = 'light';
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
    baseStore.theme = value;
};

onMounted(() => {
    changeMode(theme.value === 'light' ? 'dark' : 'light');
});
</script>

<template>
    <div class="tooltip tooltip-bottom delay-1000">
        <button
            class="btn btn-ghost btn-circle btn-sm mx-1"
            @click="changeMode()"
        >
            <Icon :icon="themeMap?.[theme]" class="text-2xl text-gray-500 dark:text-gray-400" />
        </button>
    </div>
</template>
