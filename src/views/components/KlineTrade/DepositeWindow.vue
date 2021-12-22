<template>
  <div>
    <b-modal
      id="trading-deposte-window"
      centered
      size="md"
      title="Cross Chain Deposit Tokens"
      ok-title="Send"
      hide-header-close
      scrollable
      :ok-disabled="!address"
      @hidden="resetModal"
      @ok="handleOk"
      @show="init"
    >
      <template #modal-header="" />
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <b-col>
              <b-form-group
                label="Sender Address"
                label-for="from"
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="from"
                >
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <b-avatar
                        :src="selectedChain.logo"
                        size="18"
                        variant="light-primary"
                        rounded
                      />
                    </b-input-group-prepend>
                    <b-form-select
                      id="from"
                      v-model="address"
                      :options="addressOptions"
                      :state="errors.length > 0 ? false:null"
                      @change="loadBalance()"
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="d-none">
            <b-col>
              <b-form-group
                label="Recipient Address"
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
              <div class="d-flex justify-content-between">
                <span>Amount</span>
                <span>
                  <small
                    v-if="balance.amount > 0"
                    class="mr-1"
                  >Available: <b class="font-weight-bolder text-success">{{ format(balance) }}</b> {{ symbol }}</small>
                </span>
              </div>
              <b-form-group>
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
                      {{ symbol }}
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
                    <b-input-group-append is-text>
                      {{ feeDenom }}
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
                label="Siger"
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
  BAvatar, BModal, BRow, BCol, BInputGroup, BInputGroupAppend, BInputGroupPrepend, BFormInput, BFormGroup, BFormSelect, BForm, BFormRadioGroup, BFormRadio, BFormCheckbox,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, formatTokenDenom, getLocalAccounts, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { coin } from '@cosmjs/amino'
import { getChainConfigForSymbol } from '@/libs/osmos'
import dayjs from 'dayjs'

export default {
  name: 'TransforDialogue',
  components: {
    BAvatar,
    BModal,
    BRow,
    BCol,
    BForm,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormRadioGroup,
    BFormRadio,
    BFormCheckbox,
    BInputGroupPrepend,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  props: {
    symbol: {
      type: String,
      default: () => '',
    },
    denomTrace: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      address: '', // from address for deposit / to address for withdraw
      addressOptions: [],
      chainId: '',
      selectedChain: '',
      balance: {},
      token: '',
      amount: null,
      memo: '',
      recipient: null,
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
      paths: {},
      destination: {},
      channels: [],
      timeoutHeight: {},

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
  methods: {
    recipientAddress() {
      const { chain } = this.$route.params
      const accounts = getLocalAccounts()
      const current = this.$store.state.chains.defaultWallet
      if (accounts && accounts[current]) {
        const acc = accounts[current].address.find(x => x.chain === chain)
        if (acc) {
          this.recipient = acc.addr
        }
      }
      this.selectedChain = getChainConfigForSymbol(this.symbol)
    },
    computeAccount() {
      this.recipientAddress()
      const accounts = getLocalAccounts()
      this.addressOptions = []
      if (accounts) {
        const values = Object.values(accounts)
        for (let i = 0; i < values.length; i += 1) {
          const addr = values[i].address.find(x => x.chain === this.selectedChain.chain_name)
          if (addr) {
            if (this.addressOptions.length === 0) this.address = addr.addr
            this.addressOptions.push({ value: addr.addr, text: addr.addr })
          }
        }
      }
      return []
    },
    init() {
      this.destination = null
      this.token = ''
      this.computeAccount()
      this.loadBalance()
      if (this.denomTrace) {
        const part = this.denomTrace.path.split('/')
        this.$http.getIBCChannel(part[1], part[0]).then(data => {
          this.destination = data.channel.counterparty
          this.timeoutHeight = data.proof_height
        })
      }
    },
    loadBalance() {
      if (this.address) {
        this.$http.getBankBalances(this.address, this.selectedChain).then(res => {
          if (res && res.length > 0) {
            this.balance = res.find(x => formatTokenDenom(x.denom) === this.symbol)
            this.denom = this.balance.denom
            this.feeDenom = this.balance.denom
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
          if (ret.value.base_vesting_account) {
            this.accountNumber = ret.value.base_vesting_account.base_account.account_number
            this.sequence = ret.value.base_vesting_account.base_account.sequence
            if (!this.sequence) this.sequence = 0
          } else {
            this.accountNumber = ret.value.account_number
            this.sequence = ret.value.sequence ? ret.value.sequence : 0
          }
        })
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
      return formatToken(v, {}, 6, false)
    },
    async send() {
      if (!this.destination) {
        this.error = 'You have to select a destination'
        return
      }
      const timeout = dayjs().add(4, 'hour')
      const txMsgs = [
        {
          typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
          value: {
            sourcePort: this.destination.port_id,
            sourceChannel: this.destination.channel_id,
            token: coin(Number(getUnitAmount(this.amount, this.denomTrace.base_denom)), this.denomTrace.base_denom),
            sender: this.address,
            receiver: this.recipient,
            // timeoutHeight: {
            //   revisionNumber: '0',
            //   revisionHeight: '0',
            // },
            timeoutTimestamp: String(timeout.utc().valueOf() * 1000000),
          },
        },
        // {
        //   type: 'cosmos-sdk/MsgTransfer',
        //   value: {
        //     source_port: this.destination.port_id,
        //     source_channel: this.destination.channel_id,
        //     token: coin(Number(getUnitAmount(this.amount, this.denomTrace.base_denom)), this.denomTrace.base_denom),
        //     sender: this.address,
        //     receiver: this.recipient,
        //     timeout_height: {
        //       revision_number: String(this.timeoutHeight.revision_number),
        //       revision_height: String(200 + parseInt(this.timeoutHeight.revision_height, 10)),
        //     },
        //     timeout_timestamp: '0',
        //   },
        // },
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
          setLocalTxHistory({ op: 'ibc_sender', hash: res.txhash, time: new Date() })
          this.$bvModal.hide('trading-deposte-window')
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
      // return
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
