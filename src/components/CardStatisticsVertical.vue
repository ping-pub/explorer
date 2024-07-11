<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { controlledComputed } from '@vueuse/core';

interface Props {
  title: string;
  color?: string;
  icon: string;
  stats: string;
  change?: number;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
});

const isPositive = controlledComputed(
  () => props.change,
  () => Math.sign(props.change || 0) === 1
);
</script>

<template>
  <div class="">
    <div class="flex items-center justify-center">
      <div
        v-if="props.icon"
        class="relative w-9 h-9 rounded overflow-hidden flex items-center justify-center"
      >
        <!-- <Icon :class="[`text-${props?.color}`]" :icon="props.icon" size="32" /> -->
        <Icon class="text-[#B4B7BB]" :icon="props.icon" size="32" />
        <div
          class="absolute top-0 left-0 bottom-0 right-0 opacity-20 bg-[rgba(180,183,187,0.10)]"
        ></div>
        <!-- :class="[`bg-${props?.color}`]" -->
      </div>

      <div
        v-if="props.change"
        :class="isPositive ? 'text-success' : 'text-error'"
        class="flex items-center text-sm font-semibold"
      >
        <span>{{ isPositive ? `+${props.change}` : props.change }}%</span>
        <Icon :icon="isPositive ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
      </div>
    </div>

    <div class="">
      <h6 class="text-[16px] text-white font-bold text-center mt-2 mb-1">
        {{ props.stats || '-' }}
      </h6>
      <p class="text-sm text-center">
        {{ props.title }}
      </p>

      <div
        v-if="props.subtitle"
        size="x-small"
        class="font-normal text-[14px] text-[#B4B7BB]"
      >
        <span class="truncate">{{ props.subtitle }}</span>
      </div>
    </div>
  </div>
</template>
