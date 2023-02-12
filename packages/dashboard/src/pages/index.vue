<script lang="ts" setup>
import { useDashboard, LoadingStatus } from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';

const dashboard = useDashboard()

dashboard.$subscribe((mutation, state) => {
  localStorage.setItem('favorite', JSON.stringify(state.favorite))
})
</script>
<template>
  <div class="d-flex flex-column align-center">
    <div class="d-flex justify-center align-center align-self-center p-1 b1">
      <VImg src="/logo.svg" width="85" height="85"/>
      <h1 class="text-primary text-h3 font-weight-bold d-none d-md-block ml-1">
        Ping Dashboard<VChip>Beta</VChip>
      </h1>
    </div>

    <p class="mb-1">
      Ping Dashboard is not just an explorer but also a wallet and more ... 🛠
    </p>
    <h2 class="mb-9">
      Cosmos Ecosystem Blockchains 🚀
    </h2>
    <VProgressLinear v-if="dashboard.status !== LoadingStatus.Loaded " indeterminate color="primary darken-2"/>
    <VRow>
      <VCol v-for="k in dashboard.chains" md="3">
        <VLazy min-height="40" min-width="200" transition="fade-transition">
          <ChainSummary :name="k.chain_name" />
        </VLazy>
      </VCol>    
    </VRow>
  </div>
</template>
