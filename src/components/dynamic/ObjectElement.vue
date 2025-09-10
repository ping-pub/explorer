<script lang="ts" setup>
import { ref } from 'vue';
import { select } from './index';

const props = defineProps(['value']);

function formatKey(key: string | number) {
  return String(key).replaceAll('_', ' ');
}
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-3 text-sm dark:bg-base-200 bg-[#ffffff;] rounded-xl px-4 py-2 pt-0.5 pb-0.5 overflow-x-auto txsContainer">
      <template v-for="(v, k) in value" :key="k">
        <div
            :class="String(k) === 'signatures'
            ? 'text-[#171C1F;] dark:text-[#ffffff;] font-bold capitalize whitespace-break-spaces'
            : 'text-[#64748B] font-medium capitalize whitespace-break-spaces'"
            >
            {{ formatKey(k) }}
          </div>

        <div class="text-[#171C1F] dark:text-white break-words">
          <template v-if="typeof v === 'object' && !Array.isArray(v)">
            <div class="flex flex-col gap-2">
              <template v-for="(subVal, subKey) in v" :key="subKey">
                <div class="flex items-start gap-2">
                  <span class="text-[#64748B] min-w-[100px] font-medium">{{ formatKey(subKey) }}</span>
                  <span class="text-[#171C1F] dark:text-white break-all">{{ subVal }}</span>
                </div>
              </template>
            </div>
          </template>

          <Component
            v-else-if="v"
            :is="select(v, 'horizontal')"
            :value="v"
          />
          <span v-else class="text-gray-400">—</span>
        </div>
      </template>
    </div>
</template>

<style scoped>
</style>
