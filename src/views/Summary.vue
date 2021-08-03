<template>
  <div>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="chain" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="mint" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="staking" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="gov" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="distribution" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="slasing" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import { formatNumber, percent, tokenFormatter } from '@/libs/data'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import localeData from 'dayjs/plugin/localeData'
import SummaryParmetersComponent from './SummaryParmetersComponent.vue'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(localeData)

export default {
  components: {
    BRow,
    BCol,
    SummaryParmetersComponent,
  },
  data() {
    return {
      chain: {
        title: '',
        class: 'border-primary',
        items: [],
      },
      staking: {
        title: 'Staking Parameters',
        items: [],
      },
      distribution: {
        title: 'Distribution Parameters',
        items: [],
      },
      slasing: {
        title: 'Slasing Parameters',
        items: [],
      },
      mint: {
        title: 'Distribution Parameters',
        items: [],
      },
      gov: {
        title: 'Governance Parameters',
        items: [],
      },
    }
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      this.chain.items.push({
        title: res.block.header.chain_id, subtitle: 'chain_id', icon: 'LinkIcon', color: 'light-primary',
      })
      this.chain.items.push({
        title: res.block.header.height, subtitle: 'height', icon: 'BoxIcon', color: 'light-success',
      })
    })

    this.$http.getStakingParameters().then(res => {
      this.staking = this.normalize(res, 'Staking Parameters')
      Promise.all([this.$http.getStakingPool(), this.$http.getBankTotal(res.bond_denom)])
        .then(pool => {
          const nano = 1000000
          this.chain.items.push({
            title: `${formatNumber(pool[0].bondedToken / nano, true, 0)} / ${formatNumber(pool[1].amount / nano, true, 0)}`, subtitle: 'bonded_and_supply', icon: 'DollarSignIcon', color: 'light-danger',
          })
          this.chain.items.push({
            title: `${percent(pool[0].bondedToken / pool[1].amount)}%`, subtitle: 'bonded_ratio', icon: 'PercentIcon', color: 'light-warning',
          })
        })
    })
    this.$http.getSlashingParameters().then(res => {
      this.slasing = this.normalize(res, 'Slasing Parameters')
    })
    this.$http.getMintParameters().then(res => {
      this.mint = this.normalize(res, 'Minting Parameters')
    })
    this.$http.getDistributionParameters().then(res => {
      this.distribution = this.normalize(res, 'Distribution Parameters')
    })
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
  },
  methods: {
    normalize(data, title) {
      const items = this.makeItems(data)
      return {
        title,
        items,
      }
    },
    makeItems(data) {
      return Object.keys(data).map(k => {
        if (Array.isArray(data[k])) {
          return { title: tokenFormatter(data[k]), subtitle: k }
        }
        const d = Number(data[k])
        if (d < 1.01) {
          return { title: `${percent(d)}%`, subtitle: k }
        }
        if (d > 1000000000) {
          return { title: `${dayjs.duration(d / 1000000).humanize()}`, subtitle: k }
        }
        return { title: data[k], subtitle: k }
      })
    },
  },
}
</script>

<style>

</style>
