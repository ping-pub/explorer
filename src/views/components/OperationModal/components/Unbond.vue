<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Delegator"
          label-for="Account"
        >
          <b-form-input
            v-model="address"
            readonly
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Validator"
          label-for="validator"
        >
          <v-select
            :value="validatorAddress"
            :options="valOptions"
            :reduce="val => val.value"
            placeholder="Select a validator"
            :disabled="true"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Current Delegation"
          label-for="Token"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Token"
          >
            <v-select
              v-model="token"
              :options="tokenOptions"
              :reduce="token => token.value"
            />
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
  BRow, BCol, BInputGroup, BFormInput, BFormGroup, BInputGroupAppend,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, formatTokenDenom, getUnitAmount,
} from '@/libs/utils'
import vSelect from 'vue-select'

export default {
  name: 'UnbondDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BFormGroup,
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
      validators: [],
      token: '',
      amount: null,
      delegations: [],

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
      return this.validators.map(x => ({ value: x.operator_address, label: `${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
    },
    tokenOptions() {
      if (!this.delegations) return []
      return this.delegations.filter(x => x.delegation.validator_address === this.validatorAddress).map(x => ({ value: x.balance.denom, label: formatToken(x.balance) }))
    },
    msg() {
      return [{
        typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
        value: {
          delegatorAddress: this.address,
          validatorAddress: this.validatorAddress,
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
      modalTitle: 'Unbond Token',
      historyName: 'unbond',
    })
    this.loadData()
  },

  methods: {
    loadData() {
      if (this.address) {
        this.$http.getValidatorList().then(v => {
          this.validators = v
        })
      }
      this.$http.getStakingDelegations(this.address).then(res => {
        this.delegations = res.delegation_responses
        this.delegations.forEach(x => {
          if (x.delegation.validator_address === this.validatorAddress) {
            this.token = x.balance.denom
            this.$emit('update', {
              feeDenom: x.balance.denom,
            })
          }
        })
      })
    },
    printDenom() {
      return formatTokenDenom(this.token)
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
