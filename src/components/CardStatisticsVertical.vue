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

const calculateBg = function (color: string, title: string) {
  switch (true) {
    case color === 'error':
      return 'bg-[#401011]';
    case color === 'success':
      return 'bg-[#1A3944]';
    case color === 'success' && title === 'Inflation':
      return 'bg-[#301935]';
    case color === 'warning':
      return 'bg-[#3D2011]';
    case color === 'primary' && title === 'Community Pool':
      return 'bg-[#1F2814]';
    default:
      return 'bg-[#1C1C37]';
  }
};

const calculateText = function (color: string, title: string) {
  switch (true) {
    case color === 'error':
      return 'text-[#E84F4F]';
    case color === 'success' && title === 'Inflation':
      return 'text-[#D844E5]';
    case color === 'success':
      return 'text-[#44DBF5]';
    case color === 'warning':
      return 'text-[#E07223]';
    case color === 'primary' && title === 'Community Pool':
      return 'text-[#0EB619]';
    default:
      return 'text-[#7861FF]';
  }
};
</script>

<template>
  <div class="bg-[#141415] shadow rounded p-4">
    <div class="flex items-center justify-center">
      <div
        v-if="props.icon"
        class="relative w-9 h-9 rounded overflow-hidden flex items-center justify-center"
      >
        <Icon
          :class="[`${calculateText(props?.color, props.title)}`]"
          :icon="props.icon"
          size="32"
        />
        <div
          class="absolute top-0 left-0 bottom-0 right-0 opacity-50"
          :class="[`${calculateBg(props?.color, props.title)}`]"
        ></div>
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
      <h6 class="text-lg text-center font-semibold mt-2 mb-1">
        {{ props.stats || '-' }}
      </h6>
      <p class="text-sm text-center">
        {{ props.title }}
      </p>

      <div v-if="props.subtitle" size="x-small" class="font-semibold">
        <span class="truncate">{{ props.subtitle }}</span>
      </div>
    </div>
  </div>
</template>
