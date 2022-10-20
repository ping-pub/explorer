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
        <b-media
          v-for="prop in proprosals2"
          :key="prop.id"
          no-body
          class="mb-1"
        >
          <b-media-aside
            v-b-modal.operation-modal
            @click="selectProposal('Vote',prop.id, prop.title)"
          >
            <b-avatar
              rounded
              size="42"
              :variant="myVotes[prop.id] ? 'light-primary': 'primary'"
            >
              {{ myVotes[prop.id] || 'Vote' }}
            </b-avatar>
          </b-media-aside>
          <b-link :to="`./${chain}/gov/${prop.id}`">
            <b-media-body class="d-flex flex-column justify-content-center">
              <h6 class="transaction-title">
                {{ prop.id }}. {{ prop.title }}
              </h6>
              <small>{{ formatType(prop.contents['@type']) }}  {{ formatEnding(prop.voting_end_time) }}</small>
            </b-media-body>
          </b-link>
        </b-media>
        <div v-if="proprosals2.length === 0">
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
      <b-row v-if="stakingList && stakingList.length > 0">
        <b-col>
          <b-card no-body>
            <b-table
              :items="stakingList"
              :fields="fields"
              striped
              hover
              responsive="sm"
              stacked="sm"
            >
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
                    @click="selectDelegation(data,'Delegate')"
                  >
                    <feather-icon icon="LogInIcon" />
                  </b-button>
                  <b-button
                    v-b-modal.operation-modal
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    v-b-tooltip.hover.top="'Redelegate'"
                    variant="outline-primary"
                    @click="selectDelegation(data,'Redelegate')"
                  >
                    <feather-icon icon="ShuffleIcon" />
                  </b-button>
                  <b-button
                    v-b-modal.operation-modal
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    v-b-tooltip.hover.top="'Unbond'"
                    variant="outline-primary"
                    @click="selectDelegation(data,'Unbond')"
                  >
                    <feather-icon icon="LogOutIcon" />
                  </b-button>
                </b-button-group>
              </template>
            </b-table>
            <b-card-footer class="text-right">
              <b-button
                v-b-modal.operation-modal
                variant="outline-primary"
                @click="selectWithdraw()"
              >
                <feather-icon icon="AwardIcon" />
                Widthdraw Rewards
              </b-button>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>

      <b-row v-if="unbonding && unbonding.length > 0">
        <b-col>
          <b-card>
            <b-card-header class="pt-0 pl-0 pr-0">
              <b-card-title>Unbonding Tokens</b-card-title>
            </b-card-header>
            <b-card-body class="pl-0 pr-0">
              <b-row
                v-for="item in unbonding"
                :key="item.validator_address"
              >
                <b-col cols="12">
                  <span class="font-weight-bolder">From: <router-link :to="`../staking/${item.validator_address}`">{{ item.validator_address }}</router-link></span>
                </b-col>
                <b-col cols="12">
                  <b-table
                    :items="item.entries"
                    class="mt-1"
                    striped
                    hover
                    responsive="sm"
                    stacked="sm"
                  >
                    <template #cell(completion_time)="data">
                      {{ formatDate(data.item.completion_time) }}
                    </template>
                    <template #cell(initial_balance)="data">
                      {{ data.item.initial_balance }}
                    </template>
                    <template #cell(balance)="data">
                      {{ data.item.balance }}
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-row
        v-if="address"
        class="mt-1"
      >
        <b-col cols="6">
          <b-button
            v-b-modal.operation-modal
            block
            variant="success"
            @click="selectSend()"
          >
            <feather-icon icon="SendIcon" />
            Send
          </b-button>
        </b-col>
        <b-col cols="6">
          <b-button
            block
            variant="info"
            :to="`${chain}/account/${address}/receive`"
          >
            <feather-icon
              icon="PlusCircleIcon"
            />
            receive
          </b-button>
        </b-col>
      </b-row>
    </b-card>
    <router-link to="/wallet/import">
      <b-card class="addzone text-center">
        <feather-icon icon="PlusIcon" />
        Connect Wallet
      </b-card>
    </router-link>
    <operation-modal
      :address="address"
      :validator-address="selectedValidator"
      :type="operationModalType"
      :proposal-id="selectedProposalId"
      :proposal-title="selectedTitle"
    />
  </div>
</template>

<script>
import {
  BRow, BCol, BAlert, BCard, BTable, BFormCheckbox, BCardHeader, BCardTitle, BMedia, BMediaAside, BMediaBody, BAvatar,
  BCardBody, BLink, BButtonGroup, BButton, BTooltip, VBModal, VBTooltip, BCardFooter,
} from 'bootstrap-vue'
import {
  formatNumber, formatTokenAmount, isToken, percent, timeIn, toDay, toDuration, tokenFormatter, getLocalAccounts,
  getStakingValidatorOperator,
} from '@/libs/utils'
import OperationModal from '@/views/components/OperationModal/index.vue'
import Ripple from 'vue-ripple-directive'
import dayjs from 'dayjs'
import ParametersModuleComponent from './components/parameters/ParametersModuleComponent.vue'
import DashboardCardHorizontal from './components/dashboard/DashboardCardHorizontal.vue'
import DashboardCardVertical from './components/dashboard/DashboardCardVertical.vue'
import DashboardPriceChart2 from './components/dashboard/DashboardPriceChart2.vue'
import FeatherIcon from '../@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BAvatar,
    BButtonGroup,
    BTooltip,
    BButton,
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
    BCardFooter,

    OperationModal,
    ParametersModuleComponent,
    DashboardCardHorizontal,
    DashboardPriceChart2,
    DashboardCardVertical,
    FeatherIcon,
  },
  directives: {
    'b-modal': VBModal,
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: ['validator', 'delegation', 'rewards', 'action'],
      delegations: [],
      rewards: [],
      unbonding: [],
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
      myVotes: {},
      selectedValidator: '',
      selectedProposalId: 0,
      selectedTitle: '',
      operationModalType: '',
      voteColors: {
        YES: 'success',
        NO: 'warning',
        ABSTAIN: 'info',
        NO_WITH_VETO: 'danger',
      },

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
          .map(v => ({ wallet: v[0], address: v[1].address.find(x => x.chain === this.$store.state.chains.selected.chain_name) }))
          .filter(v => v.address)
          .find(x => x.wallet === key)
        if (account) {
          this.fetchAccount(account.address.addr)
        }
      }
      return key || 'Wallet'
    },
    proprosals2() {
      return this.proposals
    },
    stakingList() {
      return this.delegations.map(x => {
        const rewards = this.rewards.find(r => r.validator_address === x.delegation.validator_address)
        return {
          valAddress: x.delegation.validator_address,
          validator: getStakingValidatorOperator(this.$store.state.chains.selected.chain_name, x.delegation.validator_address),
          delegation: this.formatToken([x.balance]),
          rewards: rewards ? this.formatToken(rewards.reward) : '',
          action: '',
        }
      })
    },
  },
  created() {
    this.$http.getGovernanceListByStatus(2).then(res => {
      this.proposals = res.proposals
    })
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
    if (conf.excludes && conf.excludes.indexOf('mint') > -1) {
      this.inflation = '-'
    } else {
      this.$http.getMintingInflation().then(res => {
        this.inflation = `${percent(res)}%`
      }).catch(() => {
        this.inflation = '-'
      })
    }
  },
  methods: {
    selectProposal(modal, pid, title) {
      this.operationModalType = modal
      this.selectedProposalId = Number(pid)
      this.selectedTitle = title
    },
    selectDelegation(v, type) {
      this.selectedValidator = v.item.valAddress
      this.operationModalType = type
    },
    selectSend() {
      this.operationModalType = 'Transfer'
    },
    selectWithdraw() {
      this.operationModalType = 'Withdraw'
    },
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
        this.rewards = res.rewards
        this.walletRewards = this.formatToken(res.rewards.map(x => x.reward).flat())
      })
      this.$http.getStakingDelegations(address).then(res => {
        const delegations = res.delegation_responses || res
        this.delegations = delegations
        this.walletStaking = this.formatToken(delegations.map(x => x.balance).flat())
      })
      this.$http.getStakingUnbonding(address).then(res => {
        const token = this.$store.state.chains.selected.assets[0]
        if (token) {
          const newTokens = []
          const denom = token.base
          const unbonding = res.unbonding_responses || res
          this.unbonding = unbonding
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
      this.proposals.forEach(x => {
        this.$http.getGovernanceProposalVote(x.id, address, null)
          .then(v => {
            this.myVotes[x.id] = this.formatVoteOption(v.vote.option)
          })
          .catch(() => {
            this.myVotes[x.id] = null
          })
      })
    },
    formatVoteOption(v) {
      return v.replaceAll('VOTE_OPTION_', '')
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
    formatDate: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
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
