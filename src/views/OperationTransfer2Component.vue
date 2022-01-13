<template>
  <div>
    <b-modal
      id="ibc-transfer-window"
      centered
      size="md"
      title="IBC Transfer Tokens"
      :ok-title="actionName"
      hide-header-close
      scrollable
      :ok-disabled="!address || channels.length === 0"
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    ><b-overlay
      :show="channels.length === 0"
      rounded="sm"
    >
      <template #overlay>
        <div class="text-center">
          <b-spinner
            type="grow"
            variant="danger"
          />
          <p>
            This feature is only for experts
          </p>
        </div>
      </template>
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <b-col>
              <b-form-group
                label="Sender"
                label-for="Account"
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
                    @change="tokenChange"
                  >
                    <template #first>
                      <b-form-select-option
                        value=""
                      >
                        -- Please select a token --
                      </b-form-select-option>
                    </template>
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
                :label="`Destination: ${targetChainId}`"
                label-for="destination"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="destination"
                >
                  <v-select
                    v-model="destination"
                    name="destination"
                    :options="destinationOptions"
                    placeholder="Select a channel"
                    @input="onChannelChange()"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
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
                      :placeholder="placeholder"
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
  BModal, BRow, BCol, BInputGroup, BInputGroupAppend, BFormInput, BAvatar, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BFormRadioGroup, BFormRadio, BInputGroupPrepend, BFormCheckbox, BOverlay, BSpinner,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  extractAccountNumberAndSequence,
  formatToken, formatTokenDenom, getLocalAccounts, getLocalChains, getUnitAmount, setLocalTxHistory, sign, timeIn,
} from '@/libs/utils'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { coin } from '@cosmjs/amino'
import dayjs from 'dayjs'
import { toHex } from '@cosmjs/encoding'
import { sha256 } from '@cosmjs/crypto'

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
    BFormRadioGroup,
    BFormRadio,
    BFormCheckbox,
    BSpinner,
    vSelect,
    BOverlay,

    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chainId: '',
      targetChainId: '',
      selectedChain: '',
      balance: [],
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
    destinationOptions() {
      if (!this.token && this.token === '') return []
      const options = this.channels.map(x => ({ port_id: x.port_id, channel_id: x.channel_id, label: `${x.chain_id ? x.chain_id : ''} ${x.port_id}/${x.channel_id}` }))
      if (this.token.startsWith('ibc/')) {
        const query = this.paths[this.token]
        return query ? options.filter(x => x.channel_id === query.channel_id) : options
      }
      return options
    },
    placeholder() {
      return 'Input a destination address'
    },
    actionName() {
      return this.token.startsWith('ibc') ? 'Withdraw' : 'Deposit'
    },
  },
  created() {
    // console.log('address: ', this.address)
  },
  methods: {
    tokenChange() {
      // eslint-disable-next-line prefer-destructuring
      this.destination = this.destinationOptions[0]
      this.recipient = null
      this.onChannelChange()
    },
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
      this.destination = null
      this.channels = []
      this.token = ''
      this.targetChainId = ''
      this.account = this.computeAccount()
      if (this.account && this.account.length > 0) this.address = this.account[0].addr
      if (this.address) {
        this.$http.getAllIBCDenoms(this.selectedChain).then(x => {
          x.denom_traces.forEach(trace => {
            const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
            const ibcDenom = `ibc/${hash.toUpperCase()}`
            // add base_denom to cache
            this.$set(this.IBCDenom, ibcDenom, trace.base_denom)
            // store channel/part for ibc denoms
            const path = trace.path.split('/')
            if (path.length >= 2) {
              this.paths[ibcDenom] = {
                channel_id: path[path.length - 1],
                port_id: path[path.length - 2],
              }
            }
          })
        })
        this.$http.getBankBalances(this.address, this.selectedChain).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse()
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

        this.$http.getIBCChannels(this.selectedChain, null).then(ret => {
          const chans = ret.channels.filter(x => x.state === 'STATE_OPEN').map(x => ({ channel_id: x.channel_id, port_id: x.port_id }))
          this.$set(this, 'channels', chans)
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
      return formatToken(v, this.IBCDenom)
    },
    onChannelChange() {
      this.$http.getIBCChannelClientState(this.destination.channel_id, this.destination.port_id, this.selectedChain).then(cs => {
        this.targetChainId = cs.identified_client_state.client_state.chain_id
        // this.$store.commit('setChannels', { chain: this.selectedChain.chain_name, channels: chans })
      })
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
            token: coin(Number(getUnitAmount(this.amount, this.token)), this.token),
            sender: this.address,
            receiver: this.recipient,
            // timeoutHeight: undefined, // { revisionHeight: '0', revisionNumber: '0' },
            timeoutTimestamp: String(timeout.utc().valueOf() * 1000000),
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
            op: 'transfer',
            hash: res.tx_response.txhash,
            time: new Date(),
          })
          this.$bvModal.hide('ibc-transfer-window')
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
