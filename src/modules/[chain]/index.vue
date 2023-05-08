<script lang="ts" setup>
import MdEditor from 'md-editor-v3';
import PriceMarketChart from '@/components/charts/PriceMarketChart.vue';

import { Icon } from '@iconify/vue';
import { useBlockchain, useFormatter } from '@/stores';
import { onMounted, ref } from 'vue';
import { useIndexModule } from './indexStore';
import { computed } from '@vue/reactivity';

import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
import ProposalListItem from '@/components/ProposalListItem.vue';

const blockchain = useBlockchain();
const store = useIndexModule();

const coinInfo = computed(() => {
  return store.coinInfo;
});

onMounted(() => {
  store.loadDashboard();
});

const format = useFormatter();
const ticker = computed(() => store.coinInfo.tickers[store.tickerIndex]);

blockchain.$subscribe((m, s) => {
  if (
    !Array.isArray(m.events) &&
    ['chainName', 'endpoint'].includes(m.events.key)
  ) {
    store.loadDashboard();
  }
});
function shortName(name: string, id: string) {
  return name.toLowerCase().startsWith('ibc/') ||
    name.toLowerCase().startsWith('0x')
    ? id
    : name;
}

const comLinks = [
  {
    name: 'Website',
    icon: 'mdi-web',
    href: store.homepage,
  },
  {
    name: 'Twitter',
    icon: 'mdi-twitter',
    href: store.twitter,
  },
  {
    name: 'Telegram',
    icon: 'mdi-telegram',
    href: store.telegram,
  },
  {
    name: 'Github',
    icon: 'mdi-github',
    href: store.github,
  },
];
</script>

<template>
  <div>
    <VCard v-if="coinInfo && coinInfo.name" class="mb-5">
      <VRow>
        <VCol md="5">
          <VCardItem>
            <VCardTitle>
              {{ coinInfo.name }} (<span class="uppercase">{{
                coinInfo.symbol
              }}</span
              >)
            </VCardTitle>
            <VCardSubtitle>
              Rank:
              <div
                class="badge text-xs badge-error bg-[#fcebea] dark:bg-[#41384d] text-red-400"
              >
                #{{ coinInfo.market_cap_rank }}
              </div>
            </VCardSubtitle>
          </VCardItem>
          <div class="h-[1px] w-full bg-gray-100 dark:bg-[#384059]"></div>
          <div class="mt-4 pl-4 flex items-center">
            <a
              v-for="(item, index) of comLinks"
              :key="index"
              :href="item.href"
              class="link link-primary px-2 py-1 rounded-sm no-underline hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center"
            >
              <Icon :icon="item?.icon" />
              <span class="ml-1 text-sm uppercase">{{ item?.name }}</span>
            </a>
          </div>
          <VCardItem>
            <!-- SECTION upgrade plan banner -->
            <div
              class="plan-upgrade-banner d-flex bg-light-secondary rounded align-center pa-3"
            >
              <h3 class="plan-details me-3" :class="store.priceColor">
                {{ store.priceChange }}
                <small>%</small>
              </h3>

              <VMenu open-on-hover>
                <template #activator="{ props }">
                  <div class="d-flex flex-column align-start" v-bind="props">
                    <h3 class="text-base font-weight-semibold">
                      {{ ticker?.market?.name || '' }}
                    </h3>
                    <span class="text-primary text-xs">
                      {{ shortName(ticker?.base, ticker.coin_id) }}/{{
                        shortName(ticker?.target, ticker.target_coin_id)
                      }}
                    </span>
                  </div>
                </template>
                <VList style="max-height: 300px">
                  <VListItem
                    v-for="(item, i) in store.coinInfo.tickers"
                    :key="i"
                    rounded
                    @click="store.selectTicker(i)"
                  >
                    <template #prepend></template>
                    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                    <VListItemTitle v-text="item.market.name" />
                    <VListItemSubtitle>
                      {{ shortName(item?.base, item.coin_id) }}/{{
                        shortName(item?.target, item.target_coin_id)
                      }}
                    </VListItemSubtitle>
                    <template #append>
                      <span
                        class="ml-3"
                        :class="`text-${store.tickerColor(item.trust_score)}`"
                      >
                        {{ item.converted_last.usd }}
                      </span>
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
            <VSpacer />
            <a
              :color="store.trustColor"
              class="mt-5 text-white btn btn-success w-full flex items-center"
              :href="ticker.trade_url"
              target="_blank"
            >
              Buy {{ coinInfo.symbol || '' }}
            </a>
          </VCardItem>
        </VCol>
        <VCol md="7">
          <VCardItem>
            <PriceMarketChart />
          </VCardItem>
        </VCol>
      </VRow>
      <div class="h-[1px] w-full bg-gray-100 dark:bg-[#384059]"></div>
      <div class="max-h-[250px] overflow-auto p-4 text-sm">
        <MdEditor
          :model-value="coinInfo.description?.en"
          previewOnly
        ></MdEditor>
      </div>
      <div class="mx-4 flex flex-wrap items-center">
        <div
          v-for="tag in coinInfo.categories"
          class="mr-2 mb-4 text-xs bg-gray-100 dark:bg-[#384059] px-3 rounded-full py-1"
        >
          {{ tag }}
        </div>
      </div>
    </VCard>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <div v-for="item in store.stats">
        <CardStatisticsVertical v-bind="item" />
      </div>
    </div>

    <div class="bg-base-100 rounded mt-4 shadow">
      <div class="px-4 pt-4 pb-2 text-lg font-semibold text-secondary">
        Active Proposals
      </div>
      <div class="px-4 pb-4">
        <ProposalListItem :proposals="store?.proposals" />
      </div>
      <div class="pl-4 pb-8 py-4" v-if="store.proposals?.length === 0">
        No active proposals
      </div>
    </div>

    <div
      class="btn btn-primary w-full mt-5 flex items-center bg-transparent text-primary hover:bg-gray-100 hover:bg-transparent"
    >
      Connect Wallet
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-box {
  border: 1px solid rgb(var(--v-theme-primary));
}
</style>

<route>
  {
    meta: {
      i18n: 'dashboard'
    }
  }
</route>
