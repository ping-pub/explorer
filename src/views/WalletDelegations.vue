<template>
  <div>
    <b-card>
      <b-table
        :items="formatedDelegations(delegations)"
        stacked="sm"
      >

        <template #cell(validator)="data">
          <router-link :to="`/${data.item.validator.chain}/staking/${data.item.validator.validator}`">
            <b-avatar
              :src="data.item.validator.logo"
              size="18"
              variant="light-primary"
              rounded=""
            />
            {{ data.item.validator.moniker }}
          </router-link>
        </template>
        <template #cell(action)="data">
          <!-- size -->
          <b-button-group
            size="sm"
          >
            <b-button
              v-b-modal.delegate-window
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Delegate'"
              variant="outline-primary"
              @click="selectValue(data.value)"
            >
              <feather-icon icon="LogInIcon" />
            </b-button>
            <b-button
              v-b-modal.redelegate-window
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Redelegate'"
              variant="outline-primary"
              @click="selectValue(data.value)"
            >
              <feather-icon icon="ShuffleIcon" />
            </b-button>
            <b-button
              v-b-modal.unbond-window
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Unbond'"
              variant="outline-primary"
              @click="selectValue(data.value)"
            >
              <feather-icon icon="LogOutIcon" />
            </b-button>
          </b-button-group>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BButton, VBTooltip, BTable, BCard, BButtonGroup, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  formatToken, getCachedValidators, getLocalAccounts, getLocalChains,
} from '@/libs/data'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BAvatar,
    BButton,
    BButtonGroup,
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
      accounts: [],
      delegations: [],
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  methods: {
    selectValue(v) {
      return v
    },
    formatedDelegations(v) {
      // console.log('v', v)
      return v.map(x => ({
        validator: {
          logo: x.chain.logo,
          validator: x.delegation.validator_address,
          moniker: this.findMoniker(x.chain.chain_name, x.delegation.validator_address),
          chain: x.chain.chain_name,
        },
        delegator: x.keyname,
        delegation: formatToken(x.balance),
        // action: '',
      }))
    },
    findMoniker(chain, addr) {
      const vals = JSON.parse(getCachedValidators(chain))
      const val = vals.find(x => x.operator_address === addr)
      if (val) {
        return val.description.moniker
      }
      return addr
    },
    init() {
      this.accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (this.accounts) {
        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            this.$http.getStakingDelegations(add.addr, chains[add.chain]).then(res => {
              if (res.delegation_responses && res.delegation_responses.length > 0) {
                const delegation = res.delegation_responses.map(x => {
                  const x2 = x
                  x2.keyname = acc
                  x2.chain = chains[add.chain]
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
