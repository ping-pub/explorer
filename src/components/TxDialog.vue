<script lang="ts" setup>
import { computed } from 'vue';
import { useTxDialog, useBlockchain } from '@/stores';
import QbtcTxDialog from './QbtcTxDialog.vue';

const store = useTxDialog();
const chainStore = useBlockchain();

// QBTC can't use the CDN `<ping-tx-dialog>` widget — its signer factory only
// knows Kepler/Leap/Metamask/Ledger and it signs with secp256k1, not ML-DSA.
// Render a QBTC-native modal that talks to `window.vultisig.qbtc` directly.
const isQbtc = computed(() => chainStore.current?.bech32Prefix === 'qbtc');
</script>
<template>
  <QbtcTxDialog v-if="isQbtc" @confirmed="store.confirmed" />
  <ping-tx-dialog
    v-else
    :type="store.type"
    :sender="store.sender"
    :endpoint="store.endpoint"
    :params="store.params"
    :hd-path="store.hdPaths"
    :registry-name="chainStore.current?.prettyName || chainStore.chainName"
    @view="store.view"
    @confirmed="store.confirmed"
  ></ping-tx-dialog>
</template>
