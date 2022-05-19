<template>
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
</template>

<script>
import {
  BNav, BNavItem, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import DarkToggler from '@/@core/layouts/components/app-navbar/components/DarkToggler.vue'
import Locale from '@/@core/layouts/components/app-navbar/components/Locale.vue'

export default {
  components: {
    BNav,
    BNavItem,
    BButton,
    DarkToggler,
    Locale,
  },
  directives: {
    Ripple,
  },
}
</script>
