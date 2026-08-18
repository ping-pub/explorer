<script lang="ts" setup>
import { ref, watch } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useBaseStore } from '@/stores';

// Wraps vue-json-pretty with the controls every JSON panel needs, so the copy
// action is not reimplemented (or forgotten) at each call site.
const props = defineProps({
  data: { type: null, required: true },
  // How many levels are open initially.
  deep: { type: Number, default: 2 },
  // Virtual scrolling keeps a large document to a handful of DOM rows, but needs
  // a fixed height. Off by default so short results size to their content.
  virtual: { type: Boolean, default: false },
  height: { type: Number, default: 480 },
});

const baseStore = useBaseStore();

const depth = ref(props.deep);
const expanded = ref(false);
const copied = ref(false);
let resetCopied: ReturnType<typeof setTimeout> | undefined;

// A new result should start collapsed again rather than inherit the last state.
watch(
  () => props.data,
  () => {
    expanded.value = false;
    depth.value = props.deep;
  }
);

function toggle() {
  expanded.value = !expanded.value;
  // 1 leaves only the top level open; MAX_SAFE_INTEGER opens every branch.
  depth.value = expanded.value ? Number.MAX_SAFE_INTEGER : 1;
}

async function copy() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.data, null, 2));
    copied.value = true;
    clearTimeout(resetCopied);
    resetCopied = setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    console.error('Could not copy JSON to the clipboard:', err);
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-end gap-1 mb-1">
      <button type="button" class="btn btn-xs btn-ghost" @click="toggle">
        {{ expanded ? $t('json.collapse_all') : $t('json.expand_all') }}
      </button>
      <button type="button" class="btn btn-xs btn-ghost" @click="copy">
        {{ copied ? $t('json.copied') : $t('json.copy') }}
      </button>
    </div>
    <VueJsonPretty
      :data="data"
      :deep="depth"
      :theme="baseStore.theme || 'dark'"
      :virtual="virtual"
      :height="height"
      :item-height="20"
      :show-line-number="virtual"
      show-icon
      show-length
    />
  </div>
</template>
