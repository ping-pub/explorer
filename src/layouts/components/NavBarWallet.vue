<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBaseStore, useBlockchain, useWalletStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
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
// proxy. When the active chain is QBTC we let the user click "Connect"
// inside the Ping-Pub modal as usual, but intercept that click and talk
// to `window.vultisig.qbtc` directly (vultisig-windows PR #3933) so we
// surface the dedicated 4100 error when the picked vault lacks MLDSA.
const isQbtc = computed(() => chainStore.current?.bech32Prefix === 'qbtc');

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

function isVultisigInstalled(): boolean {
  return typeof (window as any).vultisig !== 'undefined';
}

const QBTC_MODAL_ERROR_CLASS = 'qbtc-modal-error';

function removeQbtcModalError() {
  document
    .querySelectorAll(`.${QBTC_MODAL_ERROR_CLASS}`)
    .forEach((el) => el.remove());
}

// Render the error inline in the widget's modal-box, just above the
// Connect button row, so the user sees it without the dropdown closing.
function showQbtcModalError(message: string) {
  removeQbtcModalError();
  const buttonRow = document.querySelector(
    'ping-connect-wallet .modal-box .mt-8.text-right'
  );
  const parent = buttonRow?.parentElement;
  if (!buttonRow || !parent) return;
  const el = document.createElement('div');
  el.className = `${QBTC_MODAL_ERROR_CLASS} text-red-500`;
  el.textContent = message;
  parent.insertBefore(el, buttonRow);
}

function closePingConnectModal() {
  const cb = document.getElementById('PingConnectWallet');
  if (cb instanceof HTMLInputElement) cb.checked = false;
}

async function connectQbtcFromModal() {
  removeQbtcModalError();
  try {
    const address = await requestQbtcAccount();
    walletStore.setConnectedWallet({
      wallet: 'vultisig',
      cosmosAddress: address,
      hdPath: chainStore.defaultHDPath,
    });
    closePingConnectModal();
  } catch (e) {
    showQbtcModalError(describeQbtcError(e));
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

// Toggle a body class so CSS can relabel the modal's "Connect" button
// to "Install" when the Vultisig extension isn't detected.
function refreshVultisigState() {
  document.body.classList.toggle(
    'vultisig-not-installed',
    !isVultisigInstalled()
  );
}

// Capture-phase listener so we run BEFORE the widget's own @click handler.
// Two interceptions on the modal's Connect button:
//   1) Extension not installed → open the chrome web store.
//   2) Active chain is QBTC → bypass the Keplr-proxy path (which swallows
//      the "no MLDSA" case) and connect via `window.vultisig.qbtc`, which
//      surfaces a clear 4100 error when the picked vault lacks MLDSA.
function interceptConnectClick(e: Event) {
  const target = e.target as HTMLElement | null;
  if (!target?.closest('.ping-connect-confirm')) return;
  if (!isVultisigInstalled()) {
    e.preventDefault();
    e.stopImmediatePropagation();
    window.open(VULTISIG_INSTALL_URL, '_blank', 'noopener');
    return;
  }
  if (isQbtc.value && isQbtcProviderAvailable()) {
    e.preventDefault();
    e.stopImmediatePropagation();
    void connectQbtcFromModal();
  }
}

// Clear any injected QBTC error when the modal closes (the widget's modal
// is a daisyUI checkbox-controlled modal — closing flips the checkbox off).
function handleModalCheckboxChange(e: Event) {
  const t = e.target as HTMLInputElement | null;
  if (t?.id === 'PingConnectWallet' && !t.checked) removeQbtcModalError();
}

onMounted(() => {
  refreshVultisigState();
  window.addEventListener('focus', refreshVultisigState);
  document.addEventListener('click', interceptConnectClick, true);
  document.addEventListener('change', handleModalCheckboxChange);
});

onUnmounted(() => {
  window.removeEventListener('focus', refreshVultisigState);
  document.removeEventListener('click', interceptConnectClick, true);
  document.removeEventListener('change', handleModalCheckboxChange);
  document.body.classList.remove('vultisig-not-installed');
  removeQbtcModalError();
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
      <label
        v-if="!walletStore?.currentAddress"
        for="PingConnectWallet"
        class="btn btn-sm btn-primary"
      >
        <Icon icon="mdi:wallet" /><span class="ml-1 block">Connect Wallet</span>
      </label>
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
 * Always swap the Keplr logo for the official Vultisig icon — keeps the
 * modal visually consistent whether or not the extension is installed
 * (no EIP-6963 announcement needed pre-install).
 *
 * The widget's img has `bg-gray-50 rounded-full` — those clip into the
 * Vultisig icon's own circular design. Drop them so the SVG renders at
 * its natural shape, without any border.
 */
ping-connect-wallet ul[role='list'] li:has(img[src*='keplr']) img {
  content: url('https://raw.githubusercontent.com/vultisig/vultisig-windows/cedaf85b7b6ed21d35487ce1b4b64688b79c5c74/ci/deb/vultisig.svg');
  background-color: transparent;
  border-radius: 0;
  object-fit: contain;
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

/*
 * The widget renders unregistered-chain feedback as:
 *   <div class="text-error mt-3">
 *     <span>Error: There is no chain info for <id>.</span>
 *     <div><a class="btn btn-link">Suggest a chain to Keplr</a></div>
 *   </div>
 *
 * For our flow this is a normal connection step, not an error — re-color
 * to neutral, replace the message wording, drop the Keplr name from the
 * link, and left-align the link with the message above it.
 */
ping-connect-wallet .text-error {
  color: inherit;
}
ping-connect-wallet .text-error > span {
  font-size: 0;
}
ping-connect-wallet .text-error > span::before {
  content: 'This chain is not yet registered with Vultisig.';
  font-size: 0.875rem;
}
ping-connect-wallet .text-error .btn-link {
  font-size: 0;
  padding-left: 0;
  padding-right: 0;
  min-height: 0;
  height: auto;
  justify-content: flex-start;
  text-align: left;
}
ping-connect-wallet .text-error .btn-link::before {
  content: 'Add this chain to Vultisig';
  font-size: 0.875rem;
  text-decoration: underline;
}

/*
 * The widget renders a gear-icon `<label class="btn mr-1">` next to the
 * primary Connect button. It emits `keplr-config` — the same action as
 * the "Add this chain to Vultisig" link in the unregistered-chain notice
 * above. Redundant for our flow, so hide it.
 */
ping-connect-wallet .modal-box .mt-8.text-right > label.btn:not(.ping-connect-confirm) {
  display: none !important;
}

/*
 * Error injected into the modal-box when QBTC `request_accounts` fails
 * (most often: picked vault has no MLDSA key — provider returns 4100).
 * Sits right above the button row so the user can read it before
 * dismissing the modal.
 */
ping-connect-wallet .modal-box .qbtc-modal-error {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  text-align: left;
  overflow-wrap: anywhere;
}
</style>
