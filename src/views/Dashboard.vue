<template>
  <div>
    <b-alert
      variant="danger"
      :show="syncing"
    >
      <div class="alert-body">
        <span>No new blocks have been produced since  <strong>{{ latestTime }}</strong> </span>
      </div>
    </b-alert>

    <b-row>
      <b-col><dashboard-price-chart-2 /></b-col>
    </b-row>
    <!-- Stats Card Vertical -->
    <b-row class="match-height">
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          icon="BoxIcon"
          :statistic="height"
          statistic-title="Height"
          color="info"
        />
      </b-col>
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          color="warning"
          icon="DollarSignIcon"
          :statistic="supply"
          statistic-title="Total Supply"
        />
      </b-col>
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          color="danger"
          icon="PercentIcon"
          :statistic="ratio"
          :statistic-title="`Bonded: ${bonded}`"
        />
      </b-col>
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          color="primary"
          icon="TrendingUpIcon"
          :statistic="inflation"
          statistic-title="Inflation"
        />
      </b-col>
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          color="success"
          icon="AwardIcon"
          :statistic="communityPool"
          statistic-title="Community Pool"
        />
      </b-col>
      <b-col
        xl="2"
        md="4"
        sm="6"
      >
        <dashboard-card-vertical
          hide-chart
          color="danger"
          icon="UserCheckIcon"
          :statistic="validators"
          statistic-title="Active Validators"
        />
      </b-col>
    </b-row>
    <b-card no-body>
      <b-card-header>
        <b-card-title>Active Proposals</b-card-title>
      </b-card-header>
      <b-card-body>
        <b-link
          v-for="prop in proposals"
          :key="prop.id"
          :to="`./${chain}/gov/${prop.id}`"
        >
          <b-media
            no-body
            class="mb-1"
          >
            <b-media-aside>
              <b-avatar
                rounded
                size="42"
                variant="light-primary"
              >
                {{ prop.id }}
              </b-avatar>
            </b-media-aside>
            <b-media-body class="d-flex flex-column justify-content-center">
              <h6 class="transaction-title">
                {{ prop.title }}
              </h6>
              <small>{{ formatType(prop.contents['@type']) }}  {{ formatEnding(prop.voting_end_time) }}</small>
            </b-media-body>
          </b-media>
        </b-link>
        <div v-if="proposals.length === 0">
          No active proposal!
          <b-link :to="`./${chain}/gov`">
            Browse all
          </b-link>
        </div>
      </b-card-body>
    </b-card>
    <b-card
      border-variant="primary"
      bg-variant="transparent"
      class="shadow-none"
    >
      <b-card-title class="d-flex justify-content-between">
        <span>{{ walletName }} Assets </span>
        <small>
          <b-link
            v-if="address"
            :to="`./${chain}/account/${address}`"
          >
            More
          </b-link>
          <b-link
            v-else
            :to="`/wallet/accounts`"
          >
            Not connected?
          </b-link>
        </small>
      </b-card-title>
      <b-row>
        <b-col
          lg="3"
          sm="6"
        >
          <dashboard-card-horizontal
            icon="DollarSignIcon"
            color="success"
            :statistic="walletBalances"
            statistic-title="Balances"
          />
        </b-col>
        <b-col
          lg="3"
          sm="6"
        >
          <dashboard-card-horizontal
            icon="LockIcon"
            :statistic="walletStaking"
            statistic-title="Staking"
          />
        </b-col>
        <b-col
          lg="3"
          sm="6"
        >
          <dashboard-card-horizontal
            icon="ArrowUpCircleIcon"
            color="info"
            :statistic="walletRewards"
            statistic-title="Rewards"
          />
        </b-col>
        <b-col
          lg="3"
          sm="6"
        >
          <dashboard-card-horizontal
            icon="UnlockIcon"
            color="danger"

            :statistic="walletUnbonding"
            statistic-title="Unbonding"
          />
        </b-col>
      </b-row>
    </b-card>
    <router-link to="/wallet/import">
      <b-card class="addzone text-center">
        <feather-icon icon="PlusIcon" />
        Connect Wallet
      </b-card>
    </router-link>
  </div>
</template>

<script>
import {
  BRow, BCol, BAlert, BCard, BTable, BFormCheckbox, BCardHeader, BCardTitle, BMedia, BMediaAside, BMediaBody, BAvatar,
  BCardBody, BLink,
} from 'bootstrap-vue'
import {
  formatNumber, formatTokenAmount, isToken, percent, timeIn, toDay, toDuration, tokenFormatter, getLocalAccounts,
} from '@/libs/utils'
import ParametersModuleComponent from './components/parameters/ParametersModuleComponent.vue'
import DashboardCardHorizontal from './components/dashboard/DashboardCardHorizontal.vue'
import DashboardCardVertical from './components/dashboard/DashboardCardVertical.vue'
import DashboardPriceChart2 from './components/dashboard/DashboardPriceChart2.vue'

export default {
  components: {
    BAvatar,
    BRow,
    BCol,
    BAlert,
    BCard,
    BTable,
    BFormCheckbox,
    BCardHeader,
    BCardTitle,
    BMediaBody,
    BMediaAside,
    BMedia,
    BCardBody,
    BLink,

    ParametersModuleComponent,
    DashboardCardHorizontal,
    DashboardPriceChart2,
    DashboardCardVertical,
  },
  data() {
    return {
      chain: this.$store.state.chains.selected.chain_name,
      syncing: false,
      latestTime: '',
      marketData: null,
      height: '-',
      supply: '-',
      bonded: '-',
      validators: '-',
      communityPool: '-',
      ratio: '-',
      inflation: '-',
      proposals: [],

      walletBalances: '-',
      walletStaking: '-',
      walletRewards: '-',
      walletUnbonding: '-',
      address: null,
    }
  },
  computed: {
    walletName() {
      const key = this.$store?.state?.chains?.defaultWallet
      if (key) {
        const accounts = getLocalAccounts() || {}
        const account = Object.entries(accounts)
          .map(v => ({ wallet: v[0], address: v[1].address.find(x => x.chain === 'point') }))
          .filter(v => v.address)
          .find(x => x.wallet === key)
        if (account) {
          this.fetchAccount(account.address.addr)
        }
      }
      return key || 'Wallet'
    },
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      this.height = res.block.header.height
      if (timeIn(res.block.header.time, 3, 'm')) {
        this.syncing = true
      } else {
        this.syncing = false
      }
      this.latestTime = toDay(res.block.header.time, 'long')
      this.validators = res.block.last_commit.signatures.length
    })

    this.$http.getStakingParameters().then(res => {
      Promise.all([this.$http.getStakingPool(), this.$http.getBankTotal(res.bond_denom)])
        .then(pool => {
          this.supply = `${formatNumber(formatTokenAmount(pool[1].amount, 2, res.bond_denom, false), true, 2)}`
          this.bonded = `${formatNumber(formatTokenAmount(pool[0].bondedToken, 2, res.bond_denom, false), true, 2)}`
          this.ratio = `${percent(pool[0].bondedToken / pool[1].amount)}%`
        })
    })

    this.$http.getCommunityPool().then(res => {
      this.communityPool = this.formatToken(res.pool)
    })

    const conf = this.$http.getSelectedConfig()
    this.$http.getMintingInflation().then(res => {
      this.inflation = `${percent(res)}%`
    })

    this.$http.getGovernanceListByStatus(2).then(res => {
      this.proposals = res.proposals
    })
  },
  methods: {
    formatToken(tokens) {
      if (Array.isArray(tokens)) {
        let nativeToken = tokens.filter(x => x.denom.length < 11)
        if (tokens.length > 1) {
          const sum = {}
          const reduce = nativeToken.reduce((b, a) => {
            const b2 = b
            if (b2[a.denom]) {
              b2[a.denom] += Number(a.amount)
            } else {
              b2[a.denom] = Number(a.amount)
            }
            return b2
          }, sum)
          nativeToken = Object.keys(reduce).map(k => ({ denom: k, amount: reduce[k] }))
        }
        return tokenFormatter(nativeToken, {}, 0)
      }
      return '-'
    },
    fetchAccount(address) {
      this.address = address
      this.$http.getBankAccountBalance(address).then(bal => {
        this.walletBalances = this.formatToken(bal)
      })
      this.$http.getStakingReward(address).then(res => {
        this.walletRewards = this.formatToken(res.rewards.map(x => x.reward).flat())
      })
      this.$http.getStakingDelegations(address).then(res => {
        const delegations = res.delegation_responses || res
        this.walletStaking = this.formatToken(delegations.map(x => x.balance).flat())
      })
      this.$http.getStakingUnbonding(address).then(res => {
        const token = this.$store.state.chains.selected.assets[0]
        if (token) {
          const newTokens = []
          const denom = token.base
          const unbonding = res.unbonding_responses || res
          unbonding.forEach(x => {
            x.entries.forEach(y => {
              newTokens.push({
                amount: y.balance,
                denom,
              })
            })
          })
          if (newTokens.length > 0) {
            this.walletUnbonding = this.formatToken(newTokens)
          }
        }
      })
    },
    formatEnding(v) {
      return toDay(v, 'from')
    },
    formatType(v) {
      const txt = String(v).replace('Proposal', '')
      const index = txt.lastIndexOf('.')
      return index > 0 ? txt.substring(index + 1) : txt
    },
    normalize(data, title) {
      if (!data) return null
      const items = this.makeItems(data)
      return {
        title,
        items,
      }
    },
    makeItems(data) {
      return Object.keys(data).map(k => {
        if (isToken(data[k])) {
          return { title: tokenFormatter(data[k]), subtitle: k }
        }
        if (typeof data[k] === 'boolean') {
          return { title: data[k], subtitle: k }
        }
        return { title: this.convert(data[k]), subtitle: k }
      })
    },
    convert(v) {
      if (typeof v === 'object') {
        const v2 = {}
        Object.entries(v).forEach(e => {
          const k = e[0]
          const x = e[1]
          v2[k] = this.convert(x)
        })
        return v2
      }
      const d = parseFloat(v)
      if (d === 0) return '0'
      if (d < 1.01) {
        return `${percent(d)}%`
      }
      if (d > 1000000000) {
        return `${toDuration(d / 1000000)}`
      }
      if (d > 0) {
        return d.toFixed()
      }
      return v
    },
  },
}
</script>

<style>
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
