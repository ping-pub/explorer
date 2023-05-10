<script setup lang="ts">
import { useWalletStore } from '@/stores';

const walletStore = useWalletStore();
walletStore.$subscribe((m, s) => {
  console.log(m, s);
});
</script>

<template>
  <div>
    <span v-if="walletStore.currentAddress">{{
      walletStore.currentAddress
    }}</span>

    <label
      v-else
      for="PingConnectWallet"
      class="btn btn-sm ml-4 ping-connect-btn"
      >Connect Wallet</label
    >
  </div>
</template>
