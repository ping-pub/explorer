<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  copyText: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md'
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
});

const copied = ref(false);
const textToCopy = props.copyText || props.text;

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};
</script>

<template>
  <div class="inline-flex items-center relative">
    <!-- Content to display -->
    <slot v-if="!iconOnly">{{ text }}</slot>
    
    <!-- Copy icon button -->
    <button 
      @click.stop="copyToClipboard" 
      class="ml-1.5 focus:outline-none transition-colors duration-200 hover:text-accent"
      :class="{ 'text-accent': copied }"
      title="Copy to clipboard"
    >
      <Icon 
        :icon="copied ? 'mdi:check' : 'mdi:content-copy'" 
        :class="{
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-lg': size === 'lg'
        }"
      />
    </button>
    
    <!-- Tooltip -->
    <div 
      v-if="copied" 
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-base-300 rounded shadow-md z-10"
    >
      Copied!
    </div>
  </div>
</template> 