<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Pagination, type Coin } from '@/types';
import { ref, onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
import { formatIbcToken } from '@/libs/assets';

const formatter = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Coin[])

function showType(v: string) {
    return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageload(1)
});

async function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getBankSupply(pageRequest.value).then(async x => {
    list.value = x.supply
    pageResponse.value = x.pagination

    list.value.map(async coin => {
      const { denom, amount } = await formatIbcToken(coin);
      coin.denom = denom;
      coin.amount = amount;
    })
  });
}

</script>
<template>
    <div class="overflow-auto bg-base-100">
        <table class="table table-compact">
            <thead class=" bg-base-200">
                <tr>
                    <td>Token</td>
                    <td>Amount</td>
                </tr>
            </thead>
            <tr v-for="item in list" class="hover">
                <td>{{ item.denom }}</td>
                <td>{{ item.amount }}</td>
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
