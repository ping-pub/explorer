<script setup lang="ts">
import { useBaseStore, useBlockchain, useWalletStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';

const walletStore = useWalletStore();
const chainStore = useBlockchain();
const baseStore = useBaseStore();
// walletStore.$subscribe((m, s) => {
//   console.log(m, s);
// });
function walletStateChange(res: any) {
  walletStore.setConnectedWallet(res.detail?.value);
}
let showCopyToast = ref(0);
async function copyAdress(address: string) {
  try {
    await navigator.clipboard.writeText(address);
    showCopyToast.value = 1;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  } catch (err) {
    showCopyToast.value = 2;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  }
}
const tipMsg = computed(() => {
  return showCopyToast.value === 2
    ? { class: 'error', msg: 'Copy Error!' }
    : { class: 'success', msg: 'Copy Success!' };
});
</script>

<template>
  <div class="dropdown dropdown-hover dropdown-end">
    <label
      tabindex="0"
      class='rounded-lg bg-[#7332E7] text-white text-[14px] font-medium cursor-pointer hover:filter hover:brightness-125 transition-all duration-500 px-3 py-[11px] md:px-6 truncate !inline-flex text-xs md:!text-sm'
      :class="{['!bg-[#232326] border border-base-300']: walletStore.currentAddress}"
      >
      <Icon v-if="!walletStore.currentAddress" icon="mdi:history"  width="20" height="20"/>
      <span class="ml-1 hidden md:block">
        {{ walletStore.shortAddress || 'Wallet' }}</span
      >

      <Icon icon="mdi:chevron-down" v-if="walletStore.currentAddress" class="w-5 h-5 md:block hidden"></Icon>
      <Icon icon="mdi:wallet" v-if="walletStore.currentAddress" class="w-5 h-5 md:hidden block"></Icon>
    </label>
    <div
      tabindex="0"
      class="dropdown-content menu shadow p-2 bg-base-100 rounded w-52 md:!w-64 overflow-auto"
    >
      <label
        v-if="!walletStore?.currentAddress"
        for="PingConnectWallet"
        class="flex rounded-lg bg-[#7332E7] text-white text-[14px] font-medium cursor-pointer hover:filter hover:brightness-125 transition-all duration-500 px-6 py-3"
      >
      <Icon icon="mdi:history"  width="20" height="20"/><span class="ml-1 block">Connect Wallet</span>
      </label>
      <div class="px-2 mb-1 text-gray-500 dark:text-gray-400 font-semibold">
        {{ walletStore.connectedWallet?.wallet }}
      </div>
      <div>
        <a
          v-if="walletStore.currentAddress"
          class="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-[#353f5a] rounded cursor-pointer"
          style="overflow-wrap: anywhere"
          @click="copyAdress(walletStore.currentAddress)"
        >
          {{ walletStore.currentAddress }}
        </a>
        <div class="divider mt-1 mb-1"></div>
        <RouterLink to="/wallet/accounts">
          <div
            class="block py-2 px-2 hover:!bg-base-300 rounded cursor-pointer"
          >
            Accounts
          </div>
        </RouterLink>
        <RouterLink to="/wallet/portfolio">
          <div
            class="block py-2 px-2 hover:!bg-base-300 rounded cursor-pointer"
          >
            Portfolio
          </div>
        </RouterLink>
        <div v-if="walletStore.currentAddress" class="divider mt-1 mb-1"></div>
        <a
          v-if="walletStore.currentAddress"
          class="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-base-300 rounded cursor-pointer"
          @click="walletStore.disconnect()"
          >Disconnect</a
        >
      </div>
    </div>
    <div class="toast" v-show="showCopyToast === 1">
      <div class="alert alert-success">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div>
    <div class="toast" v-show="showCopyToast === 2">
      <div class="alert alert-error">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <ping-connect-wallet
      :chain-id="baseStore.currentChainId"
      :hd-path="chainStore.defaultHDPath"
      :addr-prefix="chainStore.current?.bech32Prefix || 'cosmos'"
      @connect="walletStateChange"
      @keplr-config="walletStore.suggestChain()"
    />
  </Teleport>
</template>
