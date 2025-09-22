<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useBlockchain, useFormatter } from '@/stores';
import {
  PageRequest,
  type Pagination,
  type Coin,
  type DenomMetadata,
} from '@/types';
import { onMounted } from 'vue';
import type { Asset } from '@/types/chaindata';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain();

const list = ref([] as { denom: string; amount: string; base: string; info: string; logo: string | undefined }[]);

const pageRequest = ref(new PageRequest());
const pageResponse = ref({} as Pagination);

interface SupplyAsset extends Asset {
  logo: string | undefined;
}

onMounted(() => {
  pageload(1);
});

function findGlobalAssetConfig(denom: string) {
  const assets = chainStore.current?.assets;
  if (assets) {
    const conf = assets.find((a) => a.base === denom);
    if (conf) {
      return conf;
    }
  }
  return undefined;
}

async function mergeDenomMetadata(denom: string, denomsMetadatas: DenomMetadata[]): Promise<SupplyAsset> {
  const denomMetadata = denomsMetadatas.find((d) => d.base.endsWith(denom));
  let asset = findGlobalAssetConfig(denom) as SupplyAsset;
  if (asset && denomMetadata) {
    asset = { ...denomMetadata, ...asset };
    asset.display = denomMetadata.display;
    asset.logo = asset.logo_URIs?.svg || asset.logo_URIs?.png || undefined;
  } else if (denomMetadata) {
    return denomMetadata as SupplyAsset;
  }
  return asset;
}

function pageload(p: number) {
  pageRequest.value.setPage(p);
  chainStore.rpc.getBankDenomMetadata().then(async (denomsMetaResponse) => {
    const bankSupplyResponse = await chainStore.rpc.getBankSupply(pageRequest.value);
    list.value = await Promise.all(
      bankSupplyResponse.supply.map(async (coin: Coin) => {
        const asset = await mergeDenomMetadata(coin.denom, denomsMetaResponse.metadatas);
        const denom = asset?.symbol || coin.denom;
        return {
          denom: denom.split('/')[denom.split('/').length - 1].toUpperCase(),
          amount: format.tokenAmountNumber({ amount: coin.amount, denom: denom }).toString(),
          base: asset.base || coin.denom,
          info: asset.display || coin.denom,
          logo: asset?.logo_URIs?.svg || asset?.logo_URIs?.png || '/logo.svg',
        };
      })
    );
    pageResponse.value = bankSupplyResponse.pagination;
  });
}
</script>
<template>
  <div class="overflow-auto bg-base-100">
    <table class="table table-compact">
      <thead class="bg-base-200">
        <tr>
          <td>Logo</td>
          <td>Token</td>
          <td>Amount</td>
          <td>Info</td>
          <td>Base</td>
        </tr>
      </thead>
      <tr v-for="item in list" class="hover">
        <td>
          <img v-if="item.logo" :src="item.logo" class="w-7 h-7" />
        </td>
        <td>{{ item.denom }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.info }}</td>
        <td>{{ item.base }}</td>
      </tr>
    </table>
    <PaginationBar
      :limit="pageRequest.limit"
      :total="pageResponse.total"
      :callback="pageload"
    />
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'supply',
        order: 17
      }
    }
  </route>
