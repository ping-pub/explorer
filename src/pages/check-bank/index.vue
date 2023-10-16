<script lang="tsx" setup>
import { useBlock } from "@/stores";
import { ref } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { useRouter } from "vue-router";

const router = useRouter();
const bank = useBlock();
const currentPage = ref(1);
const currentPageTotalSupply = ref(1);

const rawData = ref([]);
const totalSupply = ref([]);
const pageSize = 10;
const address = ref("saw1g52jkxkptfsl2pec0y5a2g22efn3w4ljhz83rz");

onMounted(async () => {
  await bank.fetchBankBalance(address.value);
  await bank.fetchTotalSupply();
  rawData.value = bank.bankByBalance.balances;
  totalSupply.value = bank.totalSupply.supply;
});

const totalRecords = computed(() => {
  return Math.ceil(rawData.value.length / pageSize);
});
const totalRecordsTotalSupply = computed(() => {
  return Math.ceil(totalSupply.value.length / pageSize);
});

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
};
const handlePageChangeSupply = (newPage: number) => {
  currentPage.value = newPage;
};

const headers = [
  {
    title: "Amount",
    key: "amount",
  },
  {
    title: "Demon",
    key: "denom",
  },
];

const handleRouter = (block) => {
  router.push(`/check-bank/${block}`);
};
const handleRouterSupply = (denom) => {
  router.push(`/check-bank/supply/${denom}`);
};
</script>

<template>
  <div class="wrapper-citizen">
    <v-skeleton-loader :loading="bank.isLoadingbankByBalance" type="table">
      <v-data-table
        :page="currentPage"
        :items-per-page="pageSize"
        :headers="headers"
        :items="rawData"
        :total-items="totalRecords"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:item="props">
          <tr @click="handleRouter(props.item.selectable.denom)">
            <td>{{ props.item.selectable.amount }}</td>
            <td>{{ props.item.selectable.denom }}</td>
          </tr>
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination v-model="currentPage" :length="totalRecords"></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <div class="pt-6">
      <v-skeleton-loader :loading="bank.isLoadingTotalSupply" type="table">
        <v-data-table
          :page="currentPageTotalSupply"
          :items-per-page="pageSize"
          :headers="headers"
          :items="totalSupply"
          :total-items="totalRecordsTotalSupply"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item="props">
            <tr @click="handleRouterSupply(props.item.selectable.denom)">
              <td>{{ props.item.selectable.amount }}</td>
              <td>{{ props.item.selectable.denom }}</td>
            </tr>
          </template>
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination v-model="currentPage" :length="totalRecords"></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </div>
  </div>
</template>
