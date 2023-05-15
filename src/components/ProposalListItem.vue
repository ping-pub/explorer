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
    <table class="table-compact w-full table-fixed hidden lg:table">
      <tbody>
        <tr v-for="(item, index) in proposals?.proposals" :key="index">
          <td class="px-4 w-20">
            <RouterLink
              class="text-main text-base hover:text-indigo-400"
              :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
            >
              #{{ item?.proposal_id }}
            </RouterLink>
          </td>
          <td class="w-[35%]">
            <div>
              <RouterLink
                :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
                class="text-main text-base mb-1 block hover:text-indigo-400 truncate"
              >
                {{ item?.content?.title }}
              </RouterLink>
              <div
                class="bg-[#f6f2ff] text-[#9c6cff] dark:bg-gray-600 dark:text-gray-300 inline-block rounded-full px-2 py-[1px] text-xs mb-1"
              >
                {{ showType(item.content['@type']) }}
              </div>
            </div>
          </td>
          <td class="w-[25%]">
            <ProposalProcess
              :pool="staking.pool"
              :tally="item.final_tally_result"
            ></ProposalProcess>
          </td>
          <td>
            <div class="pl-4">
              <div
                class="flex items-center"
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
                <div class="text-xs">
                  {{ statusMap?.[item?.status] || item?.status }}
                </div>
              </div>
              <div
                class="truncate col-span-2 md:col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right md:flex md:justify-start"
              >
                {{ format.toDay(item.voting_end_time, 'from') }}
              </div>
            </div>
          </td>

          <td>
            <div>
              <button class="btn btn-xs btn-primary rounded-sm mr-3">
                Detail
              </button>
              <button class="btn btn-xs btn-primary rounded-sm">Vote</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="lg:hidden">
      <div
        v-for="(item, index) in proposals?.proposals"
        :key="index"
        class="px-4 py-4"
      >
        <RouterLink
          :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
          class="text-main text-base mb-1 flex justify-between hover:text-indigo-400 truncate"
        >
          <div>{{ item?.content?.title }}</div>

          <div>#{{ item?.proposal_id }}</div>
        </RouterLink>

        <div class="grid grid-cols-4 mt-2 mb-2">
          <div class="col-span-2">
            <div
              class="bg-[#f6f2ff] text-[#9c6cff] dark:bg-gray-600 dark:text-gray-300 inline-block rounded-full px-2 py-[1px] text-xs mb-1"
            >
              {{ showType(item.content['@type']) }}
            </div>
          </div>
          <div
            class="flex items-center"
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
            <div class="text-xs flex items-center">
              {{ statusMap?.[item?.status] || item?.status }}
            </div>
          </div>
          <div
            class="truncate text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end"
          >
            {{ format.toDay(item.voting_end_time, 'from') }}
          </div>
        </div>

        <div>
          <ProposalProcess
            :pool="staking.pool"
            :tally="item.final_tally_result"
          ></ProposalProcess>
        </div>

        <div class="mt-4">
          <button class="btn btn-xs btn-primary rounded-sm mr-3 px-4">
            Detail
          </button>
          <button class="btn btn-xs btn-primary rounded-sm px-4">Vote</button>
        </div>
      </div>
    </div>
  </div>
</template>
