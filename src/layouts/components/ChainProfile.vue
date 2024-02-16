<script setup lang="ts">
import { useBlockchain, useBaseStore, type Endpoint } from '@/stores';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const chainStore = useBlockchain();
const baseStore = useBaseStore();
chainStore.initial();
const router = useRouter();
function changeEndpoint(item: Endpoint) {
  chainStore.setRestEndpoint(item);
  if (chainStore.current) router.push(`/${chainStore.current.chainName}`);
}
let rpcModel = ref('');
</script>

<template>
  <div class="dropdown">
    <label tabindex="0" class="flex items-center">
      <div class="p-1 relative mr-3 cursor-pointer">
        <img v-lazy="chainStore.logo" class="w-9 h-9 rounded-full" />
        <div
          class="w-2 h-2 rounded-full absolute right-0 bottom-0 shadow"
          :class="{
            'bg-success': baseStore.connected,
            'bg-error': !baseStore.connected,
          }"
        ></div>
      </div>
      <div class="flex-1 w-0">
        <div
          :key="
            baseStore.latest?.block?.header?.height ||
            chainStore.chainName ||
            ''
          "
          class="capitalize whitespace-nowrap text-base font-semibold text-gray-600 dark:text-gray-200 hidden md:!block"
        >
          {{
            baseStore.latest?.block?.header?.height
              ? `#${baseStore.latest.block.header.height}`
              : chainStore.chainName || ''
          }}
          <span class="text-error">{{
            baseStore.connected ? '' : 'disconnected'
          }}</span>
        </div>
        <div
          class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:!block"
        >
          {{ chainStore.connErr || chainStore.endpoint.address }}
        </div>
      </div>
    </label>
    <div
      tabindex="0"
      class="dropdown-content flex-row left-6 w-80 menu shadow bg-base-200 rounded-box overflow-auto"
    >
      <!-- rest -->
      <div class="px-4 py-2 text-sm text-gray-400">Information</div>
      <div class="w-full">
        <div class="py-2 px-4">
          Chain Id:
          {{
            baseStore.latest.block?.header.chainId && baseStore.connected
              ? baseStore.latest.block.header.chainId
              : 'N/A'
          }}
        </div>
        <div class="py-2 px-4">
          Height:
          {{
            baseStore.latest.block?.header.height && baseStore.connected
              ? baseStore.latest.block.header.height
              : '0'
          }}
        </div>
      </div>

      <!-- rest -->
      <div
        class="px-4 py-2 text-sm text-gray-400 text-bold"
        v-if="chainStore.current?.endpoints?.rpc"
      >
        RPC Endpoint
      </div>
      <div
        v-for="(item, index) in chainStore.current?.endpoints?.rpc"
        class="px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-[#384059] cursor-pointer"
        :key="index"
        @click="changeEndpoint(item)"
      >
        <div class="flex flex-col">
          <div class="flex items-center justify-between w-full">
            <div class="text-gray-500 dark:text-gray-200 capitalize">
              {{ item.provider }}
            </div>
            <span
              v-if="item.address === chainStore.endpoint?.address"
              class="bg-yes inline-block h-2 w-2 rounded-full"
            />
          </div>
          <div class="text-gray-400 text-xs">
            {{ item.address }}
          </div>
        </div>
      </div>
      <input
        v-model="rpcModel"
        class="input w-full mx-4 mt-2 !input-bordered input-sm"
        @keydown.enter.prevent="
          changeEndpoint({ address: rpcModel, provider: 'custom' })
        "
        :placeholder="'custom: https://rpc.' + chainStore.chainName + '.io'"
      />

      <!-- bottom-->
      <div class="px-4 py-2">&nbsp;</div>
    </div>
  </div>
</template>
