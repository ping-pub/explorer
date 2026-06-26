<template>
  <!-- Ad container with required attributes -->
  <div ref="containerRef" class="flex w-full justify-center overflow-hidden" :style="containerStyle">
    <ins
      class="adsbyslise"
      :style="adStyle"
      :data-ad-slot="slot"
      :data-ad-pub="publisherId"
      :data-ad-format="format"
    ></ins>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

declare global {
  interface Window {
    adsbyslise: any[];
    adsbyslisesync?: () => void;
  }
}

const props = defineProps({
  slot: {
    type: String,
    default: 'desktop'
  },
  publisherId: {
    type: String,
    default: 'pub-47'
  },
  format: {
    type: String,
    default: '728x90'
  },
  width: {
    type: String,
    default: '728px'
  },
  height: {
    type: String,
    default: '90px'
  }
});

const containerRef = ref<HTMLElement | null>(null);
const scale = ref(1);

function toPixels(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const adWidth = computed(() => toPixels(props.width));
const adHeight = computed(() => toPixels(props.height));

const containerStyle = computed(() => ({
  height: `${adHeight.value * scale.value}px`
}));

const adStyle = computed(() => ({
  display: 'inline-block',
  width: props.width,
  height: props.height,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center'
}));

let observer: ResizeObserver | undefined;

function updateScale() {
  if (!containerRef.value || !adWidth.value) return;
  scale.value = Math.min(1, containerRef.value.clientWidth / adWidth.value);
}

onMounted(() => {
  updateScale();
  observer = new ResizeObserver(updateScale);
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  // Load script only once
  if (!document.querySelector('script[src="https://v1.slise.xyz/scripts/embed.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://v1.slise.xyz/scripts/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }

  // Initialize ad queue
  window.adsbyslise = window.adsbyslise || [];
  window.adsbyslise.push({ slot: props.slot });
  
  // Sync if available
  if (typeof window.adsbyslisesync === 'function') {
    window.adsbyslisesync();
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
