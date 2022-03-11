<template>
  <div>
    <b-card
      bg-variant="light-secondary"
      text-variant="black"
    >
      <div class="d-flex justify-content-between">
        <span class="font-weight-bolder">Balance </span>
        <span>
          <feather-icon
            v-if="currentDenom.startsWith('ibc/')"
            v-b-modal.trading-deposte-window
            icon="PlusSquareIcon"
            class="text-primary"
          />
          <small> {{ available }} {{ type === 0 ? target: base }} </small>
        </span>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <span class="font-weight-bolder">Price</span>
        <span>{{ price }}&nbsp;<small class="text-muted mx-10">{{ target }} ≈</small>&nbsp;1&nbsp;<small class="text-muted mx-10"> {{ base }}</small>&nbsp;</span>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <span class="font-weight-bolder">Swap Fee</span>
        <span>{{ fee }}%</span>
      </div>
    </b-card>
    <b-form-group>
      <div>
        <span>Quantity</span>
      </div>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="amount"
          v-model="amount"
          type="number"
          placeholder="Quantity"
          @change="changeAmount()"
        />
        <b-input-group-append is-text>
          {{ base }}
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
        <span>Volume</span>
        <span>
          <small
            v-if="localPrice > 0"
            class="text-muted mr-1"
          >≈${{ localPrice }}</small>
          <feather-icon
            id="popover-trading-setting"
            icon="SettingsIcon"
            class="text-primary"
          />
        </span>
      </div>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="total"
          v-model="total"
          type="number"
          placeholder="Volume"
          @change="changeTotal()"
        />
        <b-input-group-append is-text>
          {{ target }}
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
    <b-popover
      target="popover-trading-setting"
      placement="left"
      triggers="hover"
      boundary="scrollParent"
      boundary-padding="0"
      class="px-0"
    >
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
    </b-popover>
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
        :disabled="type === 0? total > available : amount > available"
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
      :show="dismissCountDown"
      dismissible
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <div class="alert-body">
        {{ error }}
      </div>
    </b-alert>
    <b-alert
      class="mt-2"
      variant="danger"
      show
    >
      <div class="alert-heading">
        Note
      </div>
      <div class="alert-body">
        Trading is not available. will open soon.
        <div class="d-none">
          If the execution price exceeds the {{ slippage * 100 }}% slippage protection, your order will be automatically cancelled
        </div>
      </div>
    </b-alert>

    <deposite-window
      :symbol="type === 0 ? target: base"
      :denom-trace="denomTrace[currentDenom]"
    />

  </div>
</template>

<script>
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const long_1 = __importDefault(require("long"));
import {
  BFormInput, BButton, BAlert, BFormGroup, BInputGroup, BInputGroupAppend, BFormRadio, BFormRadioGroup, BCard, BPopover,
} from 'bootstrap-vue'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'
import {
  formatTokenAmount, getLocalAccounts, percent, setLocalTxHistory, sign,
} from '@/libs/utils'
import { getPairName } from '@/libs/osmos'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import DepositeWindow from './DepositeWindow.vue'

export default {
  components: {
    BAlert,
    BButton,
    BCard,
    BFormInput,
    BFormRadio,
    BFormRadioGroup,
    BFormGroup,
    BPopover,
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
      dismissSecs: 15,
      dismissCountDown: 0,
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
      const p1 = this.$store.state.chains.quotes[this.target]
      return p1 && this.total > 0 ? (p1.usd * this.total).toFixed(2) : '-'
    },
    currentDenom() {
      if (this.pool && this.pool.poolAssets) {
        const mode = this.type === 1 ? 0 : 1
        const { denom } = this.pool.poolAssets[mode].token
        return denom
      }
      return ''
    },
    available() {
      if (this.pool && this.pool.poolAssets) {
        let amount = 0
        if (Array.isArray(this.balance)) {
          this.balance.forEach(x => {
            if (x.denom === this.currentDenom) {
              amount = x.amount
            }
          })
        }
        return formatTokenAmount(amount, 6, this.currentDenom)
      }
      return 0
    },
    fee() {
      return percent(this.pool?.poolParams?.swapFee || '')
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
      const { chain } = this.$route.params
      const accounts = getLocalAccounts()
      const current = this.$store.state.chains.defaultWallet
      if (accounts && accounts[current]) {
        const acc = accounts[current].address.find(x => x.chain === chain)
        if (acc) {
          this.address = acc.addr
        }
      }
    },
    formatAvailable() {
    },
    changeAmount() {
      this.total = parseFloat((this.amount * this.price).toFixed(6))
    },
    changeTotal() {
      this.amount = parseFloat((this.total / this.price).toFixed(6))
    },
    async sendTx() {
      const tokenOutDenom = this.pool.poolAssets[this.type === 0 ? 0 : 1].token.denom
      const { denom } = this.pool.poolAssets[this.type === 0 ? 1 : 0].token
      const txMsgs = [
        {
          typeUrl: '/osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
          value: {
            sender: this.address,
            routes: [
              {
                poolId: long_1.default.fromString(this.pool.id),
                tokenOutDenom,
              },
            ],
            tokenIn: {
              denom,
              amount: long_1.default.fromNumber(parseInt(this.amount * 1000000, 10)),
            },
            tokenOutMinAmount: long_1.default.fromNumber(parseInt(this.total * 1000000, 10)),
          },
        },
      ]

      if (txMsgs.length === 0) {
        this.error = 'No delegation found'
        this.dismissCountDown = this.dismissSecs
        return ''
      }
      if (!this.accountNumber) {
        this.error = 'Account number should not be empty!'
        this.dismissCountDown = this.dismissSecs
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

      sign(
        this.wallet,
        this.chainId,
        this.address,
        txMsgs,
        txFee,
        'Sent Via https://ping.pub',
        signerData,
      ).then(bodyBytes => {
        this.$http.broadcastTx(bodyBytes).then(res => {
          setLocalTxHistory({ op: 'swap', hash: res.tx_response.txhash, time: new Date() })
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Transaction sent!',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
        }).catch(e => {
          this.error = e
        })
      }).catch(e => {
        this.error = e
        this.dismissCountDown = this.dismissSecs
      })
      // Send tokens
      // return client.sendTokens(this.address, this.recipient, sendCoins, this.memo)
      return ''
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
