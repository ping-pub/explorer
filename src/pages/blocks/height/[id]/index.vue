<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { useBlock } from "@/stores";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { convertDateTime } from '@/utils'; 

const router = useRouter();
const block = useBlock();
const param = router?.currentRoute?.value.params.id;
onMounted(async () => {
  await block.fetchDetailBlock(param);
});

</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mt-5 detail-blocks-page">
    <div class="text-base mb-3 text-main">Block Info</div>
    <div class="grid grid-cols-2 md:!grid-cols-1 lg:!grid-cols-1 2xl:!grid-cols-1 gap-4">
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Height</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">{{ block?.detailBlock?.height }}</div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Hash</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">
            {{ block?.detailBlock?.last_block_id?.hash }}
          </div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Time</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">{{ convertDateTime(block?.detailBlock?.time) }}</div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Proposer Address</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">
            {{ block?.detailBlock?.proposer_address }}
          </div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Chain Id</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">{{ block?.detailBlock?.chain_id }}</div>
        </v-skeleton-loader>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Data Hash</div>
        <v-skeleton-loader
          :loading="block.isLoading"
          type="list-item"
          :class="{ 'hide-skeleton': !block.isLoading }"
          height="24"
        >
          <div class="text-base text-main">{{ block?.detailBlock?.data_hash }}</div>
        </v-skeleton-loader>
      </div>
    </div>
  </div>
</template>
