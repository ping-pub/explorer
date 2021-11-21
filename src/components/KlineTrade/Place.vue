<template>
  <div class="ticker-place">
    <b-tabs
      v-model="tabIndex"
      small
      class="nav-fill"
      pills
      :nav-class="tabIndex === 0 ? 'nav-pill-success' : 'nav-pill-danger'"
    >
      <b-tab
        title="BUY"
        no-body
      />
      <b-tab
        title="SELL"
        no-body
      />
    </b-tabs>
    <PlaceForm :type="tabIndex" />
  </div>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import PlaceForm from './PlaceForm.vue'

export default {
  components: {
    BTab,
    BTabs,
    PlaceForm,
  },
  data: () => ({
    tabIndex: 0,
  }),
}
</script>

<style lang="scss" scoped>
.ticker-place {
  background: #283046;
  border-radius: 0.428rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  min-height: 44.5rem;
}
</style>
