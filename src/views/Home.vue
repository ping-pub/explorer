<template>
  <div class="text-center container-lg">
    <b-link>
      <div class="mb-3 mt-3">
        <vuexy-logo />

        <h1 class="brand-text text-primary mt-2">
          Ping Explorer
        </h1>
      </div>
    </b-link>
    <h2 class="mb-1">
      Cosmos Ecosystem Blockchains 🛠
    </h2>

    <p class="mb-3">
      If you want add your chain to our explorer, be free to contact us.
    </p>

    <div>
      <b-row class="match-height">
        <b-col
          v-for="(data,index) in chains"
          :key="index"
          md="4"
          sm="6"
        >
          <router-link :to="data.chain_name">
            <b-card
              v-if="data"
              no-body
              hover
            >
              <b-card-header>
                <h4 class="mb-0 text-uppercase">
                  {{ data.chain_name }}
                </h4>
                <b-card-text class="mb-0">
                  Updated on {{ data.time }}
                </b-card-text>
              </b-card-header>

              <b-img
                :src="data.logo"
                height="145"
                class="mb-2"
              />
              <b-row class="text-center mx-0">
                <b-col
                  cols="6"
                  class="border-top border-right d-flex align-items-between flex-column py-1"
                >
                  <b-card-text class="text-muted mb-0">
                    SDK Version
                  </b-card-text>
                  <h3 class="font-weight-bolder mb-0">
                    {{ data.sdk_version }}
                  </h3>
                </b-col>

                <b-col
                  cols="6"
                  class="border-top d-flex align-items-between flex-column py-1"
                >
                  <b-card-text class="text-muted mb-0">
                    Height
                  </b-card-text>
                  <h3 class="font-weight-bolder mb-0">
                    {{ data.height }}
                  </h3>
                </b-col>
              </b-row>
            </b-card>
          </router-link>
        </b-col>

        <!-- no result found -->
        <b-col
          v-show="!chains"
          cols="12"
          class="text-center"
        >
          <h4 class="mt-4">
            No blockchain found!!
          </h4>
        </b-col>
        <!--/ no result found -->
      </b-row>
    </div>
  </div>
<!-- / Under maintenance-->
</template>

<script>
/* eslint-disable global-require */
import {
  BLink, BImg, BRow, BCol, BCard, BCardText, BCardHeader,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { toDay } from '@/libs/data'

export default {
  components: {
    BLink,
    BImg,
    BRow,
    BCol,
    BCard,
    BCardText,
    BCardHeader,
    VuexyLogo,
  },
  data() {
    return {
      chains: [],
      downImg: require('@/assets/images/pages/under-maintenance.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/under-maintenance-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  created() {
    this.chains = JSON.parse(localStorage.getItem('chains'))
    this.timer = setInterval(this.fetch, 12000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    fetch() {
      Object.keys(this.chains).forEach(k => {
        const chain = this.chains[k]
        fetch(`${chain.api}/blocks/latest`).then(res => res.json()).then(b => {
          console.log(b.block.header)
          const { header } = b.block
          this.$set(chain, 'height', header.height)
          this.$set(chain, 'time', toDay(header.time))
        })
      })
    },
  },
}
</script>
