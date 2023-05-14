<script setup lang="ts">
import { useWalletStore } from '@/stores';

const walletStore = useWalletStore();
walletStore.$subscribe((m, s) => {
  console.log(m, s);
});
</script>

<template>
  <div>
      <div v-if="walletStore.currentAddress"
            class="dropdown dropdown-hover ping-connect-dropdown"
        >
            <label tabindex="3" class="btn m-1" >{{ walletStore.shortAddress }}</label>
            <ul
                tabindex="3"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li>
                    <a>{{ walletStore.connectedWallet }}</a>
                </li>
                <li>
                    <a>{{ walletStore.currentAddress }}</a>
                </li>
                <div class="divider"></div>
                <li><a @click="walletStore.disconnect()">Disconnected</a></li>
            </ul>
        </div>
    <label
      v-else
      for="PingConnectWallet"
      class="btn btn-sm ml-4 ping-connect-btn"
      >Connect Wallet</label
    >
  </div>
</template>
