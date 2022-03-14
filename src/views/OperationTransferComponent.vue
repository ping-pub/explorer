<template>
  <div>
    <b-modal
      id="transfer-window"
      centered
      size="md"
      title="Transfer Tokens"
      ok-title="Send"
      hide-header-close
      scrollable
      :ok-disabled="!address"
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    >
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <b-col>
              <b-form-group
                label="Sender"
                label-for="sender"
              >
                <b-input-group class="mb-25">
                  <b-input-group-prepend is-text>
                    <b-avatar
                      :src="account?account.logo:''"
                      size="18"
                      variant="light-primary"
                      rounded
                    />
                  </b-input-group-prepend>
                  <b-form-input
                    name="sender"
                    :value="account?account.addr:address"
                    readonly
                  />
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                label="Recipient"
                label-for="Recipient"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="recipient"
                >
                  <b-input-group class="mb-25">
                    <b-form-input
                      id="Recipient"
                      v-model="recipient"
                      :state="errors.length > 0 ? false:null"
                    />
                  </b-input-group>
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
              <wallet-input-vue v-model="wallet" />
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
  BModal, BRow, BCol, BInputGroup, BInputGroupAppend, BFormInput, BAvatar, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BInputGroupPrepend, BFormCheckbox,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  extractAccountNumberAndSequence,
  formatToken, formatTokenDenom, getLocalAccounts, getLocalChains, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import WalletInputVue from './components/WalletInput.vue'

export default {
  name: 'TransforDialogue',
  components: {
    BModal,
    BRow,
    BCol,
    BForm,
    BInputGroup,
    BInputGroupAppend,
    BInputGroupPrepend,
    BFormInput,
    BAvatar,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    BFormCheckbox,

    ValidationProvider,
    ValidationObserver,

    WalletInputVue,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
    recipientAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chainId: '',
      selectedChain: '',
      balance: [],
      token: '',
      amount: null,
      memo: '',
      recipient: this.recipientAddress,
      fee: '800',
      feeDenom: '',
      wallet: 'ledgerUSB',
      error: null,
      sequence: 1,
      accountNumber: 0,
      account: [],
      IBCDenom: {},
      gas: '200000',
      advance: false,

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
  created() {
    // console.log('address: ', this.address)
  },
  methods: {
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token)
    },
    computeAccount() {
      const accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (accounts) {
        const values = Object.values(accounts)
        for (let i = 0; i < values.length; i += 1) {
          const addr = values[i].address.find(x => x.addr === this.address)
          if (addr) {
            this.selectedChain = chains[addr.chain]
            return addr
          }
        }
      }
      return null
    },
    loadBalance() {
      this.account = this.computeAccount()
      if (this.account && this.account.length > 0) this.address = this.account[0].addr
      if (this.address) {
        this.$http.getBankBalances(this.address, this.selectedChain).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse()
            this.token = this.balance[0].denom
            this.feeDenom = this.balance.find(x => !x.denom.startsWith('ibc')).denom
            this.balance.filter(i => i.denom.startsWith('ibc')).forEach(x => {
              if (!this.IBCDenom[x.denom]) {
                this.$http.getIBCDenomTrace(x.denom, this.selectedChain).then(denom => {
                  this.IBCDenom[x.denom] = denom.denom_trace.base_denom
                })
              }
            })
          }
        })
        this.$http.getLatestBlock(this.selectedChain).then(ret => {
          this.chainId = ret.block.header.chain_id
          const notSynced = timeIn(ret.block.header.time, 10, 'm')
          if (notSynced) {
            this.error = 'Client is not synced or blockchain is halted'
          } else {
            this.error = null
          }
        })
        this.$http.getAuthAccount(this.address, this.selectedChain).then(ret => {
          const account = extractAccountNumberAndSequence(ret)
          this.accountNumber = account.accountNumber
          this.sequence = account.sequence
        })
        this.fee = this.selectedChain?.min_tx_fee || '1000'
        this.feeDenom = this.selectedChain?.assets[0]?.base || ''
      }
    },
    handleOk(bvModalEvt) {
      // console.log('send')
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      // this.handleSubmit()
      this.send().then(ret => {
        // console.log(ret)
        this.error = ret
      })
    },
    resetModal() {
      this.feeDenom = ''
      this.error = null
    },
    format(v) {
      return formatToken(v, this.IBCDenom)
    },

    async send() {
      const txMsgs = [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: this.address,
            toAddress: this.recipient,
            amount: [
              {
                amount: getUnitAmount(this.amount, this.token),
                denom: this.token,
              },
            ],
          },
        },
      ]

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
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          setLocalTxHistory({
            chain: this.$store.state.chains.selected,
            op: 'send',
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('transfer-window')
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
