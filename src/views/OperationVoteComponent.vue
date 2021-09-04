<template>
  <div>
    <b-modal
      id="vote-window"
      centered
      size="md"
      title="Vote"
      hide-header-close
      scrollable
      :ok-disabled="!voter"
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    >
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
                label="Voter"
                label-for="Account"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Voter"
                >
                  <v-select
                    v-model="voter"
                    :options="accounts"
                    :reduce="val => val.addr"
                    label="addr"
                    placeholder="Select an address"
                  />
                  <small class="text-danger">{{ errors[0] }} <strong v-if="!accounts">Please import an account first!</strong> </small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                label="Option"
                label-for="option"
              >
                <div class="demo-inline-spacing">

                  <b-form-radio
                    v-model="option"
                    name="option"
                    value="1"
                    class="custom-control-success"
                  >
                    Yes
                  </b-form-radio>
                  <b-form-radio
                    v-model="option"
                    name="option"
                    value="3"
                    class="custom-control-warning"
                  >
                    No
                  </b-form-radio>
                  <b-form-radio
                    v-model="option"
                    name="option"
                    value="4"
                    class="custom-control-danger"
                  >
                    No with Veto
                  </b-form-radio>
                  <b-form-radio
                    v-model="option"
                    name="option"
                    value="2"
                    class="custom-control-secondary"
                  >
                    Abstain
                  </b-form-radio>
                </div>
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
  formatToken, getLocalAccounts, getLocalChains, setLocalTxHistory, sign, timeIn,
} from '@/libs/data'
import chainAPI from '@/libs/fetch'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'

export default {
  name: 'VoteDialogue',
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
      fee: null,
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
    feeDenoms() {
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
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
          if (!this.voter) {
            this.voter = addrs[0].addr
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
      const reducer = (t, c) => {
        if (!(t.find(x => x.addr === c.addr))) t.push(c)
        return t
      }
      return array.reduce(reducer, [])
    },
    loadBalance() {
      this.accounts = this.computeAccount()
      // eslint-disable-next-line prefer-destructuring
      if (this.accounts && this.accounts.length > 0) this.voter = this.accounts[0].addr
      if (this.voter) {
        chainAPI.getBankBalance(this.selectedChain.api, this.voter).then(res => {
          if (res && res.length > 0) {
            this.balance = res
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            if (token) this.feeDenom = token.denom
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
        this.$http.getAuthAccount(this.voter, this.selectedChain).then(ret => {
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
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          voter: this.voter,
          proposalId: this.proposalId,
          option: this.option,
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
        this.voter,
        txMsgs,
        txFee,
        this.memo,
        signerData,
      ).then(bodyBytes => {
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          setLocalTxHistory({ op: 'vote', hash: res.tx_response.txhash, time: new Date() })
          this.$bvModal.hide('vote-window')
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
