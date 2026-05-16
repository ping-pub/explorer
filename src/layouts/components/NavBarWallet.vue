<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBaseStore, useBlockchain, useWalletStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { suggestKeplrChain } from '@/libs/keplr';
import {
  describeQbtcError,
  getAuthorizedQbtcAccount,
  isQbtcProviderAvailable,
  requestQbtcAccount,
} from '@/libs/vultisig-qbtc';

const route = useRoute();
const walletStore = useWalletStore();
const chainStore = useBlockchain();
const baseStore = useBaseStore();

// QBTC signs with ML-DSA-44, not secp256k1, so it can't ride the Keplr
// proxy. When the active chain is QBTC, bypass the Ping-Pub widget and
// talk to `window.vultisig.qbtc` directly (vultisig-windows PR #3933).
const isQbtc = computed(() => chainStore.current?.bech32Prefix === 'qbtc');
const qbtcError = ref('');

// Pre-register the active chain with Keplr so the connect modal doesn't
// trip on "no modular chain info" before the user can interact.
// experimentalSuggestChain is a no-op if the chain is already added.
// Skipped for QBTC — it uses the dedicated `window.vultisig.qbtc` provider
// instead of Keplr.
const suggested = new Set<string>();
watch(
  () => chainStore.current?.chainName,
  (name) => {
    const chain = chainStore.current;
    if (chain?.bech32Prefix === 'qbtc') {
      restoreQbtcSilently();
      return;
    }
    // @ts-ignore
    if (!chain || !name || suggested.has(name) || !window.keplr) return;
    suggested.add(name);
    suggestKeplrChain(chain).catch((e) => console.warn('keplr suggest skipped:', e?.message || e));
  },
  { immediate: true }
);
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

const params = computed(() => {
  if (chainStore.chainName == 'side') {
    return JSON.stringify({
      wallet: ['okex', 'unisat'],
    });
  }
  return JSON.stringify({ wallet: ['keplr'] });
});

const VULTISIG_INSTALL_URL =
  'https://chromewebstore.google.com/search/Vultisig%20Extension';
const VULTISIG_RDNS = 'me.vultisig';

function isVultisigInstalled(): boolean {
  return typeof (window as any).vultisig !== 'undefined';
}

async function connectQbtc() {
  qbtcError.value = '';
  if (!isQbtcProviderAvailable()) {
    window.open(VULTISIG_INSTALL_URL, '_blank', 'noopener');
    return;
  }
  try {
    const address = await requestQbtcAccount();
    walletStore.setConnectedWallet({
      wallet: 'vultisig',
      cosmosAddress: address,
      hdPath: chainStore.defaultHDPath,
    });
  } catch (e) {
    qbtcError.value = describeQbtcError(e);
  }
}

// Silent restore: if the user already approved this dApp for QBTC in a
// previous session, `get_accounts` returns the address without opening a
// popup. Skip when a wallet is already in local state.
async function restoreQbtcSilently() {
  if (walletStore.currentAddress) return;
  if (!isQbtcProviderAvailable()) return;
  try {
    const address = await getAuthorizedQbtcAccount();
    if (address) {
      walletStore.setConnectedWallet({
        wallet: 'vultisig',
        cosmosAddress: address,
        hdPath: chainStore.defaultHDPath,
      });
    }
  } catch (e) {
    console.warn('qbtc silent restore failed:', e);
  }
}

// Vultisig broadcasts its icon (and name/rdns) per EIP-6963. Listen for the
// announcement and expose the icon as a CSS variable so the modal can swap
// the Keplr logo for the real Vultisig logo without bundling an asset.
function handleProviderAnnounce(e: Event) {
  const detail = (e as CustomEvent).detail;
  const info = detail?.info;
  if (info?.rdns === VULTISIG_RDNS && info.icon) {
    document.documentElement.style.setProperty(
      '--vultisig-icon-url',
      `url("${info.icon}")`
    );
  }
}

// Toggle a body class so CSS can relabel the modal's "Connect" button
// to "Install" when the Vultisig extension isn't detected.
function refreshVultisigState() {
  document.body.classList.toggle(
    'vultisig-not-installed',
    !isVultisigInstalled()
  );
}

// Capture-phase listener so we run BEFORE the widget's own @click handler.
// If Vultisig isn't installed, we hijack the Connect button to open the
// chrome web store instead of letting the widget call window.keplr.enable().
function interceptInstallClick(e: Event) {
  const target = e.target as HTMLElement | null;
  if (target?.closest('.ping-connect-confirm') && !isVultisigInstalled()) {
    e.preventDefault();
    e.stopImmediatePropagation();
    window.open(VULTISIG_INSTALL_URL, '_blank', 'noopener');
  }
}

onMounted(() => {
  refreshVultisigState();
  window.addEventListener('focus', refreshVultisigState);
  document.addEventListener('click', interceptInstallClick, true);
  window.addEventListener('eip6963:announceProvider', handleProviderAnnounce);
  window.dispatchEvent(new Event('eip6963:requestProvider'));
});

onUnmounted(() => {
  window.removeEventListener('focus', refreshVultisigState);
  document.removeEventListener('click', interceptInstallClick, true);
  window.removeEventListener('eip6963:announceProvider', handleProviderAnnounce);
  document.body.classList.remove('vultisig-not-installed');
  document.documentElement.style.removeProperty('--vultisig-icon-url');
});
</script>

<template>
  <div class="dropdown dropdown-hover dropdown-end">
    <label
      tabindex="0"
      class="btn btn-sm btn-primary m-1 lowercase truncate !inline-flex text-xs md:!text-sm"
    >
      <Icon icon="mdi:wallet" />
    </label>
    <div
      tabindex="0"
      class="dropdown-content menu shadow p-2 bg-base-100 rounded w-52 md:!w-64 overflow-auto"
    >
      <button
        v-if="!walletStore?.currentAddress && isQbtc"
        type="button"
        class="btn btn-sm btn-primary"
        @click="connectQbtc"
      >
        <Icon icon="mdi:wallet" /><span class="ml-1 block">Connect Vultisig</span>
      </button>
      <label
        v-else-if="!walletStore?.currentAddress"
        for="PingConnectWallet"
        class="btn btn-sm btn-primary"
      >
        <Icon icon="mdi:wallet" /><span class="ml-1 block">Connect Vultisig</span>
      </label>
      <div
        v-if="qbtcError && isQbtc && !walletStore?.currentAddress"
        class="px-2 mt-1 text-xs text-error"
        style="overflow-wrap: anywhere"
      >
        {{ qbtcError }}
      </div>
      <div class="px-2 mb-1 text-gray-500 dark:text-gray-400 font-semibold">
        {{ walletStore.connectedWallet?.wallet ? 'Vultisig' : '' }}
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
            class="block py-2 px-2 hover:!bg-gray-100 rounded cursor-pointer"
          >
            Accounts
          </div>
        </RouterLink>
        <RouterLink to="/wallet/portfolio">
          <div
            class="block py-2 px-2 hover:!bg-gray-100 rounded cursor-pointer"
          >
            Portfolio
          </div>
        </RouterLink>
        <div v-if="walletStore.currentAddress" class="divider mt-1 mb-1"></div>
        <a
          v-if="walletStore.currentAddress"
          class="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-[#353f5a] rounded cursor-pointer"
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
      :chain-id="baseStore.currentChainId || 'cosmoshub-4'"
      :hd-path="chainStore.defaultHDPath"
      :addr-prefix="chainStore.current?.bech32Prefix || 'cosmos'"
      @connect="walletStateChange"
      @keplr-config="walletStore.suggestChain()"
      :params="params"
    />
  </Teleport>
</template>

<style>
.ping-connect-btn,
.ping-connect-dropdown {
  display: none !important;
}

/*
 * Limit @ping-pub/widget modal to show only Vultisig.
 * The widget ignores the `params` prop in the version we load from CDN,
 * so we filter via CSS instead. Vultisig impersonates window.keplr, so
 * the Keplr row is the one that actually connects Vultisig — we keep
 * that row, hide everything else, and relabel it as "Vultisig".
 */
ping-connect-wallet ul[role='list'] li {
  display: none !important;
}
ping-connect-wallet ul[role='list'] li:has(img[src*='keplr']) {
  display: flex !important;
}
ping-connect-wallet ul[role='list'] li:has(img[src*='keplr']) p {
  font-size: 0;
}
ping-connect-wallet ul[role='list'] li:has(img[src*='keplr']) p::before {
  content: 'Vultisig';
  font-size: 1rem;
  font-weight: 600;
}
/*
 * Replace the Keplr logo with the real Vultisig icon when available.
 * --vultisig-icon-url is set at runtime from the EIP-6963 announcement;
 * if unset, the `var()` lookup fails and the original img src renders.
 */
ping-connect-wallet ul[role='list'] li:has(img[src*='keplr']) img {
  content: var(--vultisig-icon-url);
  border: 1px solid rgba(128, 128, 128, 0.25);
}
ping-connect-wallet .modal-box h3 {
  font-size: 0;
}
ping-connect-wallet .modal-box h3::before {
  content: 'Connect Vultisig';
  font-size: 1.25rem;
  font-weight: 600;
}

/*
 * When Vultisig isn't detected, relabel the modal's "Connect" button to
 * "Install". The click is intercepted in JS (interceptInstallClick) to
 * open the chrome web store instead of running the widget's connect flow.
 */
body.vultisig-not-installed ping-connect-wallet .ping-connect-confirm {
  font-size: 0;
}
body.vultisig-not-installed ping-connect-wallet .ping-connect-confirm::before {
  content: 'Install';
  font-size: 1rem;
  font-weight: 600;
}
</style>
