<script lang="ts" setup>
import { useGovStore } from '@/stores';
import ProposalListItem from '@/components/ProposalListItem.vue';
import { ref, onMounted } from 'vue';
const tab = ref('2');
const store = useGovStore();

onMounted(() => {
  store.fetchProposals('2');
});

const changeTab = (val: '2' | '3' | '4') => {
  tab.value = val;
  store.fetchProposals(val);
};
</script>
<template>
  <div class="tabs tabs-boxed bg-transparent mb-4">
    <a
      class="tab text-gray-400 uppercase"
      :class="{ 'tab-active': tab === '2' }"
      @click="changeTab('2')"
      >Voting</a
    >
    <a
      class="tab text-gray-400 uppercase"
      :class="{ 'tab-active': tab === '3' }"
      @click="changeTab('3')"
      >Passed</a
    >
    <a
      class="tab text-gray-400 uppercase"
      :class="{ 'tab-active': tab === '4' }"
      @click="changeTab('4')"
      >Rejected</a
    >
  </div>
  <ProposalListItem :proposals="store?.proposals[tab]" />
</template>
<route>
  {
    meta: {
      i18n: 'governance'
    }
  }
</route>
