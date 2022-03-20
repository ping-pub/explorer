<template>
  <b-modal
    id="operation-modal"
    centered
    size="md"
    title="Delegate Token"
    ok-title="Send"
    hide-header-close
    scrollable
    :ok-disabled="!selectedAddress"
    @hidden="resetModal"
    @ok="handleOk"
    @show="loadBalance"
  >
    <b-overlay
      :show="!selectedAddress"
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
            No available account found.
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
            :validator-address.sync="selectedValidator"
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
  abbrAddress, extractAccountNumberAndSequence, getLocalAccounts, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import WalletInputVue from '../WalletInput.vue'
import Delegate from './components/Delegate.vue'

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
      fee: '900',
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
    }
  },
  computed: {
    feeDenoms() {
      if (!this.balance) return []
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
  },
  created() {
    // console.log('address: ', this.address)
  },
  methods: {
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
    loadBalance() {
      this.account = this.computeAccount()
      // if (this.account && this.account.length > 0) this.selectedAddress
      this.$http.getValidatorList().then(v => {
        this.validators = v
      })
      this.$http.getValidatorUnbondedList().then(v => {
        this.unbundValidators = v
      })
      this.$http.getLatestBlock().then(ret => {
        this.chainId = ret.block.header.chain_id
        const notSynced = timeIn(ret.block.header.time, 10, 'm')
        if (notSynced) {
          this.error = 'Client is not synced or blockchain is halted'
        } else {
          this.error = null
        }
      })
      this.getAuthAccount()
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
      this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
      this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
    },
    getAuthAccount(address = this.selectedAddress) {
      this.$http.getAuthAccount(address).then(ret => {
        const account = extractAccountNumberAndSequence(ret)
        console.log(account)
        this.accountNumber = account.accountNumber
        this.sequence = account.sequence
      })
    },
    handleOk(bvModalEvt) {
      // console.log('send')
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      // this.handleSubmit()
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
        this.$http.broadcastTx(bodyBytes).then(res => {
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: 'delegate',
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('delegate-window')
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
