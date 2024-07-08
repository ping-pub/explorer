<script lang="ts" setup>
import type { PropType } from 'vue';
import { useFormatter } from '@/stores';
import { formatSeconds, formatTitle } from '@/libs/utils';
import { fromAscii, toBase64 } from '@cosmjs/encoding';
import numeral from 'numeral';
const props = defineProps({
  cardItem: {
    type: Object as PropType<{ title: string; items: Array<any> }>,
  },
  grid: {
    type: Object as PropType<number>,
  },
});

const formatter = useFormatter();
function calculateValue(value: any) {
  if (!value) return;

  if (value instanceof Uint8Array) {
    try {
      return formatter.formatDecimalToPercent(fromAscii(value), 1e18);
    } catch {
      return '-';
    }
  }

  if (Array.isArray(value)) {
    return (value[0] && value[0].amount) || '-';
  }

  if (
    (typeof value === 'object' && 'seconds' in value) ||
    String(value).search(/^\d+s$/g) > -1
  ) {
    return formatSeconds(value);
  }
  const newValue = Number(value);
  if (`${newValue}` === 'NaN' || typeof value === 'boolean') {
    return value;
  }

  // check is correct percent format
  const decimalFormat = numeral(value);
  if (decimalFormat) {
    const decimalValue = decimalFormat.value();
    if (decimalValue && decimalValue < 1 && decimalValue > 0) {
      return decimalFormat.format('0.[00]%');
    }
  }

  return newValue;
}
</script>
<template>
  <div
    class="bg-base-100 px-6 py-6 rounded-[16px] mt-5"
    v-if="props.cardItem?.items && props.cardItem?.items?.length > 0"
  >
    <div class="text-base font-semibold mb-3 text-white">
      {{ props.cardItem?.title }}
    </div>
    <div
      class="grid grid-cols-2 md:!grid-cols-2 gap-4"
      :class="{
        [`lg:!grid-cols-${props.grid}`]: props.grid,
        [`2xl:!grid-cols-${props.grid}`]: props.grid,
      }"
    >
      <div
        v-for="(item, index) of props.cardItem?.items"
        :key="index"
        class="rounded-lg bg-[rgba(180,183,187,0.10)] px-4 py-2"
      >
        <div class="text-sm mb-2 text-[#B4B7BB] capitalize text-break">
          {{ formatTitle(item?.subtitle) }}
        </div>
        <div class="text-[14px] text-white text-break font-semibold">
          {{ calculateValue(item?.value) }}
        </div>
      </div>
    </div>
  </div>
</template>
