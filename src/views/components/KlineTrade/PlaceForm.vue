<template>
  <div>
    <dl class="d-none">
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
      <dd class="d-flex justify-content-end mt-1 align-items-end font-weight-bolder">
        1&nbsp;<small class="text-muted mx-10"> {{ base }} ≈</small>&nbsp;{{ price }}&nbsp;<small class="text-muted mx-10">{{ target }}</small>
      </dd>
    </dl>
    <dl>
      <dt>Swap Fee</dt>
      <dd class="d-flex justify-content-end mt-1 font-weight-bolder">
        {{ fee }}%
      </dd>
    </dl>
    <b-form-group>
      <div class="d-flex justify-content-between">
        <span>Amount</span>
        <small class="text-muted">Available {{ available }} {{ type === 0 ? target: base }}
          <feather-icon
            v-b-modal.trading-deposte-window
            icon="PlusSquareIcon"
          /></small>
      </div>
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
      <div class="d-flex justify-content-between">
        <span>Total</span>
        <small class="text-muted">≈${{ localPrice }}</small>
      </div>
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
    <b-form-group class="d-none">
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
    <b-form-group
      label="Signer"
      label-for="wallet"
    >
      <b-form-radio-group
        v-model="wallet"
        inline
      >
        <b-form-radio
          v-model="wallet"
          name="wallet"
          value="keplr"
        >
          <small>Keplr</small>
        </b-form-radio>
        <b-form-radio
          v-model="wallet"
          name="wallet"
          value="ledgerUSB"
        >
          <small>Ledger(USB)</small>
        </b-form-radio>
        <b-form-radio
          v-model="wallet"
          name="wallet"
          value="ledgerBle"
          class="mr-0"
        >
          <small>Ledger(BLE)</small>
        </b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group>
      <b-button
        v-if="address"
        block
        :variant="type === 0 ? 'success': 'danger'"
        @click="sendTx()"
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
      variant="danger"
      show
    >
      <div class="alert-body">
        {{ error }}
      </div>
    </b-alert>
    <b-alert
      class="mt-2"
      variant="secondary"
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
  BFormInput, BButton, BAlert, BFormGroup, BInputGroup, BInputGroupAppend, BFormRadio, BFormRadioGroup,
} from 'bootstrap-vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import {
  formatTokenAmount, getLocalAccounts, percent, sign,
} from '@/libs/data'
import { getPairName } from '@/libs/osmos'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import DepositeWindow from './DepositeWindow.vue'

export default {
  components: {
    BAlert,
    BButton,
    BFormInput,
    BFormRadio,
    BFormRadioGroup,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    FeatherIcon,
    DepositeWindow,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
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
      amount: '',
      total: '',
      slippage: 0.05,
      marks: [0, 0.01, 0.025, 0.05],
      balance: {},
      error: null,
      chainId: 'osmosis-1',
      wallet: 'keplr',
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
    localPrice() {
      const p1 = this.$store.state.chains.quotes[this.type === 1 ? this.target : this.base]
      return p1 && this.total > 0 ? (p1.usd * this.total).toFixed(2) : '-'
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
      if (this.type === 0) {
        this.total = this.amount / this.price
      } else {
        this.total = this.amount * this.price
      }
    },
    changeTotal() {
      if (this.type === 0) {
        this.amount = this.total * this.price
      } else {
        this.amount = this.total / this.price
      }
    },
    async sendTx() {
      const tokenOutDenom = this.pool.poolAssets[this.type === 0 ? 0 : 1].token.denom
      const { denom } = this.pool.poolAssets[this.type === 0 ? 1 : 0].token
      const txMsgs = [
        {
          type: 'osmosis/gamm/swap-exact-amount-in',
          value: {
            sender: this.address,
            routes: [
              {
                poolId: this.pool.id,
                tokenOutDenom,
              },
            ],
            tokenIn: {
              denom,
              amount: String(this.amount),
            },
            tokenOutMinAmount: String(this.total),
          },
        },
      ]

      if (txMsgs.length === 0) {
        this.error = 'No delegation found'
        return ''
      }
      if (!this.accountNumber) {
        this.error = 'Account number should not be empty!'
        return ''
      }

      const txFee = {
        amount: [
          {
            amount: '800', // this.fee,
            denom: 'uomos', // this.feeDenom,
          },
        ],
        gas: '200000', // this.gas,
      }

      const signerData = {
        accountNumber: this.accountNumber,
        sequence: this.sequence,
        chainId: this.chainId,
      }

      console.log('trade: ', this.wallet, this.chainId, this.address, txMsgs, txFee, signerData)

      sign(
        this.wallet,
        this.chainId,
        this.address,
        txMsgs,
        txFee,
        'Sent Via https://ping.pub',
        signerData,
      ).then(bodyBytes => {
        console.log('signed:', bodyBytes)
        // this.$http.broadcastTx(bodyBytes).then(res => {
        //   setLocalTxHistory({ op: 'swap', hash: res.tx_response.txhash, time: new Date() })
        //   this.$toast({
        //     component: ToastificationContent,
        //     props: {
        //       title: 'Transaction sent!',
        //       icon: 'EditIcon',
        //       variant: 'success',
        //     },
        //   })
        // }).catch(e => {
        //   this.error = e
        // })
      }).catch(e => {
        this.error = e
      })
      // Send tokens
      // return client.sendTokens(this.address, this.recipient, sendCoins, this.memo)
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
