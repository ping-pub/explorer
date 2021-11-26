<template>
  <div>
    <dl>
      <dt>Available {{ computeAccounts }}</dt>
      <dd class="d-flex justify-content-between mt-1">
        <feather-icon
          v-b-modal.trading-deposte-window
          icon="PlusSquareIcon"
        />
        <span> {{ available }} {{ type === 0 ? target: base }} </span>
      </dd>
    </dl>
    <dl>
      <dt>Price</dt>
      <dd class="d-flex justify-content-end mt-1">
        {{ price }} {{ target }}
      </dd>
    </dl>
    <dl>
      <dt>Fee</dt>
      <dd class="d-flex justify-content-end mt-1">
        {{ fee }}%
      </dd>
    </dl>
    <b-form-group>
      <label for="amount">
        Amount
      </label>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="amount"
          v-model="amount"
          type="number"
          placeholder="Amount"
          @change="changeAmount()"
        />
        <b-input-group-append is-text>
          {{ type === 0 ? target: base }}
        </b-input-group-append>
      </b-input-group>
      <b-alert
        variant="danger"
        :show="type === 1 && amount > available"
      >
        <div class="alert-body">
          Insufficient available amount
        </div>
      </b-alert>
    </b-form-group>
    <b-form-group>
      <label for="total">
        Total
      </label>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="total"
          v-model="total"
          type="number"
          placeholder="Total"
          @change="changeTotal()"
        />
        <b-input-group-append is-text>
          {{ type === 1 ? target: base }}
        </b-input-group-append>
      </b-input-group>
      <b-alert
        variant="danger"
        :show="type === 0 && total > available"
      >
        <div class="alert-body">
          Insufficient available amount
        </div>
      </b-alert>
    </b-form-group>
    <b-form-group>
      <label>
        Slippage Tolerance
      </label>
      <div>
        <b-form-radio
          v-model="slippage"
          value="0.01"
          button
          button-variant="outline-secondary"
        >
          1%
        </b-form-radio>
        <b-form-radio
          v-model="slippage"
          value="0.025"
          button
          block
          class="px-1"
          button-variant="outline-secondary"
        >
          2.5%
        </b-form-radio>
        <b-form-radio
          v-model="slippage"
          value="0.05"
          button
          button-variant="outline-secondary"
        >
          5%
        </b-form-radio>
      </div>
    </b-form-group>
    <b-form-group>
      <b-button
        v-if="address"
        block
        :variant="type === 0 ? 'success': 'danger'"
      >
        {{ type === 0 ? `Buy ${ base }` : `Sell ${ base }` }}
      </b-button>
      <b-button
        v-else
        to="/wallet/import"
        block
        variant="primary"
      >
        Connect Wallet
      </b-button>

    </b-form-group>
    <b-alert
      class="mt-2"
      variant="secondary"
      show
    >
      <div class="alert-heading">
        Note
      </div>
      <div class="alert-body">
        If the execution price exceeds the {{ slippage * 100 }}% slippage protection, your order will be automatically cancelled
      </div>
    </b-alert>

    <deposite-window />

  </div>
</template>

<script>
import {
  BFormInput, BButton, BAlert, BFormGroup, BInputGroup, BInputGroupAppend, BFormRadio,
} from 'bootstrap-vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import { /* abbrAddress, */ formatTokenAmount, getLocalAccounts, percent } from '@/libs/data'
import { getPairName } from '@/libs/osmos'
import DepositeWindow from './DepositeWindow.vue'

export default {
  components: {
    BAlert,
    BButton,
    BFormInput,
    BFormRadio,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    FeatherIcon,
    DepositeWindow,
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
    pool: {
      type: Object,
      default: () => {},
    },
    denomTrace: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      address: '',
      amount: 0,
      total: 0,
      slippage: 0.05,
      marks: [0, 0.01, 0.025, 0.05],
      balance: {},
      // base: '',
      // target: '',
    }
  },
  computed: {
    base() {
      return getPairName(this.pool, this.denomTrace, 'base')
    },
    target() {
      return getPairName(this.pool, this.denomTrace, 'target')
    },
    price() {
      const p1 = this.$store.state.chains.quotes[this.base]
      const p2 = this.$store.state.chains.quotes[this.target]
      return p1 && p2 ? (p1.usd / p2.usd).toFixed(4) : '-'
    },
    computeAccounts() {
      return ''
    },
    available() {
      if (this.pool && this.pool.poolAssets) {
        const mode = this.type === 1 ? 0 : 1
        const { denom } = this.pool.poolAssets[mode].token
        let amount = 0
        if (Array.isArray(this.balance)) {
          console.log('balance', this.balance)
          this.balance.forEach(x => {
            if (x.denom === denom) {
              amount = x.amount
            }
          })
        }
        return formatTokenAmount(amount, 6, denom)
      }
      return 0
    },
    fee() {
      if (this.pool) {
        return percent(this.pool.poolParams.swapFee)
      }
      return '-'
    },
  },
  created() {
    this.initialAddress()
    this.$http.getBankBalances(this.address).then(res => {
      if (res && res.length > 0) {
        this.balance = res
      }
    })
    this.$http.getAuthAccount(this.address, this.selectedChain).then(ret => {
      if (ret.value.base_vesting_account) {
        this.accountNumber = ret.value.base_vesting_account.base_account.account_number
        this.sequence = ret.value.base_vesting_account.base_account.sequence
        if (!this.sequence) this.sequence = 0
      } else {
        this.accountNumber = ret.value.account_number
        this.sequence = ret.value.sequence ? ret.value.sequence : 0
      }
    })
  },
  methods: {
    initialAddress() {
      const accounts = getLocalAccounts()
      const current = this.$store.state.chains.defaultWallet
      if (accounts && accounts[current]) {
        const acc = accounts[current].address.find(x => x.chain === 'osmosis')
        if (acc) {
          this.address = acc.addr
        }
      }
    },
    formatAvailable() {
    },
    changeAmount() {
      this.total = this.amount * this.price
    },
    changeTotal() {
      this.amount = this.total / this.price
    },
    submitTrade() {

    },
  },
}
</script>

<style lang="scss" scoped>

</style>
