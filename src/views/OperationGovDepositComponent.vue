<template>
  <div>
    <b-modal
      id="deposit-window"
      centered
      size="md"
      title="Deposit"
      ok-title="Send"
      hide-header-close
      scrollable
      :ok-disabled="!voter"
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    ><b-overlay
      :show="!voter"
      rounded="sm"
    >
      <template #overlay>
        <div class="text-center">
          <p id="cancel-label">
            No available account found.
          </p>
          <b-button
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
              <h4>{{ proposalId }}. {{ title }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                label="Depositor"
                label-for="Voter"
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
                  >
                    <b-form-select-option
                      v-for="item in balance"
                      :key="item.denom"
                      :value="item.denom"
                    >
                      {{ format(item) }}
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
                  <b-input-group class="mb-25">
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
  BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormCheckbox,
  BForm, BFormRadioGroup, BFormRadio, BInputGroupAppend, BOverlay, BButton, BFormSelectOption,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  abbrAddress,
  extractAccountNumberAndSequence,
  formatToken, formatTokenDenom, getLocalAccounts, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  name: 'DepositDialogue',
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
    BFormCheckbox,
    BInputGroupAppend,
    BOverlay,
    BButton,
    BFormSelectOption,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  props: {
    proposalId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      accounts: [],
      voter: null,
      option: null,
      chainId: '',
      selectedChain: '',
      balance: [],
      memo: '',
      fee: '',
      feeDenom: '',
      wallet: 'ledgerUSB',
      error: null,
      sequence: 1,
      accountNumber: 0,
      gas: '200000',
      advance: false,
      token: null,
      amount: '',

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
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
  },
  methods: {
    printDenom() {
      return formatTokenDenom(this.token)
    },
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
      this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
      this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      if (this.voter) {
        this.$http.getBankBalances(this.voter).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse().filter(x => !x.denom.startsWith('ibc'))
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            if (token) {
              this.feeDenom = token.denom
              this.token = token.denom
            }
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
        this.$http.getAuthAccount(this.voter).then(ret => {
          const account = extractAccountNumberAndSequence(ret)
          this.accountNumber = account.accountNumber
          this.sequence = account.sequence
        })
        this.fee = this.$store.state.chains.selected?.min_tx_fee || '1000'
        this.feeDenom = this.$store.state.chains.selected?.assets[0]?.base || ''
      }
    },
    loadBalance() {
      this.accounts = this.computeAccount()
      // eslint-disable-next-line prefer-destructuring
      if (this.accounts && this.accounts.length > 0) this.voter = this.accounts[0].value
      this.onChange()
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
        typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
        value: {
          depositor: this.voter,
          proposalId: String(this.proposalId),
          amount: [
            {
              amount: getUnitAmount(this.amount, this.token),
              denom: this.token,
            },
          ],
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
        this.voter,
        txMsgs,
        txFee,
        this.memo,
        signerData,
      ).then(bodyBytes => {
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: 'deposit',
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('deposit-window')
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
