<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';
import type { Coin, Delegation } from '@/types';
import { ref, watchEffect } from 'vue';
import type { AccountEntry } from './utils';
import { computed } from 'vue';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DonutChart from '@/components/charts/DonutChart.vue';
import ApexCharts from 'vue3-apexcharts';
import { get } from '@/libs';
import { getMarketPriceChartConfig } from '@/components/charts/apexChartConfig';
import AdBanner from '@/components/ad/AdBanner.vue';

const format = useFormatter();
const conf = ref(
  JSON.parse(localStorage.getItem('imported-addresses') || '{}') as Record<
    string,
    AccountEntry[]
  >
);
const chainStore = useBlockchain();
const balances = ref({} as Record<string, Coin[]>);
const delegations = ref({} as Record<string, Delegation[]>);
const tokenMeta = ref({} as Record<string, AccountEntry>);

const priceloading = ref(false)
const currency = ref(localStorage.getItem('currency') || 'usd')

const prices = ref([] as {
  id: string,
  symbol: string,
  name: string,
  image: string,
  current_price: number,
  market_cap: number,
  market_cap_rank: number,
  fully_diluted_valuation: number,
  total_volume: number, high_24h: number,
  low_24h: number,
  price_change_24h: number, price_change_percentage_24h: number, market_cap_change_24h: number,
  market_cap_change_percentage_24h: number,
  circulating_supply: number, total_supply: number,
  max_supply: number,
  ath: number,
  ath_change_percentage: number,
  ath_date: string,
  atl: string,
  atl_change_percentage: number,
  atl_date: string, roi: string, last_updated: string,
  sparkline_in_7d: { prices: number[] }
}[])

const loading = ref(0)
const loaded = ref(0)
watchEffect(() => {
  if (loading.value > 0 && loading.value === loaded.value) {
    if (!priceloading.value) {
      priceloading.value = true
      loadPrice()
    }
  }
})

Object.values(conf.value).forEach((imported) => {
  if (imported)
    imported.forEach((x) => {
      if (x.endpoint && x.address) {
        loading.value += 1
        const endpoint = chainStore.randomEndpoint(x.chainName)
        const client = CosmosRestClient.newDefault(endpoint?.address || x.endpoint);
        client.getBankBalances(x.address).then((res) => {
          const bal = res.balances.filter((x) => x.denom.length < 10);
          if (bal) balances.value[x.address || ""] = bal;
          bal.forEach((b) => {
            tokenMeta.value[b.denom] = x;
          });
        }).finally(() => {
          loaded.value += 1
        });
        client.getStakingDelegations(x.address).then((res) => {
          if (res && res.delegation_responses) delegations.value[x.address || ""] = res.delegation_responses;
          res.delegation_responses.forEach((del) => {
            tokenMeta.value[del.balance.denom] = x;
          });
        });
      }
    });
});

const tokenQty = computed(() => {
  const values = {} as Record<string, { coinId: string, qty: number }>;
  Object.values(balances.value).forEach((b) => {
    b.forEach((coin) => {
      const v = format.tokenDisplayNumber(coin);
      if (v) {
        if (values[coin.denom]) {
          values[coin.denom].qty += v;
        } else {
          values[coin.denom] = { qty: v, coinId: format.findGlobalAssetConfig(coin.denom)?.coingecko_id || "" };
        }
      }
    });
  });
  Object.values(delegations.value).forEach((b) => {
    b.forEach((d) => {
      const v = format.tokenDisplayNumber(d.balance);
      if (v) {
        if (values[d.balance.denom]) {
          values[d.balance.denom].qty += v;
        } else {
          values[d.balance.denom] = { qty: v, coinId: format.findGlobalAssetConfig(d.balance.denom)?.coingecko_id || "" };
        }
      }
    });
  });
  return values;
});

const tokenValues = computed(() => {
  const values = {} as Record<string, number>;
  Object.keys(tokenQty.value).forEach(k => {
    const x = tokenQty.value[k]
    const marketData = prices.value.find((p: any) => p.id === x.coinId)
    values[k] = marketData? x.qty * marketData.current_price : 0
  })
  return values;
});

const totalValue = computed(() => {
  return Object.values(tokenValues.value).reduce((a, s) => a + s, 0);
});

const tokenList = computed(() => {
  const list = [] as {
    denom: string;
    value: number;
    logo: string;
    chainName: string;
    percentage: number;
  }[];
  Object.keys(tokenValues.value).map((x) => {
    list.push({
      denom: x,
      value: tokenValues.value[x],
      chainName: tokenMeta.value[x]?.chainName,
      logo: tokenMeta.value[x]?.logo,
      percentage: tokenValues.value[x] / totalValue.value,
    });
  });
  return list.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
});

function loadPrice() {
  localStorage.setItem('currency', currency.value)
  const ids = Object.values(tokenQty.value).map(x => x.coinId).join(',')
  get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.value}&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=14d&locale=en`)
    .then(res => {
      prices.value = res
    })
}
const totalChangeIn24 = computed(() => {
  return Object.values(tokenQty.value).map(x => {
    const marketData = prices.value.find((p: any) => p.id === x.coinId)
    if (marketData)
      return x.qty * (marketData.price_change_24h || 0)
    return 0
  }).reduce((s, c) => s + c, 0)
})
// Compute data for trend chart
const changeData = computed(() => {
  const vals = Object.keys(tokenQty.value).map(denom => {
    const token = tokenQty.value[denom]
    const marketData: any = prices.value.find((x) => x.id === token.coinId)
    if (marketData) {
      return marketData.sparkline_in_7d?.price.map((p: number) => p * token.qty) as number[]
    }
    return []
  }).filter(x => x.length > 0)

  const width = vals.at(0)?.length || 0
  const sum = new Array(width).fill(0)

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < vals.length; j++) {
      sum[i] += vals.at(j)?.at(i) || 0
    }
  }

  return [{ name: "value", data: sum }]
})

const baseStore = useBaseStore();
const chartConfig = computed(() => {
  const theme = baseStore.theme;
  const labels = [] as any[]
  const time = new Date().getTime()
  for (let i = 0; i < 168; i++) { // only works for 14d
    labels.unshift(time - i * 2 * 60 * 60 * 1000)
  }
  return getMarketPriceChartConfig(theme, labels);
});

const currencySign = computed(() => {
  switch(currency.value) {
    case 'usd': return '$'
    case 'cny': return '¥'
    case 'eur': return '€'
    case 'hkd': return 'HK$'
    case 'jpy': return '¥'
    case 'sdg': return 'S$'
    case 'krw': return '₩'
    case 'btc': return 'BTC'
    case 'eth': return 'ETH'
  }
  return '$'
})
</script>
<template>
  <div class="overflow-x-auto w-full rounded-md">

    <div class="flex flex-wrap justify-between bg-base-100 p-5">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight">
          Portfolio
        </h2>
        <div>
          <div class="flex items-center text-sm">
            Currency: <select v-model="currency" @change="loadPrice" class="ml-1 uppercase">
              <option>usd</option>
              <option>cny</option>
              <option>eur</option>
              <option>hkd</option>
              <option>jpy</option>
              <option>sgd</option>
              <option>krw</option>
              <option>btc</option>
              <option>eth</option>
            </select>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div>Total Value</div>
        <div class="text-success font-bold">{{ currencySign }} {{ format.formatNumber(totalValue, '0,0.[00]') }}</div>
        <div class="text-xs" :class="{ 'text-success': totalChangeIn24 > 0, 'text-error': totalChangeIn24 < 0 }">
          {{ format.formatNumber(totalChangeIn24, '+0,0.[00]') }}
        </div>
      </div>
    </div>
    <div class="bg-base-100">
      <div v-if="tokenList" class="grid grid-cols-1 md:grid-cols-3">
        <div>
          <DonutChart height="280" :series="Object.values(tokenValues)"
            :labels="Object.keys(tokenValues).map(x => format.tokenDisplayDenom(x)?.toUpperCase())" />
        </div>
        <div class="md:col-span-2">
          <ApexCharts type="area" height="280" :options="chartConfig" :series="changeData" />
        </div>
      </div>
      <div class="overflow-x-auto mt-4">
      <AdBanner class="bg-base-200" id="portfolio-banner-ad" unit="banner" width="970px" height="90px" />
        <table class="table w-full">
          <thead class="bg-base-200">
            <tr>
              <th>Token</th>
              <th class="text-right">Value</th>
              <th class="text-right">Percent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(x, index) in tokenList" :key="index">
              <td>
                <div class="flex gap-1 text-xs items-center">
                  <div class="avatar">
                    <div class="mask mask-squircle w-6 h-6 mr-2">
                      <img :src="x.logo" :alt="x.chainName" />
                    </div>
                  </div>
                  <span class="uppercase font-bold text-lg">{{ format.tokenDisplayDenom(x.denom) }}</span> @
                  <span class="capitalize ">{{ x.chainName }} </span>
                </div>
              </td>
              <td class="text-right">{{ currencySign }}{{ format.formatNumber(x.value, '0,0.[00]') }}</td>
              <td class="text-right">{{ format.percent(x.percentage) }}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="p-4 text-center" v-if="tokenList.length === 0">
        No Data
      </div>
    </div>
    <div class="text-center my-5 bg-base-200">
      <RouterLink to="./accounts" class="btn btn-link">Add More Asset</RouterLink>
    </div>
  </div>
</template>
