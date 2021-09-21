<template>
  <div class="text-center container-lg">
    <b-nav
      align="right"
      style="width:100%"
      class="nav text-right text-nowrap ml-auto"
    >
      <b-nav-item><dark-toggler /></b-nav-item>
      <b-nav-item><locale /></b-nav-item>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="btn-icon mt-25"
        :to="{ name: 'accounts' }"
      >
        <feather-icon icon="KeyIcon" />
        <span class="align-middle ml-25">Wallet</span>
      </b-button>
    </b-nav>
    <b-link>
      <div class="d-flex justify-content-center align-items-center">
        <vuexy-logo />
        <h1
          class="text-primary display-4 font-weight-bolder d-none d-md-block"
        >
          Ping Explorer<small class="flow-left">Beta</small>
        </h1>
      </div>
    </b-link>

    <p class="mb-1">
      Ping explorer is not just an explorer but also a wallet and more ... 🛠
    </p>
    <h2 class="mb-3">
      Cosmos Ecosystem Blockchains 🚀
    </h2>

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
                    class="mt-1 badge-minimal"
                    variant="light-primary"
                    rounded
                    size="82"
                    badge
                    :badge-variant="data.variant"
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
    <app-footer class="mb-1" />
  </div>
</template>

<script>
/* eslint-disable global-require */
import {
  BLink, BAvatar, BRow, BCol, BCard, BCardText, BCardTitle, BNav, BNavItem, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { timeIn, toDay } from '@/libs/data'
import DarkToggler from '@/@core/layouts/components/app-navbar/components/DarkToggler.vue'
import Locale from '@/@core/layouts/components/app-navbar/components/Locale.vue'
import AppFooter from '@/@core/layouts/components/AppFooter.vue'

export default {
  components: {
    BLink,
    BAvatar,
    BRow,
    BCol,
    BCard,
    BCardText,
    BCardTitle,
    BNav,
    BNavItem,
    BButton,

    VuexyLogo,
    DarkToggler,
    Locale,
    AppFooter,
  },
  directives: {
    Ripple,
  },
  data() {
    const chains = this.$store.state.chains.config
    return {
      chains,
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
    this.fetch()
    this.timer = setInterval(this.fetch, 120000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    fetch() {
      Object.keys(this.chains).forEach(k => {
        const chain = this.chains[k]
        if (chain.api) {
          fetch(`${chain.api}/blocks/latest`).then(res => res.json()).then(b => {
          // console.log(b.block.header)
            const { header } = b.block
            this.$set(chain, 'height', header.height)
            this.$set(chain, 'time', toDay(header.time))
            this.$set(chain, 'variant', timeIn(header.time, 3, 'm') ? 'danger' : 'success')
          })
        }
      })
    },
  },
}
</script>
