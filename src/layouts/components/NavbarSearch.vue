<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useBlockchain } from '@/stores';
const vueRouters = useRouter();
const blockStore = useBlockchain();
let searchModalShow = ref(false);
let searchQuery = ref('');
let errorMessage = ref('');
onMounted(() => {});

function closeSearchModal() {
  searchModalShow.value = false;
}
function openSearchModal() {
  searchModalShow.value = true;
}

function stopClick(event: Event) {
  event.stopPropagation();
}
function selectValue(event: Event) {
  (event.currentTarget as HTMLInputElement).select();
}
function confirm() {
  errorMessage.value = '';
  const key = searchQuery.value;
  if (!key) {
    errorMessage.value = 'Please enter a value!';
    return;
  }
  const height = /^\d+$/;
  const txhash = /^[A-Z\d]{64}$/;
  const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;

  const current = blockStore?.current?.chainName || '';
  const routeParams = vueRouters?.currentRoute?.value;

  if (!Object.values(routeParams?.params).includes(key)) {
    if (height.test(key)) {
      vueRouters.push({ path: `/${current}/block/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
    } else if (txhash.test(key)) {
      vueRouters.push({ path: `/${current}/tx/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
      //     this.$router.push({ name: 'transaction', params: { chain: c.chain_name, hash: key } })
    } else if (addr.test(key)) {
      vueRouters.push({ path: `/${current}/account/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
    } else {
      errorMessage.value = 'The input not recognized';
    }
  }
}
</script>
<template>
  <div>
    <button class="btn btn-ghost btn-circle btn-sm mx-1" @click="openSearchModal">
      <Icon icon="mdi:magnify" class="text-2xl text-base-content/70" />
    </button>

    <!-- modal -->
    <div
      v-if="searchModalShow"
      class="cursor-pointer modal !pointer-events-auto !opacity-100 !visible"
      @click="closeSearchModal"
    >
      <form class="relative modal-box cursor-default" @click="stopClick" @submit.prevent="confirm">
        <!-- header -->
        <div class="flex items-center justify-between">
          <div class="text-lg font-bold flex flex-col md:!flex-row justify-between items-baseline">
            <span class="mr-2">Search</span>
            <span class="capitalize text-sm md:!text-base">Height/Transaction/Account Address</span>
          </div>
          <label htmlFor="modal-pool-modal" class="cursor-pointer" @click="closeSearchModal">
            <Icon icon="zondicons:close-outline" class="text-2xl text-base-content/70" />
          </label>
        </div>
        <!-- body -->
        <div class="mt-4">
          <div class="">
            <input
              class="input flex-1 w-full !input-bordered"
              v-model="searchQuery"
              placeholder="Height/Transaction/Account Address"
              @focus="selectValue"
              @click="selectValue"
            />
            <div class="mt-2 text-right text-sm text-error" v-show="errorMessage">
              {{ errorMessage }}
            </div>
          </div>
        </div>
        <!-- foot -->
        <div class="mt-6">
          <button type="submit" class="w-full btn btn-primary">Confirm</button>
        </div>
      </form>
    </div>
  </div>
</template>
