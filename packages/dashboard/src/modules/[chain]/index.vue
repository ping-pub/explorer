<script lang="ts" setup>
import MdEditor from 'md-editor-v3';
import PriceMarketChart from '@/components/charts/PriceMarketChart.vue'

import { useCoingecko, useBlockchain, useBankStore, useFormatter } from '@/stores';
import { onMounted, ref } from 'vue';
import { useIndexModule } from './indexStore';
import { computed } from '@vue/reactivity';

import CardStatisticsHorizontal from '@/components/CardStatisticsHorizontal.vue';
import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
import { useBaseStore } from '@/stores';

const blockchain = useBlockchain()
const store = useIndexModule()

const coinInfo = computed(() => {
  return store.coinInfo
})

onMounted(() => {
  store.loadDashboard()
})

const format = useFormatter()
const ticker = computed(() => store.coinInfo.tickers[store.tickerIndex])
const desc = ref('')

store.$subscribe((m, s) => {
  desc.value = s.coinInfo.description?.en || ''
})
blockchain.$subscribe((m, s) => {
  if(m.events.key === 'rest') {
    store.loadDashboard()
  }
})
function shortName(name: string, id: string) {
  return name.toLowerCase().startsWith('ibc/') || name.toLowerCase().startsWith('0x') ? id: name
}

</script>

<template>
  <div>
    <VCard v-if="coinInfo && coinInfo.name">
      <VRow>
        <VCol md="4">
          <VCardTitle>
            {{ coinInfo.name }} (<span class="text-uppercase">{{ coinInfo.symbol }}</span>)
          </VCardTitle>
          <VCardSubtitle>
            Rank:  <VChip color="warning" size="x-small">#{{ coinInfo.market_cap_rank }}</VChip>
          </VCardSubtitle>
          <VDivider class="mt-2" />
          <VCardItem>              
            <VBtn variant="text" size="small" :href="store.homepage" prependIcon="mdi-web">Website</VBtn> 
            <VBtn variant="text" size="small" :href="store.twitter" prependIcon="mdi-twitter">Twitter</VBtn>
            <VBtn variant="text" size="small" :href="store.telegram" prependIcon="mdi-telegram">Telegram</VBtn>
            <VBtn variant="text" size="small" :href="store.github" prependIcon="mdi-github">Github</VBtn>
          </VCardItem>
          <VCardItem>
            <!-- SECTION upgrade plan banner -->
            <div class="plan-upgrade-banner d-flex bg-light-secondary rounded align-center pa-3">
              <h3
                class="plan-details me-3"
                :class="store.priceColor"
              >
                {{ store.priceChange }}<small>%</small>
              </h3>
              
              <VMenu open-on-hover>
                <template #activator="{ props }">
                  <div class="d-flex flex-column align-start" v-bind="props">
                    <h3 class="text-base font-weight-semibold">
                      {{ ticker?.market?.name || ''}}
                    </h3>
                    <span class="text-primary text-xs">{{ shortName(ticker?.base, ticker.coin_id) }}/{{ shortName(ticker?.target, ticker.target_coin_id) }}</span>
                  </div>
                </template>
                <VList style="max-height: 300px;">
                  <VListItem
                    v-for="(item, i) in store.coinInfo.tickers"
                    :key="i"
                    rounded
                    @click="store.selectTicker(i)"
                  >
                    <template #prepend>
                    </template>
                    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                    <VListItemTitle v-text="item.market.name" />
                    <VListItemSubtitle>{{ shortName(item?.base, item.coin_id) }}/{{ shortName(item?.target, item.target_coin_id) }}</VListItemSubtitle>
                    <template #append>
                      <span class="ml-3" :class="`text-${store.tickerColor(item.trust_score)}`">{{ item.converted_last.usd }}</span>
                    </template>
                  </VListItem>
                </VList>
              </VMenu>


              <VSpacer />

              <div class="d-flex align-center">
                <sub>
                  <h6 class="text-xs font-weight-regular">$</h6>
                </sub>
                <span class="text-h5">{{ ticker.converted_last.usd }}</span>
              </div>
            </div>
            <!-- !SECTION -->
            <VSpacer />
          <VBtn
            block
            :color="store.trustColor"
            class="mt-3"
            :href="ticker.trade_url"
          >
            Buy {{ coinInfo.symbol || '' }}
          </VBtn>
          </VCardItem>
        </VCol>
        <VCol md="8">
          <VCardItem>
            <PriceMarketChart />
          </VCardItem>
        </VCol>
      </VRow>
      <VDivider />
      <VCardText style="max-height: 250px; overflow:scroll;"><MdEditor v-model="desc" previewOnly></MdEditor></VCardText>
      <VCardItem>
        <VChip v-for="tag in coinInfo.categories" size="x-small">{{ tag }}</VChip>
      </VCardItem>
    </VCard>

    <VRow class="mt-5">
      <VCol v-for="item in store.stats" cols="12" sm="6" md="2">
        <VCard>
          <CardStatisticsVertical v-bind="item" />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
<style>
#chart {
  max-width: 260px;
  margin: 35px auto;
  opacity: 0.9;
}

</style>