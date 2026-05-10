<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDashboard, useBlockchain } from '@/stores';
import type { ChainConfig } from '@/types/chaindata';
import { buildKeplrChainInfo } from '@/libs/keplr';
import AdBanner from '@/components/ad/AdBanner.vue';

const error = ref('');
const conf = ref('');
const dashboard = useDashboard();
const selected = ref({} as ChainConfig);

onMounted(() => {
  const chainStore = useBlockchain();
  selected.value = chainStore.current || Object.values(dashboard.chains)[0];
  initParamsForKeplr();
});

async function initParamsForKeplr() {
  const info = await buildKeplrChainInfo(selected.value);
  conf.value = JSON.stringify(info, null, '\t');
}

function suggest() {
  // @ts-ignore
  if (window.keplr) {
    // @ts-ignore
    window.keplr.experimentalSuggestChain(JSON.parse(conf.value)).catch((e) => {
      error.value = e;
    });
  }
}
</script>

<template>
  <div class="bg-base-100 p-4 rounded text-center">
    <AdBanner id="keplr-banner-ad" unit="banner" width="970px" height="90px" />
    <div class="flex">
      <select v-model="selected" class="select select-bordered mx-5" @change="initParamsForKeplr">
        <option v-for="c in dashboard.chains" :value="c">
          {{ c.chainName }}
        </option>
      </select>
      <button class="btn !bg-yes !border-yes text-white px-10" @click="suggest">
        Add {{ selected.chainName }} TO Keplr Wallet
      </button>
    </div>
    <div class="text-main mt-5">
      <textarea v-model="conf" class="textarea textarea-bordered w-full" rows="15"></textarea>
    </div>
    <div class="mt-4 mb-4">
      If the chain is not offically support on Keplr, you can submit these parameters to enable Keplr.
    </div>
  </div>
</template>
