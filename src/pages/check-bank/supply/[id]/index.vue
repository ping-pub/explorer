<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { useBlock } from "@/stores";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { convertDateTime } from "@/utils";
import { VDataTable } from "vuetify/labs/VDataTable";

const router = useRouter();
const denom = router.currentRoute.value.params.id;
const bank = useBlock();
const rawData = ref([]);

const headers = [
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
  await bank.fetchTotalSupplyDenom(denom);
  rawData.value = bank.totalSupplyDenom.amount;
});
</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mt-5">
    <div class="text-base mb-3 text-main">Citizen Info</div>
    <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Denom</div>
        <v-skeleton-loader
          :loading="bank.isLoadingTotalSupplyDenom"
          type="list-item"
          :class="{ 'hide-skeleton': !bank.isLoadingTotalSupplyDenom }"
          height="24"
        >
          <div class="text-base text-main">{{ rawData.denom }}</div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Amount</div>
        <v-skeleton-loader
          :loading="bank.isLoadingTotalSupplyDenom"
          type="list-item"
          :class="{ 'hide-skeleton': !bank.isLoadingTotalSupplyDenom }"
          height="24"
        >
          <div class="text-base text-main">{{ rawData.amount }}</div>
        </v-skeleton-loader>
      </div>
    </div>
  </div>
</template>
