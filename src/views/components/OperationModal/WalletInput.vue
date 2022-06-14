<template>
  <b-form-group
    label="Wallet"
    label-for="wallet"
  >
    <validation-provider
      v-slot="{ errors }"
      rules="required"
      name="wallet"
    >
      <b-form-radio-group
        v-model="content"
        stacked
        @input="handleInput()"
      >
        <b-form-radio
          name="wallet"
          value="keplr"
          class="d-none d-md-block"
        >
          Keplr
        </b-form-radio>
        <b-form-radio
          name="wallet"
          value="metamask"
          class="d-none d-md-block"
        >
          Metamask
        </b-form-radio>
        <b-form-radio
          name="wallet"
          value="ledgerUSB"
        >
          Ledger (USB)
        </b-form-radio>
        <b-form-radio
          name="wallet"
          value="ledgerBle"
          class="mr-0"
        >
          Ledger (Bluetooth)
        </b-form-radio>
      </b-form-radio-group>
      <small class="text-danger">{{ errors[0] }}</small>
    </validation-provider>
  </b-form-group>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BFormRadioGroup, BFormRadio, BFormGroup,
} from 'bootstrap-vue'
import { getLocalAccounts } from '@/libs/utils'

export default {
  name: 'WalletInput',
  components: {
    BFormRadioGroup,
    BFormRadio,
    BFormGroup,
    ValidationProvider,
  },
  props: {
    value: {
      type: String,
      default: 'keplr',
    },
  },
  data() {
    return {
      content: this.value,
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.content)
      const accounts = getLocalAccounts()
      const wallet = accounts[this.$store.state.chains.defaultWallet]
      if (wallet) {
        wallet.device = this.content
        localStorage.setItem('accounts', JSON.stringify(accounts)) // update signer device
      }
    },
  },
}
</script>
