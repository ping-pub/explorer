<script lang="ts" setup>
/**
 * QBTC-native replacement for the upstream `<ping-tx-dialog>`.
 *
 * The CDN widget's signer factory only knows Kepler / Leap / Metamask /
 * Ledger; calling Send with a QBTC wallet trips its `"No wallet connected"`
 * branch. QBTC also signs with ML-DSA-44, which Keplr's offline signer can't
 * produce. So we render a daisyUI modal here and route Send straight to
 * `window.vultisig.qbtc.request({ method: 'send_transaction', ... })`.
 *
 * Reuses the existing `<label for="send">` open trigger by mounting a hidden
 * `<input id="send" type="checkbox">` with the daisyUI modal-toggle pattern.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fromBech32 } from '@cosmjs/encoding';
import { useBlockchain, useWalletStore } from '@/stores';
import {
  describeQbtcError,
  isQbtcProviderAvailable,
  sendQbtcTransaction,
} from '@/libs/vultisig-qbtc';
import router from '@/router';

const walletStore = useWalletStore();
const chainStore = useBlockchain();

const recipient = ref('');
const amountInput = ref('');
const memo = ref('');
const showAdvanced = ref(false);
const submitting = ref(false);
const errorMsg = ref('');
const txHash = ref('');

const QBTC_DECIMALS = 8;
const QBTC_BASE = 10n ** BigInt(QBTC_DECIMALS);

function baseToDecimal(base: string): string {
  if (!/^\d+$/.test(base)) return '0';
  const b = BigInt(base);
  const whole = b / QBTC_BASE;
  const frac = b % QBTC_BASE;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(QBTC_DECIMALS, '0').replace(/0+$/, '');
  return `${whole}.${fracStr}`;
}

function decimalToBase(decimal: string): string | null {
  if (!/^\d+(\.\d+)?$/.test(decimal)) return null;
  const [whole, frac = ''] = decimal.split('.');
  if (frac.length > QBTC_DECIMALS) return null;
  const padded = frac.padEnd(QBTC_DECIMALS, '0');
  const result = BigInt(whole) * QBTC_BASE + BigInt(padded);
  if (result === 0n) return null;
  return result.toString();
}

const qbtcBalance = computed(() => {
  return walletStore.balances.find((b) => b.denom === 'qbtc');
});

const balanceLabel = computed(() => {
  if (!qbtcBalance.value) return '0 QBTC';
  return `${baseToDecimal(qbtcBalance.value.amount)} QBTC`;
});

function isValidQbtcAddress(addr: string): boolean {
  try {
    const { prefix } = fromBech32(addr);
    return prefix === 'qbtc';
  } catch {
    return false;
  }
}

function closeModal() {
  const cb = document.getElementById('send');
  if (cb instanceof HTMLInputElement) cb.checked = false;
}

function resetForm() {
  recipient.value = '';
  amountInput.value = '';
  memo.value = '';
  showAdvanced.value = false;
  errorMsg.value = '';
  txHash.value = '';
  submitting.value = false;
}

// Reset every time the modal flips to open. Watching the store's `type`
// misses the case of opening Send twice in a row (value doesn't change),
// so we hook the daisyUI modal-toggle checkbox directly.
function onSendToggleChange(e: Event) {
  const t = e.target as HTMLInputElement | null;
  if (t?.id === 'send' && t.checked) resetForm();
}
onMounted(() => document.addEventListener('change', onSendToggleChange));
onUnmounted(() => document.removeEventListener('change', onSendToggleChange));

async function onSubmit() {
  errorMsg.value = '';
  const from = walletStore.currentAddress;
  if (!from) {
    errorMsg.value = 'Wallet not connected.';
    return;
  }
  if (!isQbtcProviderAvailable()) {
    errorMsg.value = 'Vultisig QBTC provider not available.';
    return;
  }
  const to = recipient.value.trim();
  if (!isValidQbtcAddress(to)) {
    errorMsg.value = 'Recipient must be a valid qbtc1… address.';
    return;
  }
  const baseUnits = decimalToBase(amountInput.value.trim());
  if (!baseUnits) {
    errorMsg.value = `Amount must be a positive QBTC value (up to ${QBTC_DECIMALS} decimal places).`;
    return;
  }
  submitting.value = true;
  try {
    const hash: string = await sendQbtcTransaction({
      from,
      to,
      value: baseUnits,
      memo: memo.value.trim() || undefined,
    });
    txHash.value = hash;
    // Surface to upstream listeners (TxDialog forwards `confirmed` to the
    // store, which fires the page's refresh callback).
    confirmedEvent({ hash });
  } catch (e) {
    errorMsg.value = describeQbtcError(e);
  } finally {
    submitting.value = false;
  }
}

const emit = defineEmits<{
  (e: 'confirmed', payload: { detail: { hash: string } }): void;
}>();

function confirmedEvent(payload: { hash: string }) {
  emit('confirmed', { detail: { hash: payload.hash } });
}

function viewTx() {
  if (!txHash.value) return;
  closeModal();
  router.push({ path: `/${chainStore.chainName}/tx/${txHash.value}` });
}
</script>

<template>
  <Teleport to="body">
    <input type="checkbox" id="send" class="modal-toggle" />
    <div class="modal qbtc-tx-modal">
      <div class="modal-box relative">
        <label
          for="send"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
        <h3 class="font-bold text-lg">Send</h3>

        <div v-if="!txHash">
          <div class="form-control">
            <label class="label"><span class="label-text">Sender</span></label>
            <input
              type="text"
              class="input input-bordered bg-base-200 w-full"
              :value="walletStore.currentAddress"
              readonly
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Balances</span></label>
            <input
              type="text"
              class="input input-bordered bg-base-200 w-full"
              :value="balanceLabel"
              readonly
            />
          </div>

          <div class="form-control">
            <label class="label"
              ><span class="label-text">Recipient</span></label
            >
            <input
              v-model="recipient"
              type="text"
              placeholder="qbtc1…"
              class="input input-bordered bg-base-200 w-full"
              :disabled="submitting"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Amount</span>
            </label>
            <label
              class="input input-bordered bg-base-200 w-full flex items-center gap-2"
            >
              <input
                v-model="amountInput"
                type="text"
                inputmode="decimal"
                placeholder="0.0"
                class="grow bg-transparent outline-none border-0 p-0"
                :disabled="submitting"
              />
              <span
                class="badge badge-ghost bg-base-300 border-0 uppercase"
                >qbtc</span
              >
            </label>
          </div>

          <div class="form-control mt-2">
            <label class="label cursor-pointer justify-start gap-2 pl-0">
              <input
                v-model="showAdvanced"
                type="checkbox"
                class="checkbox checkbox-xs rounded-full"
              />
              <span class="label-text">Advance</span>
            </label>
          </div>
          <div v-if="showAdvanced" class="form-control">
            <label class="label"><span class="label-text">Memo</span></label>
            <input
              v-model="memo"
              type="text"
              class="input input-bordered bg-base-200 w-full"
              :disabled="submitting"
            />
          </div>

          <div
            v-if="errorMsg"
            class="alert alert-error mt-3 text-sm py-2"
            style="overflow-wrap: anywhere"
          >
            <span>{{ errorMsg }}</span>
          </div>

          <div class="modal-action mt-4">
            <label
              for="send"
              class="btn btn-ghost"
              :class="{ 'btn-disabled': submitting }"
              >Cancel</label
            >
            <button
              class="btn btn-primary"
              :disabled="submitting"
              @click="onSubmit"
            >
              <span
                v-if="submitting"
                class="loading loading-spinner loading-xs mr-1"
              ></span>
              {{ submitting ? 'Sending…' : 'Send' }}
            </button>
          </div>
        </div>

        <div v-else>
          <div class="alert alert-success text-sm py-2 mt-2">
            <span>Transaction submitted.</span>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Tx hash</span></label>
            <input
              type="text"
              class="input input-bordered bg-base-200 w-full"
              :value="txHash"
              readonly
            />
          </div>
          <div class="modal-action mt-4">
            <label for="send" class="btn btn-ghost">Close</label>
            <button class="btn btn-primary" @click="viewTx">View</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/*
 * The @ping-pub/widget bundle injects its own tailwind+daisyUI build into
 * <head> at runtime (after our app CSS), which neutralizes our `.input`,
 * `bg-base-200`, etc. on this modal. Scope the modal styles under a unique
 * `.qbtc-tx-modal` ancestor so the cascade can't lose them.
 *
 * Not <style scoped> because Vue's scoped attribute selectors are weaker
 * than the widget's class selectors after CSSOM injection.
 */
.qbtc-tx-modal .modal-box {
  background-color: hsl(var(--b1));
  color: hsl(var(--bc));
}
.qbtc-tx-modal .modal-box .label {
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
}
.qbtc-tx-modal .modal-box .label-text {
  font-size: 0.875rem;
  color: hsl(var(--bc) / 0.7);
}
.qbtc-tx-modal .modal-box .label-text-alt {
  font-size: 0.75rem;
  color: hsl(var(--bc) / 0.6);
}
.qbtc-tx-modal .modal-box .input {
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 100%;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid hsl(var(--bc) / 0.15);
  color: hsl(var(--bc));
  outline: none;
}
.qbtc-tx-modal .modal-box .input:focus-within,
.qbtc-tx-modal .modal-box .input:focus {
  border-color: hsl(var(--p) / 0.6);
}
.qbtc-tx-modal .modal-box .input > input {
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: inherit;
  color: inherit;
}
.qbtc-tx-modal .modal-box .badge {
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: hsl(var(--b3));
  border: 0;
  border-radius: 0.375rem;
}
</style>
