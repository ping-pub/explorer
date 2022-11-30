<template>
  <b-row
    v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
    class="content-header"
  >

    <!-- Content Left -->
    <b-col
      class="content-header-left mb-2"
      cols="12"
      md="9"
    >
      <b-row class="breadcrumbs-top">
        <b-col cols="12">
          <h2 class="content-header-title float-left pr-1 mb-0">
            {{ $route.meta.pageTitle }}
          </h2>
          <div class="breadcrumb-wrapper">
            <b-breadcrumb>
              <b-breadcrumb-item to="/">
                <feather-icon
                  icon="HomeIcon"
                  size="16"
                  class="align-text-top"
                />
              </b-breadcrumb-item>
              <b-breadcrumb-item
                :to="`/${chainname}`"
                class="text-uppercase"
              >
                {{ chainname }}
              </b-breadcrumb-item>
              <b-breadcrumb-item
                v-for="item in breadcrumb"
                :key="item.text"
                :active="item.active"
                :to="item.to"
              >
                {{ item.text }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <!-- Content Right -->
    <b-col
      class="content-header-right text-md-right d-md-block d-none mb-1"
      md="3"
      cols="12"
    >
      &nbsp;
    </b-col>
  </b-row>
</template>

<script>
import {
  BBreadcrumb, BBreadcrumbItem, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BRow,
    BCol,
  },
  computed: {
    chainname() {
      return this.$store?.state?.chains?.selected?.chain_name
    },
    /**
     * Invoke `route.meta.breadcrumb($route)` if breadcrumb is callable.
     */
    breadcrumb() {
      const { breadcrumb } = this.$route.meta
      const breadcrumbIsCallable = typeof breadcrumb === 'function'
      return breadcrumbIsCallable ? breadcrumb(this.$route) : breadcrumb
    },
  },
}
</script>
