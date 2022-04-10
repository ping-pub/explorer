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
      :key="k"
      :title="k"
    >
      <b-table
        :items="items"
        stacked="sm"
        :fields="fields"
      >

        <template #cell(validator)="data">
          <router-link :to="`/${data.item.validator.chain}/staking/${data.item.validator.validator}`">
            <div cols="6">
              <b-avatar
                :src="data.item.validator.logo"
                size="18"
                variant="light-primary"
                rounded=""
              />
              {{ data.item.validator.moniker }}
            </div>
          </router-link>
        </template>
        <template #cell(reward)="data">
          <router-link :to="`/${data.item.validator.chain}/account/${data.item.delegator_address}`">
            <div>{{ data.item.reward }}</div>
            <div class="text-success">
              {{ currency }}{{ toCurrency(data.item.reward) }}
            </div>
          </router-link>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  VBTooltip, BTable, BCard, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  formatToken, getCachedValidators, getLocalAccounts, getLocalChains, getUserCurrency, getUserCurrencySign, numberWithCommas, tokenFormatter,
} from '@/libs/utils'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BAvatar,
    BTable,
    BCard,
    FeatherIcon,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: [
        {
          key: 'validator',
          sortable: true,
        },
        {
          key: 'delegation',
          sortable: true,
          // sortByFormatted: true,
          tdAttr() {
            return { width: '20%' }
          },
        },
        {
          key: 'reward',
          sortable: true,
          tdAttr() {
            return { width: '35%' }
          },
        },
      ],
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
        return tokenFormatter(reward.reward, this.ibcDenoms)
      }
      return '-'
    },
    getPrice(denom) {
      const quote = this.$store.state.chains.quotes[denom]
      return quote ? quote[this.currency2] : 0
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
