<template>
  <!-- Ad container with required attributes -->
  <ins
    class="adsbyslise"
    :style="adStyle"
    :data-ad-slot="slot"
    :data-ad-pub="publisherId"
    :data-ad-format="format"
  ></ins>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

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
  }
});

const adStyle = {
  display: 'inline-block',
  width: '728px',
  height: '90px'
};

onMounted(() => {
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
</script>
