<template>
  <div>
    <b-modal
      id="vote-window"
      centered
      size="md"
      title="Vote"
      ok-title="Send"
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
                  <b-form-select
                    v-model="voter"
                    :options="accounts"
                    text-field="label"
                    placeholder="Select an address"
                    @change="onChange"
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
                <b-input-group>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|integer"
                    name="fee"
                  >
                    <b-form-input v-model="fee" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="feeDenom"
                  >
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
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-input-group>
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
                    <b-form-radio
                      v-model="wallet"
                      name="wallet"
                      value="ledgerUSB"
                      class="mb-1 mt-1"
                    >
                      Ledger (USB)
                    </b-form-radio>
                    <b-form-radio
                      v-model="wallet"
                      name="wallet"
                      value="ledgerBle"
                      class="mb-1 mt-1"
                    >
                      Ledger (Bluetooth)
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
  BModal, BRow, BCol, BInputGroup, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BFormRadioGroup, BFormRadio,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  abbrAddress,
  formatToken, getLocalAccounts, setLocalTxHistory, sign, timeIn,
} from '@/libs/data'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

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
      const values = Object.values(accounts)
      let array = []
      for (let i = 0; i < values.length; i += 1) {
        const addrs = values[i].address.filter(x => x.chain === this.$route.params.chain)
        if (addrs && addrs.length > 0) {
          array = array.concat(addrs.map(x => ({ value: x.addr, label: values[i].name.concat(' - ', abbrAddress(x.addr)) })))
        }
      }
      return array
    },
    onChange() {
      if (this.voter) {
        this.$http.getBankBalances(this.voter).then(res => {
          if (res && res.length > 0) {
            this.balance = res
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            if (token) this.feeDenom = token.denom
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
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          voter: this.voter,
          proposalId: this.proposalId,
          option: Number(this.option),
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
