<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';
import type { Coin, Delegation } from '@/types';
import { ref } from 'vue';
import { scanLocalKeys, type AccountEntry } from './utils';
import { fromBech32, toBase64 } from '@cosmjs/encoding';
import { computed } from 'vue';
import { useFormatter } from '@/stores';
import DonutChart from '@/components/charts/DonutChart.vue';

const format = useFormatter();
const conf = ref(
  JSON.parse(localStorage.getItem('imported-addresses') || '{}') as Record<
    string,
    AccountEntry[]
  >
);
const balances = ref({} as Record<string, Coin[]>);
const delegations = ref({} as Record<string, Delegation[]>);
const tokenMeta = ref({} as Record<string, AccountEntry>);

scanLocalKeys().forEach((wallet) => {
  const { data } = fromBech32(wallet.cosmosAddress);
  const walletKey = toBase64(data);
  let imported = conf.value[walletKey];

  // load balance & delegations
  if (imported)
    imported.forEach((x) => {
      if (x.endpoint) {
        const client = CosmosRestClient.newDefault(x.endpoint);
        client.getBankBalances(x.address).then((res) => {
          const bal = res.balances.filter((x) => x.denom.length < 10);
          balances.value[x.address] = bal;
          bal.forEach((b) => {
            tokenMeta.value[b.denom] = x;
          });
        });
        client.getStakingDelegations(x.address).then((res) => {
          delegations.value[x.address] = res.delegation_responses;
          res.delegation_responses.forEach((del) => {
            tokenMeta.value[del.balance.denom] = x;
          });
        });
      }
    });
});

const tokenValues = computed(() => {
  const values = {} as Record<string, number>;
  Object.values(balances.value).forEach((b) => {
    b.forEach((coin) => {
      const v = format.tokenValueNumber(coin);
      if (v) {
        if (values[coin.denom]) {
          values[coin.denom] += v;
        } else {
          values[coin.denom] = v;
        }
      }
    });
  });
  Object.values(delegations.value).forEach((b) => {
    b.forEach((d) => {
      const v = format.tokenValueNumber(d.balance);
      if (v) {
        if (values[d.balance.denom]) {
          values[d.balance.denom] += v;
        } else {
          values[d.balance.denom] = v;
        }
      }
    });
  });
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
</script>
<template>
  <div class="overflow-x-auto w-full card">
    <div class="lg:!flex lg:!items-center lg:!justify-between bg-base-100 p-5">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight"
        >
          Portfolio
        </h2>
        <div
          class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6"
        >
          <div class="mt-2 flex items-center text-sm text-gray-500">
            <svg
              class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                clip-rule="evenodd"
              />
              <path
                d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z"
              />
            </svg>
            Manage all your assets in one page {{ totalValue }}
          </div>
        </div>
      </div>
      <div class="mt-5 flex lg:!ml-4 lg:!mt-0"></div>
    </div>
    <div class="bg-base-100">
      <DonutChart
        :series="Object.values(tokenValues)"
        :labels="Object.keys(tokenValues)"
      />
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Token</th>
              <th class="text-right">Value</th>
              <th class="text-right">Percent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(x, index) in tokenList" :key="index">
              <td class="capitalize">
                <div class="flex">
                  <div class="avatar">
                    <div class="mask mask-squircle w-6 h-6 mr-2">
                      <img :src="x.logo" :alt="x.chainName" />
                    </div>
                  </div>
                  {{ x.chainName }}
                </div>
              </td>
              <td class="text-right">${{ format.formatNumber(x.value) }}</td>
              <td class="text-right">{{ format.percent(x.percentage) }}</td>
            </tr>
          </tbody>
        </table>
        
      </div>
      <div class="p-4 text-center" v-show="tokenList?.length ===0">
        No Data
      </div>
    </div>
  </div>
</template>
