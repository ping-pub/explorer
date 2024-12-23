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

const fuelItem = computed(() => {
  return list.value.find(item => item.denom === "fuel" || item.denom === "test")
})

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
    <div class="overflow-auto bg-base-100">
        <table class="table table-compact">
            <thead class=" bg-base-200">
                <tr>
                    <td>Token</td>
                    <td>Units</td>
                </tr>
            </thead>
            <tr class="hover">
                <td>{{ "fuel (initial_supply)" }}</td>
                <td>{{ "10000000000000000000" }}</td>
            </tr>
            <tr v-if="fuelItem" class="hover">
                <td>{{ "fuel (supply_on_sequencer)" }}</td>
                <td>{{ fuelItem.amount }}</td>
            </tr>
            <tr v-else class="hover">
                <td colspan="2">No fuel token found</td>
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
