<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Sender"
          label-for="sender"
        >
          <b-input-group class="mb-25">

            <b-form-input
              name="sender"
              :value="address"
              readonly
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Recipient"
          label-for="Recipient"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="recipient"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="Recipient"
                v-model="recipient"
                :state="errors.length > 0 ? false:null"
              />
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Available Token"
          label-for="Token"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Token"
          >
            <b-form-select
              v-model="token"
            >
              <b-form-select-option
                v-for="item in balanceOptions"
                :key="item.denom"
                :value="item.denom"
              >
                {{ format(item) }}
              </b-form-select-option>
            </b-form-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Amount"
          label-for="Amount"
        >
          <validation-provider
            v-slot="{ errors }"
            rules="required|regex:^([0-9\.]+)$"
            name="amount"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="Amount"
                v-model="amount"
                :state="errors.length > 0 ? false:null"
                placeholder="Input a number"
                type="number"
              />
              <b-input-group-append is-text>
                {{ printDenom() }}
              </b-input-group-append>
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BRow, BCol, BInputGroup, BInputGroupAppend, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, formatTokenDenom, getUnitAmount,
} from '@/libs/utils'

export default {
  name: 'TransforDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    ValidationProvider,

  },
  props: {
    address: {
      type: String,
      default: '',
    },
    balance: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      token: '',
      amount: null,
      recipient: '',
      IBCDenom: {},

      required,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
    }
  },
  computed: {
    msg() {
      return [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: this.address,
            toAddress: this.recipient,
            amount: [
              {
                amount: getUnitAmount(this.amount, this.token),
                denom: this.token,
              },
            ],
          },
        },
      ]
    },
    balanceOptions() {
      return this.setupBalance()
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Transfer Tokens',
      historyName: 'send',
    })
  },

  methods: {
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom
        return this.balance
      }
      return []
    },
    format(v) {
      return formatToken(v, this.IBCDenom)
    },
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token)
    },

  },

}
</script>
