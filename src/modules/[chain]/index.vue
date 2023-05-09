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
    <div
      v-if="coinInfo && coinInfo.name"
      class="bg-base-100 rounded shadow mb-4"
    >
      <div class="flex p-4">
        <div class="">
          <div class="text-xl font-semibold text-main">
            {{ coinInfo.name }} (<span class="uppercase">{{
              coinInfo.symbol
            }}</span
            >)
          </div>
          <div class="text-xs mt-2">
            Rank:
            <div
              class="badge text-xs badge-error bg-[#fcebea] dark:bg-[#41384d] text-red-400"
            >
              #{{ coinInfo.market_cap_rank }}
            </div>
          </div>

          <div class="mt-4 flex items-center">
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

          <div>
            <div
              class="dropdown dropdown-hover w-full md:w-[400px] mt-[16px] md:mt-[36px]"
            >
              <label>
                <div
                  class="bg-gray-100 dark:bg-[#384059] flex items-center justify-between px-4 py-2 cursor-pointer rounded"
                >
                  <div>
                    <div
                      class="font-semibold text-xl text-[#666] dark:text-white"
                    >
                      {{ ticker?.market?.name || '' }}
                    </div>
                    <div class="text-info text-sm">
                      {{ shortName(ticker?.base, ticker.coin_id) }}/{{
                        shortName(ticker?.target, ticker.target_coin_id)
                      }}
                    </div>
                  </div>

                  <div class="text-right">
                    <div
                      class="text-xl font-semibold text-[#666] dark:text-white"
                    >
                      ${{ ticker.converted_last.usd }}
                    </div>
                    <div class="text-sm" :class="store.priceColor">
                      {{ store.priceChange }}%
                    </div>
                  </div>
                </div>
              </label>
              <div class="dropdown-content pt-1">
                <div
                  class="h-64 overflow-auto w-full md:w-[400px] shadow rounded"
                >
                  <ul class="menu w-full bg-gray-100 rounded dark:bg-[#384059]">
                    <li
                      v-for="(item, index) in store.coinInfo.tickers"
                      :key="index"
                      @click="store.selectTicker(index)"
                    >
                      <div
                        class="flex items-center justify-between hover:bg-base-100"
                      >
                        <div class="flex-1">
                          <div class="text-main text-sm">
                            {{ item?.market?.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ shortName(item?.base, item.coin_id) }}/{{
                              shortName(item?.target, item.target_coin_id)
                            }}
                          </div>
                        </div>

                        <div class="text-base text-main">
                          ${{ item.converted_last.usd }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <a
              :color="store.trustColor"
              class="mt-5 text-white btn btn-success w-full md:w-[400px] flex items-center"
              :href="ticker.trade_url"
              target="_blank"
            >
              Buy {{ coinInfo.symbol || '' }}
            </a>
          </div>
        </div>

        <div class="flex-1 hidden md:block">
          <PriceMarketChart />
        </div>
      </div>
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
    </div>

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

<route>
  {
    meta: {
      i18n: 'dashboard'
    }
  }
</route>
