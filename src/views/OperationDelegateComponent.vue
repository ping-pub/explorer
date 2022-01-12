<template>
  <div>
    <b-modal
      id="delegate-window"
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
                <b-form-group
                  label="Wallet"
                  label-for="wallet"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="wallet"
                  >
                    <b-form-radio-group
                      v-model="wallet"
                      stacked
                      class="demo-inline-spacing"
                    >
                      <b-form-radio
                        v-model="wallet"
                        name="wallet"
                        value="keplr"
                        class="d-none d-md-block"
                      >
                        Keplr
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
                        <small>Ledger(Bluetooth)</small>
                      </b-form-radio>
                    </b-form-radio-group>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
        {{ error }}
      </b-overlay></b-modal>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BAvatar, BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BFormRadioGroup, BFormRadio, BButton, BInputGroupAppend, BFormCheckbox, BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  abbrAddress, extractAccountNumberAndSequence, formatToken, formatTokenDenom, getLocalAccounts, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

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
    BFormRadioGroup,
    BFormRadio,
    BFormCheckbox,
    vSelect,
    BButton,
    BInputGroupAppend,
    BOverlay,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  directives: {
    Ripple,
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
    valOptions() {
      return this.validators.map(x => ({ value: x.operator_address, label: `${x.description.moniker} (${Number(x.commission.rate) * 100}%)` }))
    },
    feeDenoms() {
      if (!this.balance) return []
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
  },
  created() {
    // console.log('address: ', this.address)
  },
  methods: {
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token)
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
        this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
        this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      }
      // this.$http.getStakingDelegations(this.selectedAddress).then(res => {
      //   this.delegations = res.delegation_responses
      // })
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
    loadBalance() {
      this.account = this.computeAccount()
      // if (this.account && this.account.length > 0) this.selectedAddress
      this.$http.getValidatorList().then(v => {
        this.validators = v
      })
      this.onChange()
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
            // console.log(ret)
            this.error = ret
          })
        }
      })
    },
    resetModal() {
      this.feeDenom = ''
      this.error = null
    },
    format(v) {
      return formatToken(v, this.IBCDenom)
    },
    async sendTx() {
      const txMsgs = [{
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
          this.error = e
        })
      }).catch(e => {
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
