<template>
  <div>
    <b-row class="match-height">
      <b-col
        v-for="(p,i) in list"
        :key="`${p.id}-${i}`"
        lg="6"
        md="12"
      >
        <b-card :bg-variant="p.variant">
          <b-card-title
            class="mb-0"
          >
            <b-avatar
              :src="p.chain.logo"
              variant="light-primary"
              size="22"
            />
            <span class="text-uppercase"> {{ p.chain.chain_name }}</span>
            <br>
            #{{ p.id }}.
            <router-link
              :to="`/${p.chain.chain_name}/gov/${p.id}?from=/wallet/votes`"
            >
              {{ p.title }} {{ p.status }}
            </router-link></b-card-title>
          <b-card-body md="12">
            <flip-countdown :deadline="p.countdown" />
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { getLocalAccounts, getLocalChains } from '@/libs/utils'
import {
  BRow, BCol, BCard, BCardTitle, BCardBody, BAvatar,
} from 'bootstrap-vue'
import FlipCountdown from 'vue2-flip-countdown'
import dayjs from 'dayjs'

export default {
  name: 'WalletUpgradeEvents',
  components: {
    BAvatar,
    BRow,
    BCol,
    BCard,
    BCardTitle,
    BCardBody,
    FlipCountdown,
  },
  props: {
    content: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      proposals: [],
      latest: {},
    }
  },
  computed: {
    list() {
      return this.proposals
        .filter(x => [2, 3].includes(x.status))
        .map(x => {
          const x2 = x
          x2.countdown = this.estmatetime(x.chain.chain_name, x.contents.plan)
          x2.variant = dayjs().isAfter(dayjs(x2.countdown)) ? 'dark' : ''
          return x2
        })
        .sort((a, b) => dayjs(b.voting_end_time).unix() - dayjs(a.voting_end_time).unix())
    },
  },
  mounted() {
    const accounts = getLocalAccounts()
    if (accounts) {
      const chains = getLocalChains()
      const toQuery = {}

      Object.keys(accounts).forEach(acc => {
        accounts[acc].address.forEach(add => {
          const conf = chains[add.chain]
          if (conf) {
            toQuery[add.chain] = conf
          }
        })
      })

      Object.values(toQuery).forEach(item => {
        this.fetchProposals(item)
      })
    }
  },
  methods: {
    estmatetime(chainname, plan) {
      if (plan.height > 0) {
        const latest = this.latest[chainname]
        if (latest) {
          const gap = plan.height - this.latest[chainname].height
          if (gap > 0) {
            return dayjs().add(gap * 6, 'second').format('YYYY-MM-DD hh:mm:ss')
          }
        }
        return '1990-01-01'
      }
      return dayjs(plan.time).format('YYYY-MM-DD hh:mm:ss')
    },
    fetchProposals(item) {
      this.$http.getGovernanceList('', item).then(data => {
        data.proposals.forEach(p => {
          const type = p.contents['@type']
          if (type.indexOf('SoftwareUpgradeProposal') > 0) {
            const p2 = p
            p2.chain = item
            if (dayjs(p.voting_end_time).add(15, 'day').isAfter(dayjs())) {
              this.proposals.push(p2)
            }
          }
        })
      }, err => {
        throw new Error(err)
      })
      this.$http.getLatestBlock(item).then(b => {
        this.$set(this.latest, item.chain_name, b.block.header)
      })
    },
  },
}
</script>
