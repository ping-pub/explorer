<template>
  <div>
    <router-link
      v-if="delegations.length === 0"
      to="/wallet/import"
    >
      <b-card class="addzone text-center">
        <feather-icon icon="PlusIcon" />
        Connect Wallet
      </b-card>
    </router-link>
    <b-card
      v-for="(items,k) in groupedDelegations"
      :key="`row-${k}`"
      :title="k"
    >
      <b-row class="bg-light-secondary text-white">
        <b-col
          md="4"
          sm="12"
          class="p-1 font-weight-bold"
        >
          VALIDATOR
        </b-col>
        <b-col
          md="3"
          sm="12"
          class="p-1 font-weight-bold"
        >
          DELEGATION
        </b-col>
        <b-col
          md="5"
          sm="12"
          class="p-1 font-weight-bold"
        >
          REWARD
        </b-col>
      </b-row>
      <b-row
        v-for="(row,j) in items"
        :key="`${row.validator.validator}-${j}`"
        class="border-bottom"
      >
        <b-col
          md="4"
          sm="12"
          class="d-flex align-items-center"
        >
          <router-link :to="`/${row.validator.chain}/staking/${row.validator.validator}`">
            <div cols="6">
              <b-avatar
                :src="row.validator.logo"
                size="18"
                variant="light-primary"
                rounded=""
              />
              {{ row.validator.moniker }}
            </div>
          </router-link>
        </b-col>
        <b-col
          md="3"
          sm="12"
          class="d-flex align-items-center"
        >
          {{ row.delegation }}
        </b-col>
        <b-col
          md="5"
          sm="12"
        >
          <router-link :to="`/${row.validator.chain}/account/${row.delegator_address}`">
            <div>{{ row.reward }}</div>
            <div class="text-success">
              {{ currency }}{{ toCurrency(row.reward) }}
            </div>
          </router-link>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {
  VBTooltip, BCard, BAvatar, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  formatToken, getCachedValidators, getLocalAccounts, getLocalChains, getUserCurrency, getUserCurrencySign, numberWithCommas, tokenFormatter,
} from '@/libs/utils'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BAvatar,
    BCard,
    BRow,
    BCol,
    FeatherIcon,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      address: '',
      selectedValidator: '',
      accounts: [],
      delegations: [],
      rewards: {},
      operationModalType: '',
      ibcDenoms: {},
      currency: getUserCurrencySign(),
      currency2: getUserCurrency(),
    }
  },
  computed: {
    formatedDelegations() {
      return this.delegations.map(x => ({
        validator: {
          logo: x.chain.logo,
          validator: x.delegation.validator_address,
          moniker: this.findMoniker(x.chain.chain_name, x.delegation.validator_address),
          chain: x.chain.chain_name,
        },
        delegator: x.keyname,
        delegator_address: x.delegation.delegator_address,
        delegation: formatToken(x.balance),
        reward: this.findReward(x.delegation.delegator_address, x.delegation.validator_address),
        // action: '',
      }))
    },
    groupedDelegations() {
      const group = {}
      this.delegations.forEach(x => {
        const d = {
          validator: {
            logo: x.chain.logo,
            validator: x.delegation.validator_address,
            moniker: this.findMoniker(x.chain.chain_name, x.delegation.validator_address),
            chain: x.chain.chain_name,
          },
          delegator: x.keyname,
          delegator_address: x.delegation.delegator_address,
          delegation: formatToken(x.balance),
          reward: this.findReward(x.delegation.delegator_address, x.delegation.validator_address),
          // action: '',
        }
        if (group[x.keyname]) {
          group[x.keyname].push(d)
        } else {
          group[x.keyname] = [d]
        }
      })
      return group
    },
  },
  created() {
    this.init()
  },
  methods: {
    selectValue(type, v) {
      this.operationModalType = type
      this.address = v.delegator_address
      this.selectedValidator = v.validator.validator
      return v
    },
    findMoniker(chain, addr) {
      const vals = JSON.parse(getCachedValidators(chain))
      if (vals) {
        const val = vals.find(x => x.operator_address === addr)
        if (val) {
          return val.description.moniker
        }
      }
      return addr
    },
    findReward(delegator, validator) {
      const reward = this.rewards[delegator]?.rewards.find(x => x.validator_address === validator) || null
      if (reward) {
        return tokenFormatter(reward.reward, this.denom)
      }
      return '-'
    },
    getPrice(denom) {
      const denom2 = 'point-network'
      const quote = this.$store.state.chains.quotes[denom2]
      return quote ? quote.usd : 0
    },
    toCurrency(token) {
      let profit = 0
      token.split(', ').forEach(r => {
        const t = r.trim().replace(/,/, '').split(' ')
        profit += Number(t[0]) * this.getPrice(t[1])
      })
      return numberWithCommas(profit.toFixed(2))
    },
    init() {
      this.accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (this.accounts) {
        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            const chain = chains[add.chain]
            this.$http.getStakingReward(add.addr, chain).then(res => {
              this.rewards[add.addr] = res
              res.total.forEach(t => {
                if (t.denom.startsWith('ibc')) {
                  this.$http.getIBCDenomTrace(t.denom, chain).then(denom => {
                    this.$set(this.ibcDenoms, t.denom, denom)
                  })
                }
              })
            })
            this.$http.getStakingDelegations(add.addr, chain).then(res => {
              if (res.delegation_responses && res.delegation_responses.length > 0) {
                const delegation = res.delegation_responses.map(x => {
                  const x2 = x
                  x2.keyname = acc
                  x2.chain = chain
                  return x2
                })
                this.delegations = this.delegations.concat(delegation)
              }
            }).catch(() => {})
          })
        })
      }
    },
  },
}
</script>

<style lang="css">
.addzone {
    border: 2px dashed #ced4da;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: none;
}
.addzone :hover {
    border: 2px dashed #7367F0;
}

</style>
