<script setup lang="ts">
import { useBlockchain, useBaseStore } from '@/stores';
const chainStore = useBlockchain();
const baseStore = useBaseStore();
chainStore.initial();
</script>

<template>
  <div class="flex items-center">
    <div class="dropdown">
      <div tabindex="0" class="p-1 relative mr-3 cursor-pointer">
        <img v-lazy="chainStore.logo" class="w-9 h-9 rounded-full" />
        <div
          class="w-2 h-2 rounded-full bg-yes absolute right-0 bottom-0 shadow"
        ></div>
      </div>
      <div
        class="dropdown-content menu shadow bg-base-100 rounded-box max-h-[300px] overflow-auto"
      >
        <div>
          <!-- rest -->
          <div
            class="px-4 py-2 text-sm text-gray-400"
            v-if="chainStore.current?.endpoints?.rest"
          >
            Rest Endpoint
          </div>
          <div tabindex="0">
            <div
              v-for="(item, index) in chainStore.current?.endpoints?.rest"
              @click="chainStore.setRestEndpoint(item)"
              class="px-4 py-2 hover:bg-gray-100 dark:bg-[#384059] cursor-pointer"
              :key="index"
            >
              <div class="flex flex-col items-start">
                <div class="flex items-center justify-between w-full">
                  <div class="text-gray-500 dark:text-gray-200 capitalize">
                    {{ item.provider }}
                  </div>

                  <span
                    v-if="item.address === chainStore.endpoint?.address"
                    class="bg-yes inline-block h-2 w-2 rounded-full"
                  />
                </div>
                <div class="text-gray-400 text-xs whitespace-nowrap">
                  {{ item.address }}
                </div>
              </div>
            </div>
          </div>

          <!-- grpc -->
          <div
            class="px-4 py-2 text-sm text-gray-400"
            v-if="chainStore.current?.endpoints?.grpc"
          >
            gRPC Endpoint
          </div>
          <ul tabindex="0">
            <li
              v-for="(item, index) in chainStore.current?.endpoints?.grpc"
              :key="index"
            >
              <div class="flex flex-col items-start">
                <div class="flex items-center justify-between w-full">
                  <p class="text-gray-500 dark:text-gray-200 capitalize">
                    {{ item?.provider }}
                  </p>
                </div>
                <div class="text-gray-400 text-xs whitespace-nowrap">
                  {{ item?.address }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-1 w-0">
      <Transition name="fade" mode="out-in" appear>
      <div :key="baseStore.latest?.block?.header?.height || chainStore.chainName || ''"
        class="capitalize whitespace-nowrap text-base font-semibold text-gray-600 dark:text-gray-200"
      >
        #{{
           baseStore.latest?.block?.header?.height || chainStore.chainName || ''
        }}
      </div>
      </Transition>
      <div
        class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap hidden lg:!block"
      >
        {{ chainStore.connErr || chainStore.endpoint.address }}
      </div>
    </div>
  </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
