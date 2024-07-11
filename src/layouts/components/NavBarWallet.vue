<script setup lang="ts">
import { useBaseStore, useBlockchain, useWalletStore } from '@/stores';
import { Icon } from '@iconify/vue';
import CopyAddress from './CopyAddress.vue';

const walletStore = useWalletStore();
const chainStore = useBlockchain();
const baseStore = useBaseStore();

function walletStateChange(res: any) {
  walletStore.setConnectedWallet(res.detail?.value);
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="rounded-lg bg-[#7332E7] text-white text-[14px] font-medium cursor-pointer hover:filter hover:brightness-125 transition-all duration-500 px-3 py-[11px] md:px-6 truncate !inline-flex text-xs md:!text-sm"
      :class="{
        ['!bg-[#232326] border border-base-300']: walletStore.currentAddress,
      }"
      :for="!walletStore.currentAddress ? 'PingConnectWallet' : ''"
    >
      <Icon
        v-if="!walletStore.currentAddress"
        icon="mdi:history"
        width="20"
        height="20"
      />
      <span class="ml-1 hidden md:block">
        {{ walletStore.shortAddress || 'Wallet' }}</span
      >
      <Icon
        icon="mdi:chevron-down"
        v-if="walletStore.currentAddress"
        class="w-5 h-5 md:block hidden"
      ></Icon>
      <Icon
        icon="mdi:wallet"
        v-if="walletStore.currentAddress"
        class="w-5 h-5 md:hidden block"
      ></Icon>
    </label>
    <div
      v-if="walletStore.currentAddress"
      tabindex="0"
      class="mt-2 dropdown-content menu shadow py-2 rounded-lg w-52 md:!w-96 overflow-auto bg-[#2E2E33] px-0"
    >
      <div
        v-if="walletStore.currentAddress"
        class="px-4 mt-2 mb-1 text-gray-500 dark:text-gray-400 font-semibold"
      >
        Account Address
      </div>
      <div>
        <a
          v-if="walletStore.currentAddress"
          class="flex items-center gap-1 font-semibold text-white py-2 px-4 hover:!bg-base-300 rounded cursor-pointer border-b border-b-[#383B40] text-[13px]"
          style="overflow-wrap: anywhere"
        >
          {{ walletStore.currentAddress }}
          <CopyAddress />
        </a>
        <RouterLink v-if="walletStore.currentAddress" to="/wallet/accounts">
          <div
            class="py-3 px-4 hover:!bg-base-300 rounded cursor-pointer flex gap-4 border-b border-b-[#383B40]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clip-path="url(#clip0_13417_17941)">
                <path
                  d="M9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.24767 10.4496 2.71413 11.861 3.57975 13.0238C3.83501 12.2867 4.31364 11.6476 4.94904 11.1953C5.58445 10.743 6.34504 10.4999 7.125 10.5H10.875C11.655 10.4999 12.4156 10.743 13.051 11.1953C13.6864 11.6476 14.165 12.2867 14.4203 13.0238C15.286 11.8611 15.7525 10.4496 15.75 9C15.75 7.20979 15.0388 5.4929 13.773 4.22703C12.5071 2.96116 10.7902 2.25 9 2.25ZM13.125 14.3438V14.25C13.125 13.6533 12.888 13.081 12.466 12.659C12.044 12.2371 11.4717 12 10.875 12H7.125C6.52827 12 5.95597 12.2371 5.53401 12.659C5.11206 13.081 4.875 13.6533 4.875 14.25V14.3438C6.05552 15.2579 7.50694 15.7527 9 15.75C10.554 15.75 11.9843 15.225 13.125 14.3438ZM0.750004 9C0.750004 4.44375 4.44375 0.75 9 0.75C13.5563 0.75 17.25 4.44375 17.25 9C17.2511 10.1918 16.9935 11.3696 16.4949 12.4522C15.9964 13.5347 15.2688 14.4961 14.3625 15.27C12.8694 16.5503 10.9668 17.2528 9 17.25C7.03319 17.2528 5.13056 16.5503 3.6375 15.27C2.73105 14.4962 2.00341 13.5348 1.50487 12.4522C1.00633 11.3697 0.748775 10.1918 0.750004 9ZM9 4.5C8.50272 4.5 8.02581 4.69754 7.67418 5.04918C7.32255 5.40081 7.125 5.87772 7.125 6.375C7.125 6.87228 7.32255 7.3492 7.67418 7.70083C8.02581 8.05246 8.50272 8.25 9 8.25C9.49728 8.25 9.9742 8.05246 10.3258 7.70083C10.6775 7.3492 10.875 6.87228 10.875 6.375C10.875 5.87772 10.6775 5.40081 10.3258 5.04918C9.9742 4.69754 9.49728 4.5 9 4.5ZM5.625 6.375C5.625 5.47989 5.98058 4.62145 6.61352 3.98851C7.24645 3.35558 8.1049 3 9 3C9.89511 3 10.7536 3.35558 11.3865 3.98851C12.0194 4.62145 12.375 5.47989 12.375 6.375C12.375 7.27011 12.0194 8.12855 11.3865 8.76149C10.7536 9.39442 9.89511 9.75 9 9.75C8.1049 9.75 7.24645 9.39442 6.61352 8.76149C5.98058 8.12855 5.625 7.27011 5.625 6.375Z"
                  fill="#B4B7BB"
                />
              </g>
              <defs>
                <clipPath id="clip0_13417_17941">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Accounts
          </div>
        </RouterLink>
        <RouterLink v-if="walletStore.currentAddress" to="/wallet/portfolio">
          <div
            class="py-3 px-4 hover:!bg-base-300 rounded cursor-pointer flex gap-4 border-b border-b-[#383B40]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M1.5 1.5H16.5V16.5H1.5V1.5ZM3 3V15H15V3H3ZM9.75 5.25V13.5H8.25V5.25H9.75ZM6 8.25V13.5H4.5V8.25H6ZM13.5 9.75V13.5H12V9.75H13.5Z"
                fill="#B4B7BB"
              />
            </svg>
            Portfolio
          </div>
        </RouterLink>
        <a
          v-if="walletStore.currentAddress"
          class="py-3 px-4 hover:bg-gray-100 dark:hover:bg-base-300 rounded cursor-pointer text-[#FF5252] flex gap-4"
          @click="walletStore.disconnect()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.1026 10.6082C15.7795 11.8142 15.1446 12.9138 14.2618 13.7966C13.379 14.6794 12.2794 15.3143 11.0734 15.6374C9.86749 15.9606 8.59774 15.9606 7.3918 15.6374C6.18586 15.3143 5.08623 14.6794 4.20342 13.7966C3.32061 12.9138 2.68573 11.8142 2.3626 10.6082C2.03947 9.4023 2.03947 8.13255 2.3626 6.92662C2.68573 5.72068 3.32061 4.62104 4.20342 3.73823C5.08623 2.85542 6.18586 2.22055 7.3918 1.89742L7.77615 3.33182C6.822 3.58748 5.95196 4.0898 5.25347 4.78829C4.55499 5.48677 4.05267 6.35681 3.797 7.31096C3.54134 8.26511 3.54134 9.26975 3.797 10.2239C4.05267 11.178 4.55499 12.0481 5.25347 12.7466C5.95196 13.4451 6.822 13.9474 7.77615 14.203C8.7303 14.4587 9.73493 14.4587 10.6891 14.203C11.6432 13.9474 12.5133 13.4451 13.2118 12.7466C13.9102 12.0481 14.4126 11.178 14.6682 10.2239L16.1026 10.6082Z"
              fill="#FF5252"
            />
            <path
              d="M16.3296 7.49849L16.3296 2.40339L10.6684 2.40339L10.6684 3.90316L13.4847 3.90316L9.40393 7.57584L10.5824 8.6365L14.6632 4.96382L14.6632 7.49849L16.3296 7.49849Z"
              fill="#FF5252"
            />
          </svg>
          Disconnect</a
        >
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
