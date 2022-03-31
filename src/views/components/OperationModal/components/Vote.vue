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
          label="Voter"
          label-for="Account"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Voter"
          >
            <b-form-select
              v-model="voter"
              :options="accounts"
              text-field="label"
              placeholder="Select an address"
              @change="onChange"
            />
            <small class="text-danger">{{ errors[0] }} <strong v-if="!accounts || accounts.length === 0">Please import an account first!</strong> </small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Option"
          label-for="option"
        >
          <div class="demo-inline-spacing">

            <b-form-radio
              v-model="option"
              name="option"
              value="1"
              class="custom-control-success"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="option"
              name="option"
              value="3"
              class="custom-control-warning"
            >
              No
            </b-form-radio>
            <b-form-radio
              v-model="option"
              name="option"
              value="4"
              class="custom-control-danger"
            >
              No With Veto
            </b-form-radio>
            <b-form-radio
              v-model="option"
              name="option"
              value="2"
              class="custom-control-secondary"
            >
              Abstain
            </b-form-radio>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BRow, BCol, BFormGroup, BFormSelect,
  BFormRadio,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  abbrAddress,
  formatToken, getLocalAccounts,
} from '@/libs/utils'

export default {
  name: 'VoteDialogue',
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BFormRadio,
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
  },
  data() {
    return {
      accounts: [],
      voter: null,
      option: null,
      balance: [],
      feeDenom: '',

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
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          voter: this.voter,
          proposalId: this.proposalId,
          option: Number(this.option),
        },
      }]
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Vote',
      historyName: 'vote',
    })
    this.loadData()
  },
  methods: {
    computeAccount() {
      let array = []
      const accounts = getLocalAccounts()
      if (accounts) {
        const values = Object.values(accounts)
        for (let i = 0; i < values.length; i += 1) {
          const addrs = values[i].address.filter(x => x.chain === this.$route.params.chain)
          if (addrs && addrs.length > 0) {
            array = array.concat(addrs.map(x => ({ value: x.addr, label: values[i].name.concat(' - ', abbrAddress(x.addr)) })))
          }
        }
      }
      return array
    },
    onChange() {
      if (this.voter) {
        this.$http.getBankBalances(this.voter).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse()
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            if (token) this.feeDenom = token.denom
          }
        })
      }
    },
    loadData() {
      this.accounts = this.computeAccount()
      // eslint-disable-next-line prefer-destructuring
      if (this.accounts && this.accounts.length > 0) this.voter = this.accounts[0].value
      this.onChange()
    },
    format(v) {
      return formatToken(v)
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
