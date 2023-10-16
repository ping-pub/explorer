<template>
  <div>
    <v-text-field
      v-model="searchInputAddress"
      density="compact"
      variant="solo"
      class="pb-2"
      label="Search Address"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
    ></v-text-field>
    <v-text-field
      v-model="searchInputDenom"
      density="compact"
      variant="solo"
      class="pb-2"
      label="Search Denom"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
    ></v-text-field>
    <v-btn @click="handleSearch"> Search </v-btn>
    <v-skeleton-loader :loading="bank?.isLoadingDenomHolders" type="table">
      <v-data-table
        :page="currentPage"
        :items-per-page="pageSize"
        :headers="headers"
        :items="rawData"
        :total-items="totalRecords"
        hide-default-footer
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.selectable.address }}</td>
            <td>{{ props.item.selectable.balance.denom }}</td>
            <td>{{ props.item.selectable.balance.amount }}</td>
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
</template>
<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { useBlock } from "@/stores";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { convertDateTime } from "@/utils";
import { VDataTable } from "vuetify/labs/VDataTable";
const searchInputAddress = ref("");
const searchInputDenom = ref("");

const router = useRouter();
const address = router?.currentRoute?.value.params.id;
const bank = useBlock();
const rawData = ref([]);
const pageSize = 10;
const currentPage = ref(1);
const handleChangePage = (newPage) => {
  currentPage.value = newPage;
};
const headers = [
  {
    title: "Address",
    key: "address",
    sortable: false,
  },
  {
    title: "Denom",
    key: "denom",
    sortable: false,
  },
  {
    title: "Amount",
    key: "amount",
    sortable: false,
  },
];
onMounted(async () => {
  await bank.fetchDenomHolders(address);
  rawData.value = bank.denomHolders.denom_owners;
});

const handleSearch = async (e) => {
  router.push(`/check-bank/${address}/${searchInputAddress.value}/${searchInputDenom.value}`);
};
const totalRecords = computed(() => {
  return Math.ceil(rawData.value.length / pageSize);
});
</script>
