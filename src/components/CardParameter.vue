<script lang="ts" setup>
import type { PropType } from 'vue';
import { useFormatter } from '@/stores';
import { formatSeconds } from '@/libs/utils';
const props = defineProps({
  cardItem: {
    type: Object as PropType<{ title: string; items: Array<any> }>,
  },
});

const formatter = useFormatter();
function calculateValue(value: any) {
  if (Array.isArray(value)) {
    return (value[0] && value[0].amount) || '-';
  }
  if(String(value).search(/^\d+s$/g) > -1) {
    return formatSeconds(value)
  }
  const newValue = Number(value);
  if (`${newValue}` === 'NaN' || typeof value === 'boolean') {
    return value;
  }

  if (newValue < 1 && newValue > 0) {
    return formatter.formatDecimalToPercent(value);
  }
  return newValue;
}

function formatTitle(v: string) {
  if(!v) return ""
  return v.replace(/_/g, " ")
}
</script>
<template>
  <div
    class="bg-base-100 px-4 pt-3 pb-4 rounded mt-5"
    v-if="props.cardItem?.items && props.cardItem?.items?.length > 0"
  >
    <div class="text-base mb-3 text-main">{{ props.cardItem?.title }}</div>
    <div
      class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4"
    >
      <div
        v-for="(item, index) of props.cardItem?.items"
        :key="index"
        class="rounded-sm bg-active px-4 py-2"
      >
        <div class="text-xs mb-2 text-secondary capitalize">{{ formatTitle(item?.subtitle) }}</div>
        <div class="text-base text-main">{{ calculateValue(item?.value) }}</div>
      </div>
    </div>
  </div>
</template>
