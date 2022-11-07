<template>
  <b-tabs content-class="mt-1">
    <!-- This tabs content will always be mounted -->
    <b-tab
      title="Active Proposals"
      pill
    >
      <b-row class="match-height">
        <b-col
          v-for="(p,i) in list"
          :key="`${p.id}-${i}`"
          lg="6"
          md="12"
        >
          <b-card>
            <b-card-title @click="description(`model-${i}`)">
              <b-avatar
                v-b-tooltip.hover
                :src="p.chain.logo"
                variant="light-primary"
                size="22"
                :title="p.chain.chain_name"
              />
              #{{ p.id }}.
              <router-link :to="`/${p.chain.chain_name}/gov/${p.id}?from=/wallet/votes`">
                {{ p.title }}
              </router-link>
            </b-card-title>
            <div
              class="overflow-auto"
              :class="descId === `model-${i}`?'d-block': 'd-none'"
            >
              <object-field-component
                :tablefield="p.contents"
                :small="false"
              />
            </div>
            <div class="gov-wrapper d-flex flex-wrap">
              <div class="gov">
                <p class="card-text mb-25">
                  Type
                </p>
                <h6 class="mb-0">
                  {{ formatType(p.contents['@type']) }}
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  Start Date
                </p>
                <h6 class="mb-0">
                  {{ formatDate(p.voting_start_time) }}
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  End Date
                </p>
                <h6 class="mb-0">
                  {{ formatDate(p.voting_end_time) }}
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  Deposit
                </p>
                <h6 class="mb-0">
                  {{ formatToken(p.total_deposit) || '-' }}
                </h6>
              </div>
            </div>
            <b-progress
              :max="100"
              height="2rem"
              class="my-2"
              show-progress
            >
              <b-progress-bar
                :id="'vote-yes'+p.id"
                variant="success"
                :value="percent(p.tally.yes)"
                show-progress
                :label="`${percent(p.tally.yes).toFixed()}%`"
              />
              <b-progress-bar
                :id="'vote-no'+p.id"
                variant="danger"
                :value="percent(p.tally.no)"
                :label="`${percent(p.tally.no).toFixed()}%`"
                show-progress
              />
              <b-progress-bar
                :id="'vote-veto'+p.id"
                class="bg-danger bg-darken-4"
                :value="percent(p.tally.veto)"
                :label="`${percent(p.tally.veto).toFixed()}%`"
                show-progress
              />
              <b-progress-bar
                :id="'vote-abstain'+p.id"
                variant="secondary"
                :value="percent(p.tally.abstain)"
                :label="`${percent(p.tally.abstain).toFixed()}%`"
                show-progress
              />
            </b-progress>
            <b-tooltip
              :target="'vote-yes'+p.id"
            >
              {{ percent(p.tally.yes) }}% voted Yes
            </b-tooltip>
            <b-tooltip
              :target="'vote-no'+p.id"
            >
              {{ percent(p.tally.no) }}% voted No
            </b-tooltip>
            <b-tooltip
              :target="'vote-veto'+p.id"
            >
              {{ percent(p.tally.veto) }}% voted No With Veto
            </b-tooltip>
            <b-tooltip
              :target="'vote-abstain'+p.id"
            >
              {{ percent(p.tally.abstain) }}% voted Abstain
            </b-tooltip>
            <b-card-footer class="pb-0">
              <span
                v-for="(v,k) in p.votes"
                :key="k"
              > <b-badge :variant="color(v.vote.option)">{{ v.keyname }} : {{ formatOption(v.vote.option) }}</b-badge></span>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-tab>

    <!-- This tabs content will not be mounted until the tab is shown -->
    <!-- and will be un-mounted when hidden -->
    <b-tab
      title="Upgrade Events"
      lazy
    >
      <wallet-upgrade-events />
    </b-tab>
  </b-tabs>
</template>

<script>
import {
  VBTooltip, BTabs, BTab, BRow, BCol, BCard, BCardFooter, BBadge,
  BCardTitle, BProgress, BProgressBar, BTooltip, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {
  getLocalAccounts, getLocalChains, percent, ProposalTally, tokenFormatter,
} from '@/libs/utils'
import dayjs from 'dayjs'
import WalletUpgradeEvents from './WalletUpgradeEvents.vue'
import ObjectFieldComponent from './components/ObjectFieldComponent.vue'

export default {
  components: {
    BAvatar,
    BTab,
    BTabs,
    BRow,
    BCol,
    BCard,
    BCardFooter,
    BCardTitle,
    BBadge,
    BProgress,
    BProgressBar,
    BTooltip,
    WalletUpgradeEvents,
    ObjectFieldComponent,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      islive: true,
      proposals: [],
      descId: null,
      tally: {},
      // voters: [], // need to be query.
      votes: [], // votes of voters
    }
  },
  computed: {
    list() {
      return this.proposals.map(x => {
        const x2 = x
        x2.tally = this.tally[`${x.chain.chain_name}-${x.id}`] || new ProposalTally()
        x2.votes = this.votes.filter(v => v.vote.proposal_id === x.id)
        return x2
      }).sort((a, b) => dayjs(b.voting_start_time).unix() - dayjs(a.voting_start_time).unix())
    },
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    description(v) {
      this.descId = v === this.descId ? null : v
    },
    color(v) {
      switch (v) {
        case 'VOTE_OPTION_YES':
          return 'success'
        case 'VOTE_OPTION_NO':
          return 'warning'
        case 'VOTE_OPTION_NOWITHVETO':
          return 'danger'
        case 'VOTE_OPTION_ABSTAIN':
          return 'info'
        default:
          return 'danger'
      }
    },
    keyname(addr) {
      const key = Object.values(this.accounts).find(k => k.address.findIndex(a => a.addr === addr) > -1)
      return key ? key.name : addr.substring(addr.length - 6)
    },
    formatType(v) {
      const txt = String(v).replace('Proposal', '')
      const index = txt.lastIndexOf('.')
      return index > 0 ? txt.substring(index + 1) : txt
    },
    percent: v => percent(v),
    formatDate: v => dayjs(v).format('YYYY-MM-DD'),
    formatToken: v => tokenFormatter(v, {}),
    formatOption: v => {
      const start = String(v).lastIndexOf('_')
      if (start > 0) {
        return String(v).substring(start + 1)
      }
      return v
    },
    init() {
      this.accounts = getLocalAccounts()
      if (this.accounts) {
        const chains = getLocalChains()
        const toQuery = {}

        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            const conf = chains[add.chain]
            if (conf) {
              if (toQuery[add.chain]) {
                toQuery[add.chain].addresses.push(add.addr)
              } else {
                toQuery[add.chain] = {
                  conf,
                  addresses: [add.addr],
                }
              }
            }
          })
        })

        Object.values(toQuery).forEach(item => {
          this.fetchProposals(item)
        })
      }
    },
    fetchProposals(item) {
      if (this.islive) {
        let promise = Promise.resolve()
        // identities.forEach(item => {
        //   promise = promise.then(() => new Promise(resolve => {
        //     this.avatar(item, resolve)
        //   }))
        // })
        this.$http.getGovernanceListByStatus(2, item.conf).then(data => {
          data.proposals.forEach(p => {
            const p2 = p
            p2.chain = item.conf
            this.proposals.push(p2)
            item.addresses.forEach(a => {
              // this.fetchMyVote(p.id, a, item.conf)
              // this.voters.push({ pid: p.id, addr: a, conf: item.conf })
              promise = promise.then(() => new Promise(resolve => {
                this.fetchMyVote(p.id, a, item.conf, resolve)
              }))
            })
          })
          this.updateTally(data.proposals, item.conf)
        }, err => {
          throw new Error(err)
        })
      }
    },
    fetchMyVote(pid, addr, conf, resolve) {
      if (this.islive) {
        this.$http.getGovernanceProposalVote(pid, addr, conf).then(data => {
          resolve()
          const x = data
          x.keyname = this.keyname(data.vote.voter)
          this.votes.push(x)
        }).catch(() => {
          resolve()
        })
      }
    },
    updateTally(voting, chain) {
      if (voting.length > 0) {
        voting.forEach(p => this.$http.getGovernanceTally(p.id, 0, chain).then(update => {
          this.$set(this.tally, `${chain.chain_name}-${p.id}`, update)
        }))
      }
    },
  },
}
</script>

<style scoped>
section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card {
  flex-basis: 49%;
}
.gov-wrapper {
    display: flex;
    justify-content:center;
}
.dark-layout .gov-wrapper .gov {
    background-color: #161d31;
}
.gov-wrapper .gov {
    padding: .5rem;
    margin: .3rem;
    min-width: 7.5rem;
    text-align: center;
    background-color: #f8f8f8;
    border-radius: .357rem;
}

</style>
