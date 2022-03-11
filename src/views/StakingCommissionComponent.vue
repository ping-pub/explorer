<template>
  <b-card
    no-body
  >
    <b-card-header>
      <h4 class="mb-0">
        Commission
      </h4>
      <b-card-text class="font-small-5 mb-0">
        Updated on {{ dateFormat(data.update_time) }}
      </b-card-text>
    </b-card-header>

    <!-- apex chart -->
    <vue-apex-charts
      type="radialBar"
      height="145"
      class="my-2"
      :options="goalOverviewRadialBar"
      :series="[percentFormat(data.rate)]"
    />
    <b-row class="text-center mx-0">
      <b-col
        cols="6"
        class="border-top border-right d-flex align-items-between flex-column py-1"
      >
        <b-card-text class="text-muted mb-0">
          Max Rate
        </b-card-text>
        <h3 class="font-weight-bolder mb-0">
          {{ percentFormat(data.max_rate) }}%
        </h3>
      </b-col>

      <b-col
        cols="6"
        class="border-top d-flex align-items-between flex-column py-1"
      >
        <b-card-text class="text-muted mb-0">
          Max Change Rate
        </b-card-text>
        <h3 class="font-weight-bolder mb-0">
          {{ percentFormat(data.max_change_rate) }}%
        </h3>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BRow, BCol, BCardText,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import { percent, toDay } from '@/libs/utils'

const $strokeColor = '#ebe9f1'
const $textHeadingColor = '#5e5873'
const $goalStrokeColor2 = '#51e5a8'
export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      goalOverviewRadialBar: {
        chart: {
          height: 105,
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '60%',
            },
            track: {
              background: $strokeColor,
              strokeWidth: '80%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                color: $textHeadingColor,
                fontSize: '2.86rem',
                fontWeight: '600',
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
      },
    }
  },
  methods: {
    dateFormat(value) {
      return toDay(value)
    },
    percentFormat(value) {
      return percent(value)
    },
  },
}
</script>
