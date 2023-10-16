<script setup>
import { useRouter } from 'vue-router';
import { useBlock } from '@/stores';
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

const router = useRouter();
const transaction = useBlock();
const hash = router.currentRoute.value.params.id;
onMounted(async () => {
  await transaction.fetchDetailTransactionByHash(hash);
});
</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mt-5 detail-blocks-page">
    <div class="text-base mb-3 text-main">Transaction Info</div>
    <div
      class="grid grid-cols-2 md:!grid-cols-1 lg:!grid-cols-1 2xl:!grid-cols-1 gap-4"
    >
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Height</div>
        <v-skeleton-loader
          :loading="transaction.isLoadingTx"
          type="list-item"
          :class="{ 'hide-skeleton': !transaction.isLoadingTx }"
          height="24"
        >
          <div class="text-base text-main">
            {{ transaction?.detailTx?.tx_response?.height }}
          </div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">fee</div>
        <v-skeleton-loader
          :loading="transaction.isLoadingTx"
          type="list-item"
          :class="{ 'hide-skeleton': !transaction.isLoadingTx }"
          height="24"
        >
          <div class="text-base text-main">
            {{ transaction?.detailTx?.tx_response?.events[0].attributes[0].value }}
          </div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">fee_payer</div>
        <v-skeleton-loader
          :loading="transaction.isLoadingTx"
          type="list-item"
          :class="{ 'hide-skeleton': !transaction.isLoadingTx }"
          height="24"
        >
                    {{ transaction?.detailTx?.tx_response?.events[0].attributes[1].value }}

          <!-- <div class="text-base text-main">{{ convertDateTime(block?.detailBlock?.time) }}</div> -->
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">hash</div>
        <v-skeleton-loader
          :loading="transaction.isLoadingTx"
          type="list-item"
          :class="{ 'hide-skeleton': !transaction.isLoadingTx }"
          height="24"
        >
          <div class="text-base text-main">
                      {{ transaction?.detailTx?.tx_response?.txhash }}

            <!-- {{ block?.detailBlock?.proposer_address }} -->
          </div>
        </v-skeleton-loader>
      </div>
    </div>
  </div>
</template>
