<template>
  <div className="container-md">
    <b-row class="match-height">
      <b-col
        md="8"
        sm="12"
      >
        <b-card>
          <div class="d-flex justify-content-begin align-items-center mb-1">
            <b-button
              id="popover-button-3"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="flat-primary"
              class="mr-3"
              @click="show = !show"
            >
              {{ base }} / {{ target }}
            </b-button>

            <b-popover
              :show.sync="show"
              target="popover-button-3"
              placement="bottom"
              triggers="click"
              style="width:300px;"
            >
              <template #title>
                Pairs
              </template>
              <b-table
                striped
                hover
                :small="true"
                :items="pairs"
                class="m-0"
              >

                <template #cell(pair)="data">
                  <router-link
                    :to="`/osmosis/osmosis/trade/${data.item.pair}`"
                  >
                    {{ data.item.pair }}
                  </router-link>
                </template>
              </b-table>
            </b-popover>
            <div class="mr-3">
              59300
            </div>
            <div class="mr-3">
              <small>24h Change</small>
              <div>460 +0.78%</div>
            </div>
            <div class="mr-3">
              <small>24h High</small>
              <div>59000</div>
            </div>
            <div>
              <small>24h Low</small>
              <div>58000</div>
            </div>
          </div>
          <Kline />
        </b-card>
      </b-col>
      <b-col
        md="4"
        sm="12"
      >
        <b-card>
          <Place />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BCard, BButton, BPopover, BTable,
} from 'bootstrap-vue'
import Place from './components/KlineTrade/Place.vue'
import Kline from './components/kline/index.vue'

export default {
  components: {
    BRow,
    BCol,
    BButton,
    BPopover,
    BTable,
    Kline,
    Place,
    BCard,
  },
  data() {
    return {
      show: false,
      base: 'ATOM',
      target: 'OSMO',
      pairs: [
        { pair: 'ATOM/OSMO' },
        { pair: 'IRIS/OSMO' },
        { pair: 'AKT/OSMO' },
        { pair: 'ATOM/OSMO' },
        { pair: 'ATOM/OSMO' },
      ],
    }
  },
  created() {
    const { base, target } = this.$route.params
    this.init(base, target)
    // 所有方法添加到 $http.osmosis
    this.$http.osmosis.getOHCL4Pairs('cosmos', 'osmosis').then(data => {
      console.log(data)
    })
  },
  beforeRouteUpdate(to, from, next) {
    const { base, target } = to.params
    this.init(base, target)
    console.log(base, target)
    next()
    // }
  },
  methods: {
    init(base, target) {
      this.base = base || 'ATOM'
      this.target = target || 'OSMO'
    },
  },
}
</script>

<style scoped>

</style>
