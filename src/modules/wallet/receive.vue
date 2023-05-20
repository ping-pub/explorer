<script setup lang="ts">
import { useWalletStore } from '@/stores';
import { useQRCode } from '@vueuse/integrations/useQRCode';

const walletStore = useWalletStore();
const qrcode = useQRCode(walletStore.currentAddress);
</script>

<template>
  <div class="bg-base-100 p-4 rounded text-center">
    <div class="text-xl font-semibold text-center">Pay Me</div>
    <div v-if="walletStore.currentAddress" class="flex items-center justify-center mt-8 mb-4">
      <img :src="qrcode" alt="QR Code" class="rounded-sm overflow-hidden" />
    </div>
    <div class="text-main">
      {{ walletStore.currentAddress }}
    </div>
    <div class="mt-4 mb-4">
      <button class="btn !bg-yes !border-yes text-white px-10">Go To Pay</button>
    </div>
  </div>
</template>
