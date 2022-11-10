<template>
  <div>
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
            <b-form-input
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
              :selectable="(v) => v.value"
            />
          </b-form-group>
          <small class="text-danger">{{ errors[0] }}</small>
        </validation-provider>
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
                v-for="x in balanceOptions"
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
  formatToken, formatTokenDenom, getUnitAmount,
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
    balance: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedAddress: this.address,
      availableAddress: [],
      validators: [],
      unbundValidators: [],
      selectedValidator: this.validatorAddress,
      token: '',
      amount: null,
      selectedChain: '',
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
    valOptions() {
      let options = []
      const vals = this.validators.map(x => ({ value: x.operator_address, label: `${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
      if (vals.length > 0) {
        options.push({ value: null, label: '=== ACTIVE VALIDATORS ===' })
        options = options.concat(vals)
      }
      const unbunded = this.unbundValidators.map(x => ({ value: x.operator_address, label: `* ${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
      if (unbunded.length > 0) {
        options.push({ value: null, label: '=== INACTIVE VALIDATORS ===', disabled: true })
        options = options.concat(unbunded)
      }
      return options
    },
    balanceOptions() {
      return this.setupBalance()
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
    IBCDenom() {
      return this.$store.state.chains.denoms
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Delegate Token',
      historyName: 'delegate',
    })
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.getValidatorList().then(v => {
        this.validators = v
        if (!this.selectedValidator) {
          const r = Math.random()
          const index = (r * v.length).toFixed()
          this.selectedValidator = v[index].operator_address
        }
      })
      this.$http.getValidatorUnbondedList().then(v => {
        this.unbundValidators = v
      })
    },
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom
        return this.balance
      }
      return []
    },
    printDenom() {
      return formatTokenDenom(this.token)
    },
    format(v) {
      const conf = this.$http.getSelectedConfig()
      const decimal = conf.assets[0].exponent || '6'
      return formatToken(v, this.IBCDenom, decimal)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
