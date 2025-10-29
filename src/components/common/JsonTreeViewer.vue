<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ data: any }>();

const isObject = (val: any) =>
  typeof val === 'object' && val !== null;

const expanded = ref<{ [key: string]: boolean }>({});

const toggle = (key: string | number) => {
  const k = String(key)
  expanded.value[k] = !expanded.value[k];
};
</script>

<template>
  <div class="pl-3 font-mono text-sm select-text">
    <div v-for="(value, key) in props.data" :key="key" class="mb-1">
      <div class="flex items-start cursor-pointer" @click.stop="toggle(key)">
        <!-- Expand/Collapse Icons -->
        <span class="mr-1 text-blue-500 select-none">
          <span v-if="isObject(value)">
            {{ expanded[String(key)] ? '▼' : '▶' }}
          </span>
          <span v-else class="text-transparent">▶</span>
        </span>

        <!-- Key -->
        <span class="font-semibold text-[#2563EB]">{{ key }}:</span>

        <!-- Object/Array -->
        <template v-if="isObject(value)">
          <span class="text-gray-400 ml-1">
            {{ Array.isArray(value) ? '[...]' : '{...}' }}
          </span>
        </template>

        <!-- Primitive -->
        <template v-else>
          <span
            class="ml-1"
            :class="{
              'text-green-600': typeof value === 'string',
              'text-orange-500': typeof value === 'number',
              'text-purple-500': typeof value === 'boolean'
            }"
          >
            {{ JSON.stringify(value) }}
          </span>
        </template>
      </div>

      <!-- Nested Children -->
      <div
        v-if="expanded[String(key)] && isObject(value)"
        class="ml-5 border-l border-gray-300 pl-3 mt-1"
      >
        <JsonTreeViewer :data="value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
