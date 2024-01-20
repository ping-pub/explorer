<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps({
  nextKey: { type: Uint8Array, required: false },
  total: { type: String },
  limit: { type: Number },
  callback: { type: Function, required: true },
});
const nextKeys = ref([] as (Uint8Array | undefined)[]);
const current = ref(1);
const showSize = 3;
const pages = computed(() => {
  const pages: { color: string; page: number }[] = [];
  const total = Number(props.total || 0);
  if (total > 0 && props.limit && total > props.limit) {
    let page = 0;
    while (true) {
      if (page * props.limit >= total) break;
      page += 1;
      if (
        total / props.limit > 10 &&
        page > showSize &&
        page < total / props.limit - showSize + 1
      ) {
        if (!(page >= current.value - 1 && page <= current.value + 1)) {
          continue;
        }
      }
      pages.push({
        color: page === current.value ? 'btn-primary' : '',
        page: page,
      });
    }
  }
  return pages;
});

function gotoPage(pageNum: number) {
  current.value = pageNum;
  props.callback(pageNum);
}

function goNextPage() {
  nextKeys.value.push(props.nextKey);
  props.callback(undefined, props.nextKey);
}

function goPreviousPage() {
  nextKeys.value.pop();
  props.callback(undefined, nextKeys.value[nextKeys.value.length - 1]);
}
</script>
<template>
  <div class="my-5 text-center">
    <div v-if="total && limit" class="btn-group">
      <button
        v-for="{ page, color } in pages"
        :key="page"
        class="btn bg-gray-100 text-gray-500 hover:text-white border-none dark:bg-gray-800 dark:text-white"
        :class="{
          '!btn-primary': color === 'btn-primary',
        }"
        @click="gotoPage(page)"
      >
        {{ page }}
      </button>
    </div>
    <div v-if="nextKey && Number(total ?? '0') === 0" class="btn-group">
      <button
        v-if="nextKeys.length > 0"
        class="btn bg-gray-100 text-gray-500 hover:text-white hover:btn-primary border-none dark:bg-gray-800 dark:text-white"
        @click="goPreviousPage()"
      >
        Prev
      </button>
      <button
        class="btn bg-gray-100 text-gray-500 hover:text-white hover:btn-primary border-none dark:bg-gray-800 dark:text-white"
        @click="goNextPage()"
      >
        Next
      </button>
    </div>
  </div>
</template>
