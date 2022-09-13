<template>
  <b-modal
    :id="modalId"
    centered
    size="md"
    :title="modalTitle"
    scrollable
    :hide-header-close="false"
    :hide-footer="showResult"
    modal-class="custom-transaction-modal"
    @hidden="resetModal"
    @show="initialize"
  >
    <b-overlay
      :show="!isOwner"
      rounded="sm"
    >
      <template #overlay>
        <div
          class="text-center"
        >
          <b-avatar
            font-scale="3"
            variant="danger"
            animation="cylon"
          >
            <feather-icon
              icon="XCircleIcon"
              size="16"
            />
          </b-avatar>
          <p class="mt-1 font-weight-bolder">
            {{ blockingMsg }}
          </p>
        </div>
      </template>
      <validation-observer
        v-if="!showResult"
        ref="simpleRules"
      >
        <b-form>
          <component
            :is="type"
            ref="component"
            :address="selectedAddress"
            :validator-address="validatorAddress"
            :balance="balance"
            :proposal-id="proposalId"
            :proposal-title="proposalTitle"
            :to-address="toAddress"
            @update="componentUpdate"
          />
          <b-row v-if="advance">
            <b-col cols="12">
              <b-form-group
                label="Fee"
                label-for="Fee"
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|integer"
                  name="fee"
                >
                  <b-input-group>
                    <b-form-input v-model="fee" />
                    <b-input-group-append>
                      <b-form-select
                        v-model="feeDenom"
                        :options="feeDenoms"
                        value-field="denom"
                        text-field="denom"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Gas"
                label-for="gas"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="gas"
                >
                  <b-form-input
                    id="gas"
                    v-model="gas"
                    type="number"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Memo"
                label-for="Memo"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="memo"
                >
                  <b-form-input
                    id="Memo"
                    v-model="memo"
                    max="2"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="advance">
            <b-col>
              <wallet-input-vue v-model="wallet" />
            </b-col>
          </b-row>
        </b-form>
        <b-alert
          v-model="showDismissibleAlert"
          variant="danger"
          dismissible
        >
          <div class="alert-body">
            <span>{{ error }}</span>
          </div>
        </b-alert>
      </validation-observer>

      <TransactionResult
        v-else
        :hash="txHash"
        :selected-chain="selectedChain"
      />
    </b-overlay>
    <template #modal-footer>
      <div class="d-flex justify-content-between w-100">
        <div id="left-footer">
          <b-form-checkbox
            v-if="isOwner"
            v-model="advance"
            name="advance"
            value="true"
          >
            <small>Advanced</small>
          </b-form-checkbox>
        </div>
        <b-button
          v-if="isOwner"
          variant="primary"
          @click="handleOk"
        >
          {{ actionName }}
        </b-button>
        <b-button
          v-else
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="outline-primary"
          to="/wallet/import"
        >
          Connect Wallet
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BAvatar, BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BButton, BInputGroupAppend, BFormCheckbox, BOverlay, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  extractAccountNumberAndSequence, getLocalAccounts, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import WalletInputVue from './WalletInput.vue'
import Delegate from './components/Delegate.vue'
import Redelegate from './components/Redelegate.vue'
import Withdraw from './components/Withdraw.vue'
import Unbond from './components/Unbond.vue'
import Transfer from './components/Transfer.vue'
import IBCTransfer from './components/IBCTransfer.vue'
import Vote from './components/Vote.vue'
import WithdrawCommission from './components/WithdrawCommission.vue'
import GovDeposit from './components/GovDeposit.vue'
import TransactionResult from './TransactionResult.vue'

export default {
  name: 'DelegateDialogue',
  components: {
    BAlert,
    BAvatar,
    BModal,
    BRow,
    BCol,
    BForm,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    BFormCheckbox,
    vSelect,
    BButton,
    BInputGroupAppend,
    BOverlay,
    WalletInputVue,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    Delegate,
    Redelegate,
    Withdraw,
    Unbond,
    Transfer,
    IBCTransfer,
    Vote,
    WithdrawCommission,
    GovDeposit,
    TransactionResult,
  },
  directives: {
    Ripple,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    modalId: {
      type: String,
      default: 'operation-modal',
    },
    validatorAddress: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    proposalId: {
      type: Number,
      default: null,
    },
    proposalTitle: {
      type: String,
      default: null,
    },
    selectedChainName: {
      type: String,
      default: null,
    },
    toAddress: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      modalTitle: '',
      historyName: '',
      selectedValidator: null,
      token: '',
      chainId: '',
      balance: [],
      IBCDenom: {},
      error: null,
      showDismissibleAlert: false,
      sequence: 1,
      accountNumber: 0,
      advance: false,
      fee: '900',
      feeDenom: '',
      wallet: 'ledgerUSB',
      gas: '250000',
      memo: '',
      blockingMsg: this.address ? 'You are not the owner' : 'No available account found.',
      actionName: 'Send',
      showResult: false,
      txHash: '',

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
    feeDenoms() {
      if (!this.balance) return []
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
    accounts() {
      const accounts = getLocalAccounts()
      const selectedWallet = this.$store.state.chains.defaultWallet
      return accounts ? accounts[selectedWallet] : null
    },
    isOwner() {
      if (this.accounts) {
        this.updateWallet(this.accounts.device)
        if (this.accounts.address.findIndex(x => x.addr === this.selectedAddress) > -1) {
          return true
        }
      }
      return false
    },
    selectedAddress() {
      if (this.address) {
        return this.address
      }
      if (this.accounts) {
        const chain = this.$store.state.chains.selected.chain_name
        const selectedAddress = this.accounts?.address.find(x => x.chain === chain)
        return selectedAddress?.addr
      }
      return null
    },
    selectedChain() {
      let config = null
      const allChains = localStorage.getItem('chains')
      if (allChains && this.selectedChainName) {
        config = JSON.parse(allChains)[this.selectedChainName]
      }
      return config
    },
  },
  methods: {
    initialize() {
      if (this.isOwner && this.selectedAddress) {
        this.$http.getLatestBlock().then(ret => {
          this.chainId = ret.block.header.chain_id
          const notSynced = timeIn(ret.block.header.time, 10, 'm')
          if (notSynced) {
            this.error = 'Client is not synced or blockchain is halted'
          } else {
            this.error = null
          }
        })
        this.$http.getAuthAccount(this.selectedAddress).then(ret => {
          const account = extractAccountNumberAndSequence(ret)
          this.accountNumber = account.accountNumber
          this.sequence = account.sequence
        })
        this.$http.getBankBalances(this.selectedAddress, this.selectedChain).then(res => {
          if (res.balances && res.balances.length > 0) {
            this.balance = res.balances.reverse()
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            this.token = token.denom
            if (token) this.feeDenom = token.denom
          }
        })
        this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
        this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      }
    },
    componentUpdate(obj) {
      Object.keys(obj).forEach(key => {
        this[key] = obj[key]
      })
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      if (!this.fee) {
        this.error = 'fee is required'
        return
      } if (!this.feeDenom) {
        this.error = 'fee symbol is required'
        return
      } if (!this.accountNumber) {
        this.error = 'Account number is required'
        return
      } if (!this.sequence) {
        this.error = 'Sequence is required'
        return
      } if (!this.chainId) {
        this.error = 'Chain Id is required'
        return
      }
      this.$refs.simpleRules.validate().then(ok => {
        if (ok) {
          this.sendTx().then(ret => {
            this.error = ret
          })
        }
      })
    },
    resetModal() {
      this.feeDenom = ''
      this.error = null
      this.showResult = false
    },
    async sendTx() {
      const txMsgs = this.$refs.component.msg

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
            amount: this.fee,
            denom: this.feeDenom,
          },
        ],
        gas: this.gas,
      }

      const signerData = {
        accountNumber: this.accountNumber,
        sequence: this.sequence,
        chainId: this.chainId,
      }

      sign(
        this.wallet,
        this.chainId,
        this.selectedAddress,
        txMsgs,
        txFee,
        this.memo,
        signerData,
      ).then(bodyBytes => {
        this.showResult = true
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          this.txHash = res.tx_response.txhash
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: this.historyName,
            hash: res.tx_response.txhash,
            time: new Date(),
          })
        }).catch(e => {
          this.showResult = false
          this.error = e
          this.showDismissibleAlert = true
        })
      }).catch(e => {
        this.showResult = false
        this.error = e
        this.showDismissibleAlert = true
      })
      return ''
    },
    updateWallet(v) {
      if (v && v === 'address') {
        this.wallet = 'keplr'
      } else {
        this.wallet = v
      }
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.custom-transaction-modal {
  .modal-header {
    .modal-title {
      font-size: 24px;
    }
    .close {
      margin: 0;
    }
  }
}
</style>
