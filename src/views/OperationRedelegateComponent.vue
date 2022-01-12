<template>
  <div>
    <b-modal
      id="redelegate-window"
      centered
      size="md"
      title="Redelegate Token"
      hide-header-close
      scrollable
      ok-title="Send"
      :ok-disabled="!selectedAddress"
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    >
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <b-col>
              <b-form-group
                label="Delegator"
                label-for="Account"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Delegator"
                >
                  <b-form-input
                    v-model="address"
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
                label="From Validator"
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
                label="To Validator"
                label-for="validator"
              >
                <v-select
                  v-model="toValidator"
                  :options="valOptions"
                  :reduce="val => val.value"
                  placeholder="Select a validator"
                />
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
    </b-modal>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect,
  BForm, BFormRadioGroup, BFormRadio, BFormCheckbox, BInputGroupAppend,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  extractAccountNumberAndSequence,
  formatToken, formatTokenDenom, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  name: 'UnbondDialogue',
  components: {
    BModal,
    BRow,
    BCol,
    BForm,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormRadioGroup,
    BFormRadio,
    vSelect,
    BFormCheckbox,
    BInputGroupAppend,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
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
      toValidator: null,
      token: '',
      amount: null,
      chainId: '',
      selectedChain: '',
      balance: [],
      delegations: [],
      memo: '',
      fee: '800',
      feeDenom: '',
      wallet: 'ledgerUSB',
      error: null,
      sequence: 1,
      accountNumber: 0,
      account: [],
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
    tokenOptions() {
      if (!this.delegations) return []
      return this.delegations.filter(x => x.delegation.validator_address === this.validatorAddress).map(x => ({ value: x.balance.denom, label: formatToken(x.balance) }))
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
      return formatTokenDenom(this.token)
    },
    loadBalance() {
      this.$http.getValidatorList().then(v => {
        this.validators = v
      })
      this.$http.getBankBalances(this.address).then(res => {
        if (res && res.length > 0) {
          this.balance = res.reverse()
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

      this.$http.getAuthAccount(this.address).then(ret => {
        const account = extractAccountNumberAndSequence(ret)
        this.accountNumber = account.accountNumber
        this.sequence = account.sequence
      })
      this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
      this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      this.$http.getStakingDelegations(this.address).then(res => {
        this.delegations = res.delegation_responses
        this.delegations.forEach(x => {
          if (x.delegation.validator_address === this.validatorAddress) {
            this.token = x.balance.denom
            this.feeDenom = x.balance.denom
          }
        })
      })
    },
    handleOk(bvModalEvt) {
      // console.log('send')
      // Prevent modal from closing
      bvModalEvt.preventDefault()
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
      return formatToken(v)
    },
    async sendTx() {
      const txMsgs = [{
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: {
          delegatorAddress: this.address,
          validatorSrcAddress: this.validatorAddress,
          validatorDstAddress: this.toValidator,
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
        this.address,
        txMsgs,
        txFee,
        this.memo,
        signerData,
      ).then(bodyBytes => {
        this.$http.broadcastTx(bodyBytes).then(res => {
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: 'redelegate',
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('redelegate-window')
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
      // Send tokens
      // return client.sendTokens(this.address, this.recipient, sendCoins, this.memo)
      return ''
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
