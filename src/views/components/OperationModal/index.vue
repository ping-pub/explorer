<template>
  <b-modal
    id="operation-modal"
    centered
    size="md"
    :title="modalTitle"
    ok-title="Send"
    hide-header-close
    scrollable
    :ok-disabled="isOwner"
    @hidden="resetModal"
    @ok="handleOk"
    @show="initialize"
  >
    <b-overlay
      :show="isOwner"
      rounded="sm"
    >
      <template #overlay>
        <div class="text-center">
          <b-avatar
            icon="stopwatch"
            font-scale="3"
            animation="cylon"
          />
          <p id="cancel-label">
            {{ blockingMsg }}
          </p>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="outline-primary"
            to="/wallet/import"
          >
            Connect Wallet
          </b-button>
        </div>
      </template>
      <validation-observer ref="simpleRules">
        <b-form>
          <component
            :is="type"
            ref="component"
            :address="address"
            :validator-address="validatorAddress"
            :balance="balance"
            @update="componentUpdate"
          />
          <b-row>
            <b-col>
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
              <b-form-group>
                <b-form-checkbox
                  v-model="advance"
                  name="advance"
                  value="true"
                >
                  <small>Advanced</small>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="advance">
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

          <b-row>
            <b-col>
              <wallet-input-vue v-model="wallet" />
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      {{ error }}
    </b-overlay>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BAvatar, BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BButton, BInputGroupAppend, BFormCheckbox, BOverlay,
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

import WalletInputVue from '../WalletInput.vue'
import Delegate from './components/Delegate.vue'
import Redelegate from './components/Redelegate.vue'
import Withdraw from './components/Withdraw.vue'
import Unbond from './components/Unbond.vue'
import Transfer from './components/Transfer.vue'

export default {
  name: 'DelegateDialogue',
  components: {
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
  },
  directives: {
    Ripple,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
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
      modalTitle: '',
      historyName: '',
      selectedAddress: this.address,
      selectedValidator: null,
      selectedChain: null,
      token: '',
      chainId: '',
      balance: [],
      IBCDenom: {},
      error: null,
      sequence: 1,
      accountNumber: 0,
      advance: false,
      fee: '900',
      feeDenom: '',
      wallet: 'ledgerUSB',
      gas: '200000',
      memo: '',
      blockingMsg: 'No available account found.',

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
    isOwner() {
      const accounts = getLocalAccounts()
      const selectedWallet = this.$store.state.chains.defaultWallet
      if (accounts && accounts[selectedWallet]) {
        if (accounts[selectedWallet].address.findIndex(x => x.addr === this.address) > -1) {
          return false
        }
      }
      return true
    },
  },
  methods: {
    initialize() {
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
      this.$http.getBankBalances(this.selectedAddress).then(res => {
        if (res && res.length > 0) {
          this.balance = res.reverse()
          const token = this.balance.find(i => !i.denom.startsWith('ibc'))
          this.token = token.denom
          if (token) this.feeDenom = token.denom
        }
      })
      this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
      this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      // this.$refs.component.loadData()
    },
    componentUpdate(obj) {
      console.log(obj)
      Object.keys(obj).forEach(key => {
        this[key] = obj[key]
      })
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.$refs.simpleRules.validate().then(ok => {
        if (ok) {
          this.sendTx().then(ret => {
            console.log(ret)
            this.error = ret
          })
        }
      })
    },
    resetModal() {
      this.feeDenom = ''
      this.error = null
    },
    async sendTx() {
      const txMsgs = this.$refs.component.msg
      console.log(txMsgs)
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
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: this.historyName,
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('operation-modal')
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Transaction sent!',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
        }).catch(e => {
          console.log(e)
          this.error = e
        })
      }).catch(e => {
        console.log(e)

        this.error = e
      })
      return ''
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
