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
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex" />

    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler class="d-none d-lg-block" />
      <search-bar />
      <notification-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav,
} from 'bootstrap-vue'
import SearchBar from './components/SearchBar.vue'
import DarkToggler from './components/DarkToggler.vue'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    SearchBar,
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
