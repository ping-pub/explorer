<template>
  <div>
    <b-card
      no-body
    >
      <b-card-header>
        <b-card-title>
          Validators (Max:{{ stakingParameters.max_validators }})
          <small class="text-muted">
            <b-badge variant="danger">
              &nbsp;
            </b-badge>
            Top 33%
            <b-badge variant="warning">
              &nbsp;
            </b-badge>
            Top 67% of Voting Power
          </small>
        </b-card-title>
      </b-card-header>
      <b-table
        :items="validators"
        :fields="validator_fields"
        :sort-desc="true"
        sort-by="tokens"
        striped
        hover
        responsive
      >
        <!-- A virtual column -->
        <template #cell(index)="data">
          <b-badge
            :variant="rankBadge(data)"
          >
            {{ data.index + 1 }}
          </b-badge>
        </template>
        <!-- Column: Validator -->
        <template #cell(description)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                v-if="data.item.avatar"
                v-b-tooltip.hover.v-primary
                v-b-tooltip.hover.right="data.item.description.details"
                size="32"
                variant="light-primary"
                :src="data.item.avatar"
              />
              <b-avatar
                v-if="!data.item.avatar"
                v-b-tooltip.hover.v-primary
                v-b-tooltip.hover.right="data.item.description.details"
              >
                <feather-icon icon="ServerIcon" />
              </b-avatar>
            </template>
            <span class="font-weight-bolder d-block text-nowrap">
              <router-link
                :to="`./staking/${data.item.operator_address}`"
              >
                {{ data.item.description.moniker }}
              </router-link>
            </span>
            <small class="text-muted">{{ data.item.description.website || data.item.description.identity }}</small>
          </b-media>
        </template>
        <!-- Token -->
        <template #cell(tokens)="data">
          <div
            v-if="data.item.tokens > 0"
            class="d-flex flex-column"
          >
            <span class="font-weight-bold mb-0">{{ tokenFormatter(data.item.tokens, stakingParameters.bond_denom) }}</span>
            <span class="font-small-2 text-muted text-nowrap">{{ percent(data.item.tokens/stakingPool.bondedToken) }}%</span>
          </div>
          <span v-else>{{ data.item.delegator_shares }}</span>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BTable, BMedia, BAvatar, BBadge, BCard, BCardHeader, BCardTitle, VBTooltip,
} from 'bootstrap-vue'
import {
  Validator, percent, StakingParameters, formatToken,
} from '@/libs/data'
import { keybase } from '@/libs/fetch'
// import fetch from 'node-fetch'

export default {
  components: {
    BCard,
    BTable,
    BMedia,
    BAvatar,
    BBadge,
    BCardHeader,
    BCardTitle,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      islive: true,
      mintInflation: 0,
      stakingPool: {},
      stakingParameters: new StakingParameters(),
      validators: [new Validator()],
      delegations: [new Validator()],
      validator_fields: [
        { key: 'index', label: '#' },
        { key: 'description', label: 'Validator', sortable: true },
        {
          key: 'tokens',
          label: 'Voting Power',
          sortable: true,
          tdClass: 'text-right',
          thClass: 'text-right',
          sortByFormatted: true,
        },
        {
          key: 'commission',
          sortable: true,
          formatter: value => `${percent(value.rate)}%`,
          tdClass: 'text-right',
          thClass: 'text-right',
        },
        {
          key: 'apr',
          formatter: (value, i, data) => this.apr(value, i, data),
          tdClass: 'text-right',
          thClass: 'text-right',
        },
        { key: 'operation' },
      ],
    }
  },
  created() {
    this.$http.getStakingPool().then(res => {
      this.stakingPool = res
    })
    this.$http.getMintingInflation().then(res => {
      this.mintInflation = res
    })
    this.$http.getStakingParameters().then(res => {
      this.stakingParameters = res
    })
    this.$http.getValidatorList().then(res => {
      const identities = []
      const temp = res
      for (let i = 0; i < temp.length; i += 1) {
        const { identity } = temp[i].description
        const url = this.$store.getters['chains/getAvatarById'](identity)
        if (url) {
          temp[i].avatar = url
        } else if (identity && identity !== '') {
          identities.push(identity)
        }
      }
      this.validators = temp

      // fetch avatar from keybase
      let promise = Promise.resolve()
      identities.forEach(item => {
        promise = promise.then(() => new Promise(resolve => {
          this.avatar(item, resolve)
        }))
      })
    })
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    percent,
    tokenFormatter(amount, denom) {
      return formatToken({ amount, denom })
    },
    apr(value, i, data) {
      return `${percent((1 - data.commission.rate) * this.mintInflation)} %`
    },
    rankBadge(data) {
      const { index, item } = data
      if (index === 0) {
        window.sum = item.tokens
      } else {
        window.sum += item.tokens
      }
      console.log(this.stakingPool.bondedToken)
      const rank = window.sum / this.stakingPool.bondedToken
      if (rank < 0.333) {
        return 'danger'
      }
      if (rank < 0.67) {
        return 'warning'
      }
      return 'primary'
    },
    avatar(identity, resolve) {
      if (this.islive) {
        keybase(identity).then(d => {
          resolve()
          if (Array.isArray(d.them) && d.them.length > 0) {
            const pic = d.them[0].pictures
            if (pic) {
              const validator = this.validators.find(u => u.description.identity === identity)
              this.$set(validator, 'avatar', pic.primary.url)
              this.$store.commit('cacheAvatar', { identity, url: pic.primary.url })
            }
          }
        })
      }
    },
  },
}
</script>
