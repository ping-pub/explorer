<script setup lang="ts">
import { useWalletStore } from '@/stores';

const walletStore = useWalletStore();
walletStore.$subscribe((m, s) => {
  console.log(m, s);
});
</script>

<template>
  <div
    v-show="walletStore.currentAddress"
    class="dropdown dropdown-hover dropdown-end"
  >
    <label tabindex="0" class="btn btn-sm m-1 lowercase">{{ walletStore.shortAddress }}</label>
    <div
      tabindex="0"
      class="dropdown-content menu shadow p-2 bg-base-100 rounded w-64 overflow-auto"
    >
      <div class="px-2 mb-1 text-gray-500 dark:text-gray-400 font-semibold">
        {{ walletStore.connectedWallet?.wallet }}
      </div>
      <div class="">
        <a
          class="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-[#353f5a] rounded cursor-pointer"
          style="overflow-wrap: anywhere"
        >
          {{ walletStore.currentAddress }}
        </a>
        <a
          class="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-[#353f5a] rounded cursor-pointer"
          @click="walletStore.disconnect()"
          >Disconnected</a
        >
      </div>
    </div>
  </div>
  <label
    v-if="!walletStore?.currentAddress"
    for="PingConnectWallet"
    class="btn btn-sm ml-4 ping-connect-btn"
    >Connect Wallet</label
  >
</template>
