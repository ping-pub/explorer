<script setup lang="ts">
import { ref } from 'vue';
import { useBlockchain, useWalletStore } from '@/stores';

const walletStore = useWalletStore()
walletStore.$subscribe((m, s) => {
    console.log(m, s)
})
</script>

<template>
  <div>
    <span v-if="walletStore.currentAddress">{{ walletStore.currentAddress }}</span>
    <ping-connect-wallet class="mt-5" :chain-id="'juno-1'" :hd-path="`m/44'/118/0'/0/0`" />
  </div>
</template>
