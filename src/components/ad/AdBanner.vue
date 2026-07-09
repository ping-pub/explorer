<template>
  <!-- Ad container with required attributes -->
  <div ref="containerRef" class="flex w-full justify-center overflow-hidden" :style="containerStyle">
    <ins
      ref="insRef"
      class="adsbyslise"
      :style="adStyle"
      :data-ad-slot="slot"
      :data-ad-pub="publisherId"
      :data-ad-format="format"
    ></ins>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

declare global {
  interface Window {
    adsbyslise: any[];
    adsbyslisesync?: () => void;
  }
}

const SLISE_EMBED_SRC = 'https://v1.slise.xyz/scripts/embed.js';

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
const insRef = ref<HTMLElement | null>(null);
const scale = ref(1);
const route = useRoute();

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

  window.adsbyslise = window.adsbyslise || [];
  window.adsbyslise.push({ slot: props.slot });

  const sync = () => window.adsbyslisesync?.();
  const existing = document.querySelector(`script[src="${SLISE_EMBED_SRC}"]`);

  if (window.adsbyslisesync) {
    sync();
  } else if (existing) {
    existing.addEventListener('load', sync, { once: true });
  } else {
    const script = document.createElement('script');
    script.src = SLISE_EMBED_SRC;
    script.async = true;
    script.addEventListener('load', sync, { once: true });
    document.head.appendChild(script);
  }
});

watch(() => route.fullPath, () => {
  if (!insRef.value || typeof window.adsbyslisesync !== 'function') return;
  insRef.value.removeAttribute('data-ad-loaded');
  window.adsbyslisesync();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
