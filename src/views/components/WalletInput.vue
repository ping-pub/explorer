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
          value="pingKMS"
          class="d-none d-md-block"
        >
          Ping KMS
        </b-form-radio>
        <b-form-radio
          name="wallet"
          value="ledgerUSB"
        >
          <small>Ledger(USB)</small>
        </b-form-radio>
        <b-form-radio
          name="wallet"
          value="ledgerBle"
          class="mr-0"
        >
          <small>Ledger(Bluetooth)</small>
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
    },
  },
}
</script>
