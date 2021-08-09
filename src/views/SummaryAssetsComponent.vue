<template>
  <b-card v-if="assets">
    <b-card-title>
      Onchain Assets
    </b-card-title>
    <b-table
      :items="assets"
      hover
      striped
      sticky-header="true"
      responsive="xs"
    />
  </b-card>
</template>

<script>
import { BTable, BCardTitle, BCard } from 'bootstrap-vue'
import { formatNumber } from '@/libs/data'

export default {
  components: {
    BCard,
    BTable,
    BCardTitle,
  },
  data() {
    return {
      assets: [],
      field: [
        {
          key: 'denom',
          tdClass: 'text-nowrap text-truncate overflow-hidden',
        },
      ],
    }
  },
  created() {
    this.$http.getBankTotals().then(res => {
      const toshow = res.sort()
      this.assets = toshow.reverse().map(x => {
        const xh = x
        const amount = Number(x.amount) / 1000000
        xh.abbr = amount > 1 ? formatNumber(amount, true) : amount
        return xh
      })
    })
  },
}
</script>

<style>
</style>
