<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Coin } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
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

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getBankSupply(pageRequest.value).then(x => {
    list.value = x.supply
    pageResponse.value = x.pagination
  });
}

</script>
<template>
    <div class="overflow-auto">
        <table class="table table-compact">
            <thead>
                <tr>
                    <td>Token</td>
                    <td>Amount</td>
                </tr>
            </thead>
            <tr v-for="item in list">
                <td>{{ item.denom  }}</td>
                <td>{{ item.amount  }}</td>
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
