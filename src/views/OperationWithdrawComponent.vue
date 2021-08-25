<template>
  <div>
    <b-modal
      id="withdraw-window"
      centered
      size="md"
      title="Withdraw Rewards"
      hide-header-close
      scrollable
      @hidden="resetModal"
      @ok="handleOk"
      @show="loadBalance"
    >
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <b-col v-if="account">
              <b-form-group
                label="Sender"
                label-for="Account"
              >
                <b-input-group class="mb-25">
                  <b-input-group-prepend is-text>
                    <b-avatar
                      :src="account.logo"
                      size="18"
                      variant="light-primary"
                      rounded
                    />
                  </b-input-group-prepend>
                  <b-form-input
                    :value="account.addr"
                    readonly
                  />
                </b-input-group>
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
                    <b-input-group-prepend>
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
                    </b-input-group-prepend></b-input-group>
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
  BModal, BRow, BCol, BInputGroup, BFormInput, BAvatar, BFormGroup, BFormSelect, BFormSelectOption,
  BForm, BFormRadioGroup, BFormRadio, BInputGroupPrepend,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, getLocalAccounts, getLocalChains, sign, timeIn,
} from '@/libs/data'
import chainAPI from '@/libs/fetch'

export default {
  name: 'TransforDialogue',
  components: {
    BModal,
    BRow,
    BCol,
    BForm,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    BAvatar,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    BFormRadioGroup,
    BFormRadio,

    ValidationProvider,
    ValidationObserver,
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
    feeDenoms() {
      return this.balance.filter(item => !item.denom.startsWith('ibc'))
    },
    account() {
      // if (accounts && accounts[this.name]) {
      //   const config = accounts[this.name]
      //   const addr = config.address.find(x => x.addr === this.address)
      //   if (addr) return addr
      // }
      return this.computeAccount()
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
      for (let i = 0; i < values.length; i += 1) {
        const addr = values[i].address.find(x => x.addr === this.address)
        if (addr) {
          this.selectedChain = chains[addr.chain]
          return addr
        }
      }
      return null
    },
    loadBalance() {
      if (this.address) {
        chainAPI.getBankBalance(this.selectedChain.api, this.address).then(res => {
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
      this.$http.getStakingDelegations(this.address).then(res => {
        this.delegations = res.delegation_responses
      })
    },
    handleOk(bvModalEvt) {
      // console.log('send')
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      // this.handleSubmit()
      this.sendTx().then(ret => {
        // console.log(ret)
        this.error = ret
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
      const txMsgs = []
      this.delegations.forEach(i => {
        console.log(i.delegation.validator_address)
        txMsgs.push({
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: this.address,
            validatorAddress: i.delegation.validator_address,
          },
        })
      })

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

      console.log('tx:', txMsgs, txFee, signerData)

      sign(
        this.wallet,
        this.chainId,
        this.address,
        txMsgs,
        txFee,
        this.memo,
        signerData,
      ).then((bodyBytes, s) => {
        console.log('signed: ', bodyBytes, s)
        this.$http.broadcastTx(bodyBytes, this.selectedChain).then(res => {
          console.log(res)
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
