<script lang="ts" setup>
import { useGovStore } from '@/stores';
import ProposalListItem from '@/components/ProposalListItem.vue';
import { ref, onMounted } from 'vue';
const tab = ref('');
const store = useGovStore();

onMounted(() => {
  store.fetchProposals('2').then(x => {
    if(x.proposals.length ===0 ) {
      tab.value = "3"
      store.fetchProposals('3')
    }
  });
});
</script>
<template>
  <div>
    <VTabs v-model="tab" class="v-tabs-pill">
      <VTab value="2">Voting</VTab>
      <VTab value="3" @click="store.fetchProposals('3')">Passed</VTab>
      <VTab value="4" @click="store.fetchProposals('4')">Rejected</VTab>
    </VTabs>
    <VWindow v-model="tab" class="mt-5">
      <VWindowItem value="2">
        <ProposalListItem :proposals="store?.proposals['2']" />
      </VWindowItem>

      <VWindowItem value="3">
        <ProposalListItem :proposals="store?.proposals['3']" />
      </VWindowItem>

      <VWindowItem value="4">
        <ProposalListItem :proposals="store?.proposals['4']" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
<route>
    {
      meta: {
        i18n: 'governance'
      }
    }
  </route>
