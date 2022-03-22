<template>
  <div>
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
  </div>
</template>

<script>
import {
  BRow, BCol, BInputGroup, BFormInput, BAvatar, BFormGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  getLocalAccounts, getLocalChains,
} from '@/libs/utils'

export default {
  name: 'WithdrawDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    BAvatar,
    BFormGroup,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      account: [],
      selectedChain: '',
      balance: [],
      delegations: [],
      feeDenom: '',

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
    msg() {
      const txMsgs = []
      this.delegations.forEach(i => {
        txMsgs.push({
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: this.address,
            validatorAddress: i.delegation.validator_address,
          },
        })
      })
      return txMsgs
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Withdraw Rewards',
      historyName: 'withdraw',
    })
    this.loadBalance()
  },

  methods: {
    loadBalance() {
      this.account = this.computeAccount()
      if (this.account && this.account.length > 0) this.address = this.account[0].addr
      if (this.address) {
        this.$http.getBankBalances(this.address).then(res => {
          if (res && res.length > 0) {
            this.balance = res.reverse()
            const token = this.balance.find(i => !i.denom.startsWith('ibc'))
            if (token) this.feeDenom = token.denom
          }
        })
      }
      this.$http.getStakingDelegations(this.address).then(res => {
        this.delegations = res.delegation_responses
      })
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
            this.$emit('update', {
              selectedChain: chains[addr.chain],
            })
            return addr
          }
        }
      }
      return null
    },

  },
}
</script>
