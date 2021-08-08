<template>
  <div class="text-center container-lg">
    <b-link>
      <div class="d-flex justify-content-center align-items-center">
        <vuexy-logo class="mr-1" />
        <h1
          class="text-primary display-4 font-weight-bolder d-none d-md-block"
        >
          Ping Explorer<small class="flow-left">Beta</small>
        </h1>
      </div>
    </b-link>
    <h2 class="mb-1">
      Cosmos Ecosystem Blockchains 🛠
    </h2>

    <p class="mb-3">
      If you want to add your chain to our explorer, be free to contact us.
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
              class="earnings-card text-left"
            >
              <b-row>
                <b-col cols="8">
                  <b-card-title class="mb-1 text-uppercase">
                    {{ data.chain_name }} <small class="font-small-2">{{ data.sdk_version }}</small>
                  </b-card-title>
                  <div class="font-small-2">
                    Height
                  </div>
                  <h5 class="mb-1">
                    {{ data.height || '0' }}
                  </h5>
                  <b-card-text class="text-muted font-small-2">
                    <span> Updated on </span><span class="font-weight-bolder">{{ data.time || '...' }}</span>
                  </b-card-text>
                </b-col>
                <b-col
                  cols="4"
                >
                  <b-avatar
                    :src="data.logo"
                    class="mt-1"
                    variant="light-primary"
                    rounded
                    size="82"
                  /></b-col>
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
  BLink, BAvatar, BRow, BCol, BCard, BCardText, BCardTitle,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { toDay } from '@/libs/data'

export default {
  components: {
    BLink,
    BAvatar,
    BRow,
    BCol,
    BCard,
    BCardText,
    BCardTitle,
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
          // console.log(b.block.header)
          const { header } = b.block
          this.$set(chain, 'height', header.height)
          this.$set(chain, 'time', toDay(header.time))
        })
      })
    },
  },
}
</script>
