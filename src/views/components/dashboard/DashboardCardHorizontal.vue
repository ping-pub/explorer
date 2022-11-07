<template>
  <b-card no-body>
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h4 class="mb-25 font-weight-bolder">
          {{ statistic || '-' }}
        </h4>
        <span v-if="!statistic || statistic === '-'">{{ statisticTitle }}</span>
        <span v-else-if="changes === 0">
          {{ showPrice(statistic, statisticTitle) }}
        </span>
        <span
          v-else-if="changes < 0"
          v-b-tooltip.hover.v-danger
          :title="`${changes.toFixed(1)}%`"
          class="text-danger"
        >
          {{ showPrice(statistic, statisticTitle) }}
        </span>
        <span
          v-else
          v-b-tooltip.hover.v-success
          :title="`+${changes.toFixed(1)}%`"
          class="text-success"
        >
          {{ showPrice(statistic, statisticTitle) }}
        </span>
      </div>
      <b-avatar
        v-b-tooltip.hover
        :variant="`light-${color}`"
        size="45"
        :text="statisticTitle.substring(0,1)"
        :title="statisticTitle"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardBody, BAvatar, VBTooltip,
} from 'bootstrap-vue'
import { getUserCurrency, getUserCurrencySign } from '@/libs/utils'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
    VBTooltip,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      changes: 0,
    }
  },
  methods: {
    showPrice(v, statisticTitle) {
      const token = String(v).split(' ')
      if (token.length >= 2) {
        const quote = this.$store.state.chains.quotes[token[1]]
        if (quote) {
          const price = quote[getUserCurrency()]
          this.changes = quote[`${getUserCurrency()}_24h_change`]
          return `${getUserCurrencySign()}${(Number(token[0].replaceAll(',', '')) * price).toFixed(2)}`
        }
      }
      return statisticTitle
    },
  },
}
</script>
