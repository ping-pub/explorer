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
import { formatTokenAmount, formatTokenDenom } from '@/libs/utils'

export default {
  components: {
    BCard,
    BTable,
    BCardTitle,
  },
  data() {
    return {
      islive: true,
      assets: [],
      cfield: [
        {
          key: 'denom',
          formatter: this.formatDenom,
          tdClass: 'text-nowrap text-truncate overflow-hidden',
        },
        {
          key: 'abbr',
          label: 'Amount',
        },
      ],
    }
  },
  computed: {
    denoms() {
      return this.$store.state.chains.denoms
    },
  },
  created() {
    this.$http.getBankTotals().then(res => {
      const toshow = res.sort()
      this.assets = toshow.reverse().map(x => {
        const xh = x
        xh.abbr = formatTokenAmount(x.amount, 0, x.denom)
        return xh
      })
    })
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    formatDenom(v) {
      const trace = this.denoms[v]
      if (trace) {
        return `* ${formatTokenDenom(trace)}`
      }
      return formatTokenDenom(v)
    },
  },
}
</script>

<style>
</style>
