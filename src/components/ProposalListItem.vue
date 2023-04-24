<script lang="ts" setup>
import MdEditor from 'md-editor-v3';
import { useBlockchain, useFormatter, useStakingStore } from '@/stores';
import type { GovProposal, PaginatedProposals } from '@/types';
import ProposalProcess from './ProposalProcess.vue';
import type { PropType } from 'vue';

const props = defineProps({
  proposals: { type: Object as PropType<PaginatedProposals> },
});
// const list = computed(()=> proposl)
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
  <div class="bg-[#28334e] rounded text-sm">
    <RouterLink
      :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
      v-for="(item, index) in proposals?.proposals"
      :key="index"
      class="py-4 px-4 hover:bg-[#353f5a] block rounded cursor-pointer"
    >
      <div class="grid grid-cols-6 md:grid-cols-11 flex-1">
        <div class="text-white mb-3">#{{ item?.proposal_id }}</div>

        <div class="col-span-5 md:pr-10 text-white truncate">
          {{ item?.content?.title }}
        </div>

        <div class="col-span-3 mb-3 truncate">
          <div class="bg-gray-600 text-gray-300 inline-block rounded-full px-2 py-[1px] text-xs">
            {{ showType(item.content['@type']) }}
          </div>
        </div>

        <div class="text-yes flex items-center mb-3">
          <div class="w-1 h-1 bg-yes rounded-full mr-2"></div>
          <div class="text-xs">{{ statusMap?.[item?.status] || item?.status }}</div>
        </div>

        <div class="truncate mb-3 col-span-2 md:col-span-1 text-xs text-gray-400 text-right md:flex md:justify-start">
          {{ format.toDay(item.voting_end_time, 'from') }}
        </div>
      </div>
      <ProposalProcess :pool="staking.pool" :tally="item.final_tally_result"></ProposalProcess>
    </RouterLink>
  </div>
</template>
