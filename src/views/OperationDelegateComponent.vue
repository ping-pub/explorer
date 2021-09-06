<template>
  <div>
    <b-modal
      id="delegate-window"
      centered
      size="md"
      title="Delegate Token"
      hide-header-close
      scrollable
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
                  <v-select
                    v-model="selectedAddress"
                    :options="account"
                    :reduce="val => val.addr"
                    label="addr"
                    placeholder="Select an address"
                    @change="loadBalance()"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
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
                  v-model="selectedValidator"
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
                label="Available Token"
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
          </b-row><b-row>
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
                  <b-form-input
                    id="Amount"
                    v-model="amount"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Input a number"
                    type="number"
                  />
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
                  rules="required"
                  name="fee"
                >
                  <b-input-group>
                    <b-form-input v-model="fee" />
                    <b-form-select
                      v-model="feeDenom"
                    >
                      <b-form-select-option
                        v-for="item in feeDenoms"
                        :key="item.denom"
                        :value="item.denom"
                      >
                        {{ item.denom }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
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
                      class="mb-1 mt-1"
                    >
                      Keplr
                    </b-form-radio>
                    <!-- <b-form-radio
                      v-model="wallet"
                      name="wallet"
                      value="ledgerUSB"
                      class="mb-1 mt-1"
                      disabled
                    >
                      Ledger (USB)
                    </b-form-radio>
                    <b-form-radio
                      v-model="wallet"
                      name="wallet"
                      value="ledgerBle"
                      class="mb-1 mt-1"
                      disabled
                    >
                      Ledger (Bluetooth)
                    </b-form-radio> -->
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
  BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BFormRadioGroup, BFormRadio,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, getCachedValidators, getLocalAccounts, getLocalChains, setLocalTxHistory, sign, timeIn,
} from '@/libs/data'
import chainAPI from '@/libs/fetch'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  name: 'DelegateDialogue',
  components: {
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
    vSelect,

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
      selectedValidator: null,
      token: '',
      amount: null,
      chainId: '',
      selectedChain: '',
      balance: [],
      delegations: [],
      memo: '',
      fee: 800,
      feeDenom: '',
      wallet: 'keplr',
      error: null,
      sequence: 1,
      accountNumber: 0,

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
      return this.validators.map(x => ({ value: x.operator_address, label: x.description.moniker }))
    },
    tokenOptions() {
      if (!this.balance) return []
      return this.balance.map(x => ({ value: x.denom, label: formatToken(x) }))
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
    computeAccount() {
      const accounts = getLocalAccounts()
      const chains = getLocalChains()
      const values = Object.values(accounts)
      let array = []
      for (let i = 0; i < values.length; i += 1) {
        const addrs = values[i].address.filter(x => x.chain === this.$route.params.chain)
        if (addrs && addrs.length > 0) {
          array = array.concat(addrs)
          if (!this.selectedAddress) {
            this.selectedAddress = addrs[0].addr
          }
        }
        const addr = values[i].address.find(x => x.addr === this.selectedAddress)
        if (addr) {
          this.selectedChain = chains[addr.chain]
        }
      }
      if (!this.selectedChain) {
        this.selectedChain = chains[this.$route.params.chain]
      }
      this.selectedValidator = this.validatorAddress
      const reducer = (t, c) => {
        if (!(t.find(x => x.addr === c.addr))) t.push(c)
        return t
      }
      return array.reduce(reducer, [])
    },
    loadBalance() {
      this.account = this.computeAccount()
      if (this.account && this.account.length > 0) this.selectedAddress = this.account[0].addr
      if (this.selectedAddress) {
        if (!getCachedValidators(this.selectedChain.chain)) {
          this.$http.getValidatorList().then(v => {
            this.validators = v
          })
        } else {
          this.validators = JSON.parse(getCachedValidators(this.selectedChain.chain))
        }
        if (this.selectedChain && this.selectedAddress) {
          chainAPI.getBankBalance(this.selectedChain.api, this.selectedAddress).then(res => {
            if (res && res.length > 0) {
              this.balance = res
              const token = this.balance.find(i => !i.denom.startsWith('ibc'))
              this.token = token.denom
              if (token) this.feeDenom = token.denom
            }
          })
        }
        this.$http.getLatestBlock(this.selectedChain).then(ret => {
          this.chainId = ret.block.header.chain_id
          const notSynced = timeIn(ret.block.header.time, 10, 'm')
          if (notSynced) {
            this.error = 'Client is not synced or blockchain is halted'
          } else {
            this.error = null
          }
        })
        this.$http.getAuthAccount(this.selectedAddress, this.selectedChain).then(ret => {
          if (ret.value.base_vesting_account) {
            this.accountNumber = ret.value.base_vesting_account.base_account.account_number
            this.sequence = ret.value.base_vesting_account.base_account.sequence
            if (!this.sequence) this.sequence = 0
          } else {
            this.accountNumber = ret.value.account_number
            this.sequence = ret.value.sequence ? ret.value.sequence : 0
          }
        })
        this.$http.getStakingDelegations(this.selectedAddress).then(res => {
          this.delegations = res.delegation_responses
        })
      }
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
      return formatToken(v)
    },
    async sendTx() {
      const txMsgs = [{
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress: this.selectedAddress,
          validatorAddress: this.selectedValidator,
          amount: {
            amount: String((Number(this.amount) * 1000000).toFixed()),
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
        gas: '200000',
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
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          setLocalTxHistory({ op: 'delegate', hash: res.tx_response.txhash, time: new Date() })
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
