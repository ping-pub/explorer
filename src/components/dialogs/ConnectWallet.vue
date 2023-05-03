<script lang="ts" setup>
import { Wallet } from '@injectivelabs/wallet-ts';
import { useWalletStore } from '@/stores'

import MetaLogo from '@/assets/wallet/metamask.png';
import KeplrLogo from '@/assets/wallet/keplr.png';
import LedgerLogo from '@/assets/wallet/ledger.png';

const isDialogVisible = ref(false)


interface WalletItem {
  logo: string;
  name: string;
  wallet: Wallet;
  discription: string;
}

const wallets: WalletItem[] = [
  {
    logo: MetaLogo,
    name: 'Metamask',
    wallet: Wallet.Metamask,
    discription: '',
  },
  {
    logo: KeplrLogo,
    name: 'Keplr',
    wallet: Wallet.Keplr,
    discription: '',
  },
  {
    logo: LedgerLogo,
    name: 'Ledger',
    wallet: Wallet.Ledger,
    discription: '',
  },
];

const store = useWalletStore();
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        Connect Wallet
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="Connect Wallet">
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="isDialogVisible = false"
      />

      <VCardText>

      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="error"
          @click="isDialogVisible = false"
        >
          Disagree
        </VBtn>
        <VBtn
          color="success"
          @click="isDialogVisible = false"
        >
          Agree
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>