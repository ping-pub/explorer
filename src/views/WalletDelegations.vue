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
            <b-avatar
              :src="data.item.validator.logo"
              size="18"
              variant="light-primary"
              rounded=""
            />
            {{ data.item.validator.moniker }}
          </router-link>
        </template>
        <template #cell(delegator)="data">
          <router-link :to="`/${data.item.validator.chain}/account/${data.item.delegator_address}`">
            Withdraw
          </router-link>
        </template>
        <template #cell(action)="data">
          <!-- size -->
          <b-button-group
            size="sm"
          >
            <b-button
              v-b-modal.operation-modal
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Delegate'"
              variant="outline-primary"
              @click="selectValue('Delegate',data.item)"
            >
              <feather-icon icon="LogInIcon" />
            </b-button>
            <b-button
              v-b-modal.operation-modal
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Redelegate'"
              variant="outline-primary"
              @click="selectValue('Redelegate',data.item)"
            >
              <feather-icon icon="ShuffleIcon" />
            </b-button>
            <b-button
              v-b-modal.operation-modal
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-tooltip.hover.top="'Unbond'"
              variant="outline-primary"
              @click="selectValue('Unbond',data.item)"
            >
              <feather-icon icon="LogOutIcon" />
            </b-button>
          </b-button-group>
        </template>
      </b-table>
    </b-card>

    <!--- not completed--->
    <operation-modal
      :type="operationModalType"
      :address="address"
      :validator-address="selectedValidator"
    />
  </div>
</template>

<script>
import {
  BButton, VBTooltip, BTable, BCard, BButtonGroup, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  formatToken, getCachedValidators, getLocalAccounts, getLocalChains, tokenFormatter,
} from '@/libs/utils'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import OperationModal from '@/views/components/OperationModal/index.vue'

export default {
  components: {
    BAvatar,
    BButton,
    BButtonGroup,
    BTable,
    BCard,
    FeatherIcon,
    OperationModal,
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
          // sortByFormatted: true,
        },
        {
          key: 'delegation',
          sortable: true,
          // sortByFormatted: true,
        },
        {
          key: 'reward',
          sortable: true,
          // sortByFormatted: true,
        },
        {
          key: 'delegator',
          label: '',
          sortable: true,
          // sortByFormatted: true,
        },
      ],
      address: '',
      selectedValidator: '',
      accounts: [],
      delegations: [],
      rewards: {},
      operationModalType: '',
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
      const val = vals.find(x => x.operator_address === addr)
      if (val) {
        return val.description.moniker
      }
      return addr
    },
    findReward(delegator, validator) {
      const reward = this.rewards[delegator]?.rewards.find(x => x.validator_address === validator) || null
      if (reward) {
        return tokenFormatter(reward.reward)
      }
      return '-'
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
