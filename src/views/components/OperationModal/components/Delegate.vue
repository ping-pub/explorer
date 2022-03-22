<template>
  <div>
    <b-row>
      <b-col>
        <validation-provider
          #default="{ errors }"
          rules="required"
          name="Validator"
        >
          <b-form-group
            label="Validator"
            label-for="validator"
          >
            <v-select
              v-model="selectedValidator"
              :options="valOptions"
              :reduce="val => val.value"
              placeholder="Select a validator"
              :readonly="validatorAddress"
            />
          </b-form-group>
          <small class="text-danger">{{ errors[0] }}</small>
        </validation-provider>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Delegator"
          label-for="Delegator"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Delegator"
          >
            <b-form-select
              v-if="account.length > 0"
              v-model="selectedAddress"
              :options="account"
              text-field="label"
              @change="onChange"
            />
            <b-form-input
              v-else
              v-model="selectedAddress"
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
              text-field="label"
            >
              <b-form-select-option
                v-for="x in balance"
                :key="x.denom"
                :value="x.denom"
              >
                {{ format(x) }}
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
            <b-input-group>
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
  BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BInputGroupAppend,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  abbrAddress, formatToken, formatTokenDenom, getLocalAccounts, getUnitAmount, extractAccountNumberAndSequence,
} from '@/libs/utils'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    vSelect,
    BInputGroupAppend,

    ValidationProvider,
  },
  props: {
    validatorAddress: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedAddress: this.address,
      availableAddress: [],
      validators: [],
      unbundValidators: [],
      selectedValidator: null,
      token: '',
      amount: null,
      chainId: '',
      selectedChain: '',
      balance: [],
      delegations: [],
      IBCDenom: {},
      memo: '',
      feeDenom: '',
      wallet: 'ledgerUSB',
      error: null,
      sequence: 1,
      accountNumber: 0,
      advance: false,
      gas: '200000',

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
      account: [],
    }
  },
  computed: {
    valOptions() {
      const vals = this.validators.map(x => ({ value: x.operator_address, label: `${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
      const unbunded = this.unbundValidators.map(x => ({ value: x.operator_address, label: `* ${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
      return vals.concat(unbunded)
    },
    feeDenoms() {
      if (!this.balance) return []
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
    msg() {
      return [{
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress: this.selectedAddress,
          validatorAddress: this.selectedValidator,
          amount: {
            amount: getUnitAmount(this.amount, this.token),
            denom: this.token,
          },
        },
      }]
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Delegate Token',
      historyName: 'delegate',
    })
    this.loadBalance()
  },
  methods: {
    loadBalance() {
      this.account = this.computeAccount()
      this.$http.getValidatorList().then(v => {
        this.validators = v
      })
      this.$http.getValidatorUnbondedList().then(v => {
        this.unbundValidators = v
      })
      this.onChange()
    },

    onChange() {
      if (this.selectedAddress) {
        this.$http.getBankBalances(this.selectedAddress).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse()
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            this.token = token.denom
            if (token) this.feeDenom = token.denom
            this.balance.filter(i => i.denom.startsWith('ibc')).forEach(x => {
              if (!this.IBCDenom[x.denom]) {
                this.$http.getIBCDenomTrace(x.denom).then(denom => {
                  this.IBCDenom[x.denom] = denom.denom_trace.base_denom
                })
              }
            })
          }
        })
        this.$http.getAuthAccount(this.selectedAddress).then(ret => {
          const account = extractAccountNumberAndSequence(ret)
          this.$emit('update', {
            accountNumber: account.accountNumber,
            sequence: account.sequence,
          })
        })
      }
    },
    computeAccount() {
      const accounts = getLocalAccounts()
      const values = accounts ? Object.values(accounts) : []
      let array = []
      for (let i = 0; i < values.length; i += 1) {
        const addrs = values[i].address.filter(x => x.chain === this.$route.params.chain)
        if (addrs && addrs.length > 0) {
          array = array.concat(addrs.map(x => ({ value: x.addr, label: values[i].name.concat(' - ', abbrAddress(x.addr)) })))
          if (!this.selectedAddress) {
            this.selectedAddress = addrs[0].addr
          }
        }
      }
      this.selectedValidator = this.validatorAddress
      return array
    },
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token)
    },

    format(v) {
      return formatToken(v, this.IBCDenom)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
