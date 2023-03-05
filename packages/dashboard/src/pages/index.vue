<script lang="ts" setup>
import { useDashboard, LoadingStatus, type ChainConfig } from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';
import { computed, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard()

dashboard.$subscribe((mutation, state) => {
  localStorage.setItem('favorite', JSON.stringify(state.favorite))
})
const keywords = ref('')
const chains = computed(()=> {
  if(keywords.value) {
    return Object.values(dashboard.chains).filter( (x: ChainConfig)=>x.chainName.indexOf(keywords.value) > -1)
  }else{
    return Object.values(dashboard.chains)
  }
})
const chain = useBlockchain()
</script>
<template>
  <div class="d-flex flex-column justify-center">
    <div class="d-flex justify-center align-center align-self-center p-1 b1">
      <VImg src="/logo.svg" width="85" height="85"/>
      <h1 class="text-primary text-h3 font-weight-bold d-none d-md-block ml-1">
        Ping Dashboard<VChip>Beta</VChip>
      </h1>
    </div>
    <div class="d-flex flex-column align-center">
      <p class="mb-1">
        {{ $t('index.slogan') }}
      </p>
      <h2 class="mb-9">
        Cosmos Ecosystem Blockchains 🚀
      </h2>
    </div>
    <VProgressLinear v-if="dashboard.status !== LoadingStatus.Loaded " indeterminate color="primary darken-2"/>
    <VTextField v-model="keywords" variant="underlined" :placeholder="$t('index.search_placeholder')" style="max-width: 300px;" app>
      <template #append-inner>
        {{ chains.length }}/{{ dashboard.length }}
      </template>
    </VTextField>
    <VRow class="my-auto">
      <VCol v-for="k in chains" md="3">
        <VLazy min-height="40" min-width="200" transition="fade-transition">
          <ChainSummary :name="k.chainName" />
        </VLazy>
      </VCol>    
    </VRow>
  </div>
</template>
