<script lang="ts" setup>
import {
  useBlockchain,
  useFormatter,
  useStakingStore,
  useWalletStore,
  useTxDialog
} from '@/stores';
import { select } from '@/components/dynamic/index';
import type { PaginatedProposals } from '@/types';
import ProposalProcess from './ProposalProcess.vue';
import type { PropType } from 'vue';
import { ref } from 'vue';
const dialog = useTxDialog();
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
const voterStatusMap: Record<string, string> = {
  No_With_Veto: '',
  VOTE_OPTION_YES: 'success',
  VOTE_OPTION_NO: 'error',
  VOTE_OPTION_ABSTAIN: 'warning',
};

const proposalInfo = ref();
</script>
<template>
  <div class="bg-white dark:bg-[#28334e] rounded text-sm">
    <table class="table-compact w-full table-fixed hidden lg:!table">
      <tbody>
        <tr v-for="(item, index) in proposals?.proposals" :key="index">
          <td class="px-4 w-20">
            <label
              for="proposal-detail-modal"
              class="text-main text-base hover:text-indigo-400 cursor-pointer"
              @click="proposalInfo = item"
            >
              #{{ item?.proposal_id }}</label
            >
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
                class="truncate col-span-2 md:!col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right md:!flex md:!justify-start"
              >
                {{ format.toDay(item.voting_end_time, 'from') }}
              </div>
            </div>
          </td>

          <td v-if="statusMap?.[item?.status] === 'VOTING'">
            <div class="" v-show="item?.voterStatus === 'No With Veto'">
              <label
                for="vote"
                class="btn btn-xs btn-primary rounded-sm"
                @click="dialog.open('vote', { proposal_id: item?.proposal_id })"
                >Vote</label
              >
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit"
                :class="`text-${voterStatusMap?.[item?.voterStatus]}`"
                v-show="item?.voterStatus !== 'No With Veto'"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute"
                  :class="`bg-${voterStatusMap?.[item?.voterStatus]}`"
                ></span>
                {{ item?.voterStatus }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="lg:!hidden">
      <div
        v-for="(item, index) in proposals?.proposals"
        :key="index"
        class="px-4 py-4"
      >
        <div
          class="text-main text-base mb-1 flex justify-between hover:text-indigo-400"
        >
          <RouterLink
            :to="`/${chain.chainName}/gov/${item?.proposal_id}`"
            class="flex-1 w-0 truncate mr-4"
            >{{ item?.content?.title }}</RouterLink
          >
          <label
            for="proposal-detail-modal"
            class="text-main text-base hover:text-indigo-400 cursor-pointer"
            @click="proposalInfo = item"
          >
            #{{ item?.proposal_id }}</label
          >
        </div>

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

        <div class="mt-4" v-if="statusMap?.[item?.status] === 'VOTING'">
          <div class="" v-show="item?.voterStatus === 'No With Veto'">
              <label
                for="vote"
                class="btn btn-xs btn-primary rounded-sm"
                @click="dialog.open('vote', { proposal_id: item?.proposal_id })"
                >Vote</label
              >
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit"
                :class="`text-${voterStatusMap?.[item?.voterStatus]}`"
                v-show="item?.voterStatus !== 'No With Veto'"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute"
                  :class="`bg-${voterStatusMap?.[item?.voterStatus]}`"
                ></span>
                {{ item?.voterStatus }}
              </div>
            </div>
        </div>
      </div>
    </div>

    <input type="checkbox" id="proposal-detail-modal" class="modal-toggle" />
    <label for="proposal-detail-modal" class="modal sm:!modal-middle">
      <label class="modal-box relative" for="">
        <label
          for="proposal-detail-modal"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
        <h3 class="font-bold text-lg">Description</h3>
        <p class="py-4">
          <Component
            v-if="proposalInfo?.content?.description"
            :is="select(proposalInfo?.content?.description, 'horizontal')"
            :value="proposalInfo?.content?.description"
          ></Component>
        </p>
      </label>
    </label>
  </div>
</template>
