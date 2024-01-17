<script lang="ts" setup>
import { useGovStore } from '@/stores';
import ProposalListItem from '@/components/ProposalListItem.vue';
import { ref, onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
import { PageRequest } from '@/types';
import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

const tab = ref(ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD);
const store = useGovStore();
const pageRequest = ref(new PageRequest());

onMounted(() => {
  store
    .fetchProposals(ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD)
    .then((x) => {
      if (x?.proposals.length === 0) {
        tab.value = ProposalStatus.PROPOSAL_STATUS_PASSED;
        store.fetchProposals(ProposalStatus.PROPOSAL_STATUS_PASSED);
      }
      store.fetchProposals(ProposalStatus.PROPOSAL_STATUS_PASSED);
      store.fetchProposals(ProposalStatus.PROPOSAL_STATUS_REJECTED);
    });
});

const changeTab = (
  val:
    | ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
    | ProposalStatus.PROPOSAL_STATUS_PASSED
    | ProposalStatus.PROPOSAL_STATUS_REJECTED
) => {
  tab.value = val;
};

function page(p: number) {
  pageRequest.value.setPage(p);
  store.fetchProposals(tab.value, pageRequest.value);
}
</script>
<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4 text-center">
      <a
        class="tab text-gray-400 uppercase"
        :class="{
          'tab-active': tab === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD,
        }"
        @click="changeTab(ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD)"
        >{{ $t('gov.voting') }}</a
      >
      <a
        class="tab text-gray-400 uppercase"
        :class="{ 'tab-active': tab === ProposalStatus.PROPOSAL_STATUS_PASSED }"
        @click="changeTab(ProposalStatus.PROPOSAL_STATUS_PASSED)"
        >{{ $t('gov.passed') }}</a
      >
      <a
        class="tab text-gray-400 uppercase"
        :class="{
          'tab-active': tab === ProposalStatus.PROPOSAL_STATUS_REJECTED,
        }"
        @click="changeTab(ProposalStatus.PROPOSAL_STATUS_REJECTED)"
        >{{ $t('gov.rejected') }}</a
      >
    </div>
    <ProposalListItem :proposals="store?.proposals[tab]" />
    <PaginationBar
      :total="store?.proposals[tab]?.pagination?.total.toString()"
      :limit="pageRequest.limit"
      :callback="page"
    />
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'governance',
      order: 2
    }
  }
</route>
