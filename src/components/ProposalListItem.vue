<script lang="ts" setup>
import { useBlockchain, useFormatter, useStakingStore } from '@/stores';
import type { PaginatedProposals } from '@/types';
import ProposalProcess from './ProposalProcess.vue';
import type { PropType } from 'vue';

defineProps({
  proposals: { type: Object as PropType<PaginatedProposals> },
});

const format = useFormatter();
const staking = useStakingStore();
const chain = useBlockchain();
function showType(v: string) {
  if (v) {
    return v.substring(v.lastIndexOf('.') + 1);
  }
  return v;
}

const statusMap: Record<string, string> = {
  PROPOSAL_STATUS_VOTING_PERIOD: 'VOTING',
  PROPOSAL_STATUS_PASSED: 'PASSED',
  PROPOSAL_STATUS_REJECTED: 'REJECTED',
};
</script>
<template>
  <div class="bg-white dark:bg-[#28334e] rounded text-sm">
    <RouterLink
      :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
      v-for="(item, index) in proposals?.proposals"
      :key="index"
      class="py-4 px-4 hover:bg-gray-100 dark:hover:bg-[#353f5a] block rounded cursor-pointer"
    >
      <div class="grid grid-cols-6 md:grid-cols-11 flex-1">
        <div class="text-textMain dark:text-white mb-3">#{{ item?.proposal_id }}</div>

        <div class="col-span-5 md:pr-10 text-textMain dark:text-white truncate">
          {{ item?.content?.title }}
        </div>

        <div class="col-span-3 mb-3 truncate">
          <div
            class="bg-[#f6f2ff] text-[#9c6cff] dark:bg-gray-600 dark:text-gray-300 inline-block rounded-full px-2 py-[1px] text-xs"
          >
            {{ showType(item.content['@type']) }}
          </div>
        </div>

        <div
          class="flex items-center mb-3"
          :class="
            statusMap?.[item?.status] === 'PASSED'
              ? 'text-yes'
              : statusMap?.[item?.status] === 'REJECTED'
              ? 'text-no'
              : 'text-info'
          "
        >
          <div
            class="w-1 h-1 rounded-full mr-2"
            :class="
              statusMap?.[item?.status] === 'PASSED'
                ? 'bg-yes'
                : statusMap?.[item?.status] === 'REJECTED'
                ? 'bg-no'
                : 'bg-info'
            "
          ></div>
          <div class="text-xs">{{ statusMap?.[item?.status] || item?.status }}</div>
        </div>

        <div
          class="truncate mb-3 col-span-2 md:col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right md:flex md:justify-start"
        >
          {{ format.toDay(item.voting_end_time, 'from') }}
        </div>
      </div>
      <ProposalProcess :pool="staking.pool" :tally="item.final_tally_result"></ProposalProcess>
    </RouterLink>
  </div>
</template>
