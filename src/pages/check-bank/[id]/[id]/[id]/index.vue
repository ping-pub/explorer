<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { useBlock } from "@/stores";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { convertDateTime } from "@/utils";
import { VDataTable } from "vuetify/labs/VDataTable";
const router = useRouter();
const rawData = ref([]);
const address3 = router.currentRoute.value.fullPath;
const parts = address3.split("/");
const bank = useBlock();

// Lấy giá trị cuối cùng và giá trị trước đó trong mảng 'parts'
const denom = parts[parts.length - 1];
const address = parts[parts.length - 2];
onMounted(async () => {
  await bank.fetchDenomAddress(address, denom);
  rawData.value = bank.denomAddress.balance;
});
</script>
<template>
  <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
    <div class="rounded-sm bg-active px-4 py-2">
      <div class="text-xs mb-2 text-secondary capitalize">Id</div>
      <v-skeleton-loader
        :loading="bank.isLoadingDenomAddress"
        type="list-item"
        :class="{ 'hide-skeleton': !bank.isLoading }"
        height="24"
      >
        <div class="text-base text-main">{{ rawData.denom }}</div>
      </v-skeleton-loader>
    </div>
    <div class="rounded-sm bg-active px-4 py-2">
      <div class="text-xs mb-2 text-secondary capitalize">User Name</div>
      <v-skeleton-loader
        :loading="bank.isLoadingDenomAddress"
        type="list-item"
        :class="{ 'hide-skeleton': !bank.isLoading }"
        height="24"
      >
        <div class="text-base text-main">{{ rawData.amount }}</div>
      </v-skeleton-loader>
    </div>
  </div>
</template> 
