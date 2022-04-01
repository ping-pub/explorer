<template>
  <div>
    <b-row>
      <b-col>
        <h4>{{ proposalId }}. {{ proposalTitle }}</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Depositor"
          label-for="Voter"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Voter"
          >
            <b-form-input
              v-model="address"
              readonly
            />
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
  BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect,
  BInputGroupAppend, BFormSelectOption,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, formatTokenDenom, getUnitAmount,
} from '@/libs/utils'

export default {
  name: 'DepositDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BInputGroupAppend,
    BFormSelectOption,
    ValidationProvider,
  },
  props: {
    proposalId: {
      type: Number,
      required: true,
    },
    proposalTitle: {
      type: String,
      required: true,
    },
    balance: {
      type: Array,
      default: () => [],
    },
    address: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      token: null,
      amount: '',

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
      return [{
        typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
        value: {
          depositor: this.address,
          proposalId: String(this.proposalId),
          amount: [
            {
              amount: getUnitAmount(this.amount, this.token),
              denom: this.token,
            },
          ],
        },
      }]
    },
    balanceOptions() {
      return this.setupBalance()
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Deposit',
      historyName: 'deposit',
    })
  },
  methods: {
    printDenom() {
      return formatTokenDenom(this.token)
    },
    format(v) {
      return formatToken(v)
    },
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom
        return this.balance
      }
      return []
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
