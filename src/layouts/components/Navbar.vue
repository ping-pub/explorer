<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <b-media
        v-if="selected_chain.api"
        no-body
      >
        <b-media-aside class="mr-75">
          <b-avatar
            badge
            rounded
            size="42"
            :src="selected_chain.logo"
            class="badge-minimal"
            badge-variant="success"
          />
        </b-media-aside>
        <b-media-body class="my-auto">
          <h6 class="mb-0 text-uppercase">
            {{ selected_chain.chain_name }}
          </h6>
          <small v-b-tooltip.hover.bottom="'Data Provider'">{{ selected_chain.api }} {{ selected_chain.sdk_version }}</small>
        </b-media-body>
      </b-media>
    </div>

    <!-- <dark-Toggler class="d-none d-lg-block" /> -->
    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler class="d-none d-lg-block" />
      <search-bar />
      <locale />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BMedia, BMediaAside, BAvatar, BMediaBody, VBTooltip,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import Locale from '@core/layouts/components/app-navbar/components/Locale.vue'
import SearchBar from '@core/layouts/components/app-navbar/components/SearchBar.vue'
// import CartDropdown from '@core/layouts/components/app-navbar/components/CartDropdown.vue'
import store from '@/store'
// import UserDropdown from '@core/layouts/components/app-navbar/components/UserDropdown.vue'

export default {
  components: {
    BLink,
    BNavbarNav,
    BAvatar,
    BMedia,
    BMediaAside,
    BMediaBody,

    // Navbar Components
    DarkToggler,
    Locale,
    SearchBar,
    // CartDropdown,
    // UserDropdown,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      // result: {},
    }
  },
  computed: {
    selected_chain() {
      // const c = this.$route.params.chain
      // const has = Object.keys(store.state.chains.config).findIndex(i => i === c)
      // const selected = (has > -1) ? store.state.chains.config[c] : store.state.chains.config.cosmos
      return store.state.chains.selected
    },
  },
}
</script>
