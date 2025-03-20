<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Pagination, type Coin } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as ({ denom: string, amount: string, base: string, info: string })[])

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  format.initial().then(() => {
    pageload(1)
  })
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getBankSupply(pageRequest.value).then(async (x) => {
    list.value = await Promise.all(x.supply.map(async (coin: Coin) => {
      const metaData = await format.fetchDenomMetadata(coin.denom)
      const denom = (metaData?.symbol || coin.denom)
      return {
        denom: denom.split('/')[denom.split('/').length - 1].toUpperCase(),
        amount: format.tokenAmountNumber({ amount: coin.amount, denom: denom }).toString(),
        base: metaData?.base || coin.denom,
        info: metaData?.display || coin.denom
      }
    }));
    pageResponse.value = x.pagination
  })
}

</script>
<template>
  <div class="overflow-auto bg-base-100">
    <table class="table table-compact">
      <thead class=" bg-base-200">
        <tr>
          <td>Token</td>
          <td>Amount</td>
          <td>Info</td>
          <td>Base</td>
        </tr>
      </thead>
      <tr v-for="item in list" class="hover">
        <td>{{ item.denom }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.info }}</td>
        <td>{{ item.base }}</td>
      </tr>
    </table>
    <PaginationBar :limit="pageRequest.limit" :total="pageResponse.total" :callback="pageload" />
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
