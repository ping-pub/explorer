<template>
  <b-card v-if="assets">
    <b-card-title>
      Assets
    </b-card-title>
    <b-table
      :items="assets"
      :fields="cfield"
      hover
      striped
      sticky-header="true"
      responsive="xs"
    />
  </b-card>
</template>

<script>
import { BTable, BCardTitle, BCard } from 'bootstrap-vue'
import { formatNumber, formatTokenAmount, formatTokenDenom } from '@/libs/data'
import chainAPI from '@/libs/fetch'

export default {
  components: {
    BCard,
    BTable,
    BCardTitle,
  },
  data() {
    return {
      assets: [],
      denoms: [],
      cfield: [
        {
          key: 'denom',
          formatter: this.formatDenom,
          tdClass: 'text-nowrap text-truncate overflow-hidden',
        },
        'abbr',
        {
          key: 'amount',
        },
      ],
    }
  },
  created() {
    this.$http.getBankTotals().then(res => {
      const toshow = res.sort()
      this.assets = toshow.reverse().map(x => {
        if (x.denom.startsWith('ibc/')) {
          chainAPI.getIBCDenomTraceText(this.$http.config.api, x.denom).then(denom => {
            this.$set(this.denoms, x.denom, denom)
          })
        }
        const xh = x
        const amount = Number(x.amount) / 1000000
        xh.abbr = amount > 1 ? formatNumber(formatTokenAmount(x.amount, 0, x.denom), true, 2) : amount
        return xh
      })
    })
  },
  methods: {
    formatDenom(v) {
      return formatTokenDenom(this.denoms[v] ? this.denoms[v] : v)
    },
  },
}
</script>

<style>
</style>
