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
      <b-col>
        <parameters-module-component :data="chain" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <parameters-module-component :data="mint" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <parameters-module-component :data="staking" />
      </b-col>
    </b-row>
    <b-row v-if="gov.items.length > 0">
      <b-col>
        <parameters-module-component :data="gov" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <parameters-module-component :data="distribution" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <parameters-module-component :data="slashing" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BAlert, BCard,
} from 'bootstrap-vue'
import {
  formatNumber, formatTokenAmount, isToken, percent, timeIn, toDay, toDuration, tokenFormatter,
} from '@/libs/utils'

import ParametersModuleComponent from './components/parameters/ParametersModuleComponent.vue'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BCard,
    ParametersModuleComponent,
  },
  data() {
    return {
      syncing: false,
      latestTime: '',
      marketData: null,
      chain: {
        title: '',
        class: 'border-primary',
        items: [
          { subtitle: 'height', icon: 'BoxIcon', color: 'light-success' },
          { subtitle: 'bonded_and_supply', icon: 'DollarSignIcon', color: 'light-danger' },
          { subtitle: 'bonded_ratio', icon: 'PercentIcon', color: 'light-warning' },
          { subtitle: 'inflation', icon: 'TrendingUpIcon', color: 'light-primary' },
        ],
      },
      staking: {
        title: 'Staking Parameters',
        items: [],
      },
      distribution: {
        title: 'Distribution Parameters',
        items: [],
      },
      slashing: {
        title: 'Slashing Parameters',
        items: null,
      },
      mint: {
        title: 'Mint Parameters',
        items: null,
      },
      gov: {
        title: 'Governance Parameters',
        items: [],
      },
    }
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      const height = this.chain.items.findIndex(x => x.subtitle === 'height')

      this.$set(this.chain, 'title', `Chain ID: ${res.block.header.chain_id}`)
      this.$set(this.chain.items[height], 'title', res.block.header.height)
      if (timeIn(res.block.header.time, 3, 'm')) {
        this.syncing = true
      } else {
        this.syncing = false
      }
      this.latestTime = toDay(res.block.header.time, 'long')
    })

    this.$http.getMarketChart().then(res => {
      this.marketData = res
    })

    this.$http.getStakingParameters().then(res => {
      this.staking = this.normalize(res, 'Staking Parameters')
      Promise.all([this.$http.getStakingPool(), this.$http.getBankTotal(res.bond_denom)])
        .then(pool => {
          const bondedAndSupply = this.chain.items.findIndex(x => x.subtitle === 'bonded_and_supply')
          this.$set(this.chain.items[bondedAndSupply], 'title', `${formatNumber(formatTokenAmount(pool[0].bondedToken, 2, res.bond_denom, false), true, 0)}/${formatNumber(formatTokenAmount(pool[1].amount, 2, res.bond_denom, false), true, 0)}`)
          const bondedRatio = this.chain.items.findIndex(x => x.subtitle === 'bonded_ratio')
          this.$set(this.chain.items[bondedRatio], 'title', `${percent(pool[0].bondedToken / pool[1].amount)}%`)
        })
    })
    this.$http.getSlashingParameters().then(res => {
      this.slashing = this.normalize(res, 'Slashing Parameters')
    })

    const conf = this.$http.getSelectedConfig()
    if (conf.excludes && conf.excludes.indexOf('mint') > -1) {
      this.mint = null
    } else {
      this.$http.getMintingInflation().then(res => {
        const chainIndex = this.chain.items.findIndex(x => x.subtitle === 'inflation')
        this.$set(this.chain.items[chainIndex], 'title', `${percent(res)}%`)
      })
      this.$http.getMintParameters().then(res => {
        this.mint = this.normalize(res, 'Minting Parameters')
      })
    }

    this.$http.getDistributionParameters().then(res => {
      this.distribution = this.normalize(res, 'Distribution Parameters')
    })
    if (conf.excludes && conf.excludes.indexOf('governance') > -1) {
      this.gov.items = []
    } else {
      Promise.all([
        this.$http.getGovernanceParameterDeposit(),
        this.$http.getGovernanceParameterTallying(),
        this.$http.getGovernanceParameterVoting(),
      ]).then(data => {
        let items = []
        data.forEach(item => {
          const values = this.normalize(item, '').items
          items = items.concat(values)
        })
        this.gov.items = items
        this.$set(this.gov, 'items', items)
      })
    }
  },
  methods: {
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

</style>
