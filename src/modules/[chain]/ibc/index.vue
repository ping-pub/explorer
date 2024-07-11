<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import type { PageResponse } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';
import { useIBCModule } from './connStore';

const ibcStore = useIBCModule();
const pageResponse = ref({} as PageResponse | undefined);
const tab = ref('registry');

onMounted(() => {
  ibcStore.load();
});
</script>
<template>
  <div>
    <div class="box-content">
      <div class="flex flex-wrap gap-4 items-center">
        <h2 class="card-title py-4 text-white">{{ $t('ibc.title') }}</h2>
        <div class="tabs tabs-boxed customTab">
          <a
            class="tab"
            :class="{ 'tab-active': tab === 'registry' }"
            @click="tab = 'registry'"
            >{{ $t('ibc.registry') }}</a
          >
          <a
            class="tab"
            :class="{ 'tab-active': tab === 'favorite' }"
            @click="tab = 'favorite'"
            >{{ $t('module.favorite') }}</a
          >
        </div>
      </div>
      <div>
        <div v-show="tab === 'registry'" class="flex flex-wrap gap-4 p-4">
          <span
            v-for="s in ibcStore.commonIBCs"
            class="btn btn-secondary-sm"
            @click="ibcStore.fetchConnection(s.path)"
            >{{ s.from }} &#x21cc; {{ s.to }}</span
          >
        </div>
        <div v-show="tab === 'favorite'" class="flex flex-wrap gap-1 p-4">
          <div class="join border border-primary">
            <button class="join-item px-2">
              {{ $t('ibc.connection_id') }}:
            </button>
            <input
              v-model="ibcStore.connectionId"
              type="number"
              class="input input-bordered w-40 join-item"
              min="0"
              :max="pageResponse?.total ? pageResponse?.total.toString() : 0"
              :placeholder="`0~${pageResponse?.total}`"
            />
            <button
              class="join-item btn btn-primary"
              @click="ibcStore.showConnection()"
            >
              {{ $t('ibc.btn_apply') }}
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-auto mt-5">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'ibc',
      order: 9
    }
  }
</route>
