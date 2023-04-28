<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface TabItem{
  tabName: string
  id: number
  value: string
}

const tab = ref('');
const tabList: Array<TabItem> = [
  { tabName: 'Group By Validator', id: 1, value: 'validator' },
  { tabName: 'Group By Proposer', id: 2, value: 'proposer' },
  ]

function clickTab(item: TabItem) {
  // toggle tab  and stop another tab fetch
  console.log(tab, 'tab')
}
</script>

<template>
  <div class="">
    <VTabs v-model="tab" class="v-tabs-pill">
      <VTab 
        v-for="(item, index) in tabList" 
        :key="index" 
        :value="item.value"
        @click="clickTab(item)"
      >{{ item.tabName }}</VTab>
    </VTabs>
    <VWindow v-model="tab" class="mt-5">
      <VWindowItem v-for="(item, index) in tabList" :key="index" :value="item.value">
        <!-- <ProposalListItem :proposals="store?.proposals['2']" /> -->
       
        <VCard> {{item.tabName}}</VCard>
      </VWindowItem>
    </VWindow>
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'uptime'
    }
  }
</route>
