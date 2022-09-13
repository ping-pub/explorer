<template>
  <div class="text-center container-lg">
    <full-header />
    <b-link>
      <div class="d-flex justify-content-center align-items-center">
        <vuexy-logo />
        <h1
          class="text-primary display-4 font-weight-bolder d-none d-md-block"
        >
          Point Dashboard<small class="flow-left">Beta</small>
        </h1>
      </div>
    </b-link>

    <p class="mb-1">
      Point Dashboard is not just an explorer but also a wallet and more ... 🛠
    </p>
    <h2 class="mb-3">
      Cosmos Ecosystem Blockchains 🚀
    </h2>

    <div>
      <b-row class="match-height">
        <b-col
          v-for="(data,index) in chains"
          :key="index"
          v-observe-visibility="(visible) => visibilityChanged(visible, data)"
          sm="6"
          md="4"
          lg="4"
          xl="3"
        >
          <router-link :to="data.chain_name">
            <b-card
              v-if="data"
              class="earnings-card text-left"
            >
              <div>
                <b-card-title class="mb-1 d-flex justify-content-between">
                  <span class="text-uppercase">{{ data.chain_name }} <small class="font-small-2">{{ data.sdk_version }}</small></span>
                  <b-dropdown
                    class="ml-1"
                    variant="link"
                    no-caret
                    toggle-class="p-0"
                    right
                  >
                    <template #button-content>
                      <feather-icon
                        icon="MoreVerticalIcon"
                        size="18"
                        class="cursor-pointer"
                      />
                    </template>
                    <b-dropdown-item :to="`/${data.chain_name}/`">
                      Summary
                    </b-dropdown-item>
                    <b-dropdown-item :to="`/${data.chain_name}/staking`">
                      Staking
                    </b-dropdown-item>
                    <b-dropdown-item :to="`/${data.chain_name}/gov`">
                      Governance
                    </b-dropdown-item>
                    <b-dropdown-item :to="`/${data.chain_name}/uptime`">
                      Uptime
                    </b-dropdown-item>
                    <b-dropdown-item :to="`/${data.chain_name}/statesync`">
                      State Sync
                    </b-dropdown-item>
                  </b-dropdown>
                </b-card-title>

                <div class="d-flex justify-content-between">
                  <div>
                    <div class="font-small-2">
                      Height
                    </div>
                    <h5 class="mb-1">
                      {{ data.height || '0' }}
                    </h5>
                  </div>
                  <div>
                    <b-avatar
                      :src="data.logo"
                      class="badge-minimal"
                      variant="light-primary"
                      rounded
                      size="md"
                      badge
                      :badge-variant="data.variant"
                    />
                  </div>
                </div>
                <b-card-text class="text-muted font-small-2">
                  <span> Updated on </span><span class="font-weight-bolder">{{ data.time || '...' }}</span>
                </b-card-text>
              </div>
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
  BLink, BAvatar, BRow, BCol, BCard, BCardText, BCardTitle, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { timeIn, toDay, getLocalChains } from '@/libs/utils'
import AppFooter from '@/@core/layouts/components/AppFooter.vue'
import FullHeader from './components/FullHeader.vue'

export default {
  components: {
    BLink,
    BAvatar,
    BRow,
    BCol,
    BCard,
    BCardText,
    BCardTitle,
    BDropdown,
    BDropdownItem,
    VuexyLogo,
    AppFooter,
    FullHeader,
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
  beforeCreate() {
    const keys = Object.keys(getLocalChains())
    if (keys.length === 1) {
      this.$router.push(`/${keys[0]}`)
    }
  },
  methods: {
    fetch(k) {
      const chain = this.chains[k]
      if (chain.api) {
        const index = localStorage.getItem(`${chain.chain_name}-api-index`) || 0
        const host = Array.isArray(chain.api) ? chain.api[index] : chain.api
        fetch(`${host}/blocks/latest`).then(res => res.json()).then(b => {
          const { header } = b.block
          this.$set(chain, 'height', header.height)
          this.$set(chain, 'time', toDay(header.time))
          this.$set(chain, 'variant', timeIn(header.time, 3, 'm') ? 'danger' : 'success')
        })
      }
    },
    visibilityChanged(isVisible, chain) {
      this.isVisible = isVisible
      const idle = this.chains[chain.chain_name]
      if (isVisible && !idle.loaded) {
        this.$set(idle, 'loaded', true)
        this.fetch(chain.chain_name)
      }
    },
  },
}
</script>
