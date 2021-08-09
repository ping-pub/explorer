<template>
  <div>
    <b-row>
      <b-col>
        <summary-parmeters-component :data="chain" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <summary-assets-component />
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
import {
  formatNumber, isToken, percent, toDuration, tokenFormatter,
} from '@/libs/data'

import SummaryParmetersComponent from './SummaryParmetersComponent.vue'
import SummaryAssetsComponent from './SummaryAssetsComponent.vue'

export default {
  components: {
    BRow,
    BCol,
    SummaryParmetersComponent,
    SummaryAssetsComponent,
  },
  data() {
    return {
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
      slasing: {
        title: 'Slasing Parameters',
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
      aaaa: {
        options: {
          elements: {
            rectangle: {
              borderWidth: 2,
              borderSkipped: 'top',
            },
          },
          tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            // shadowColor: chartColors.tooltipShadow,
            // backgroundColor: this.$themeColors.light,
            // titleFontColor: this.$themeColors.dark,
            // bodyFontColor: this.$themeColors.dark,
          },
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 500,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  // zeroLineColor: chartColors.grid_line_color,
                  borderColor: 'transparent',
                  // color: chartColors.grid_line_color,
                  drawTicks: false,
                },
                scaleLabel: {
                  display: true,
                },
                ticks: {
                  min: 0,
                  // fontColor: chartColors.labelColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: true,
                },
                ticks: {
                  // fontColor: chartColors.labelColor,
                },
              },
            ],
          },
        },
        data: {
          labels: ['MON', 'TUE', 'WED ', 'THU', 'FRI', 'SAT', 'SUN'],
          datasets: [
            {
              data: [710, 350, 470, 580, 230, 460, 120],
              // backgroundColor: this.$themeColors.info,
              borderColor: 'transparent',
              barThickness: 15,
            },
          ],
        },
      },
    }
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      const height = this.chain.items.findIndex(x => x.subtitle === 'height')

      this.$set(this.chain, 'title', `Chain ID: ${res.block.header.chain_id}`)
      this.$set(this.chain.items[height], 'title', res.block.header.height)
    })

    this.$http.getMintingInflation().then(res => {
      const chainIndex = this.chain.items.findIndex(x => x.subtitle === 'inflation')
      this.$set(this.chain.items[chainIndex], 'title', `${percent(res)}%`)
    })

    this.$http.getStakingParameters().then(res => {
      this.staking = this.normalize(res, 'Staking Parameters')
      Promise.all([this.$http.getStakingPool(), this.$http.getBankTotal(res.bond_denom)])
        .then(pool => {
          const nano = 1000000
          const bondedAndSupply = this.chain.items.findIndex(x => x.subtitle === 'bonded_and_supply')
          this.$set(this.chain.items[bondedAndSupply], 'title', `${formatNumber(pool[0].bondedToken / nano, true, 1)} / ${formatNumber(pool[1].amount / nano, true, 1)}`)
          const bondedRatio = this.chain.items.findIndex(x => x.subtitle === 'bonded_ratio')
          this.$set(this.chain.items[bondedRatio], 'title', `${percent(pool[0].bondedToken / pool[1].amount)}%`)
        })
    })
    this.$http.getSlashingParameters().then(res => {
      this.slasing = this.normalize(res, 'Slashing Parameters')
    })

    const selected = this.$route.params.chain
    if (selected === 'iris') {
      this.mint = null
    } else {
      this.$http.getMintParameters().then(res => {
        this.mint = this.normalize(res, 'Minting Parameters')
      })
    }

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
        const d = Number(data[k])
        if (d < 1.01) {
          return { title: `${percent(d)}%`, subtitle: k }
        }
        if (d > 1000000000) {
          return { title: `${toDuration(d / 1000000)}`, subtitle: k }
        }
        return { title: data[k], subtitle: k }
      })
    },
  },
}
</script>

<style>

</style>
