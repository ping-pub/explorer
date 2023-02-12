<template>
  <li class="nav-item nav-search">

    <!-- Icon -->
    <a
      href="javascript:void(0)"
      class="nav-link nav-link-search"
      @click="showSearchBar = true"
    >
      <feather-icon
        icon="SearchIcon"
        size="21"
      />
    </a>

    <!-- Input -->
    <div
      class="search-input"
      :class="{'open': showSearchBar}"
    >
      <div class="search-input-icon">
        <feather-icon icon="SearchIcon" />
      </div>
      <!-- <input type="text" placeholder="Explore Vuexy...." class="form-control-input"> -->
      <!-- @keyup.esc="escPressed" -->
      <!-- @keyup.enter="suggestionSelected" -->
      <b-form-input
        v-if="showSearchBar"
        v-model="searchQuery"
        placeholder="Search Height/Transaction/Account Address"
        :state="false"
        autocomplete="off"
        @keyup.enter="doQuery"
      />
      <b-form-text class="text-danger pl-3">
        {{ error }}
      </b-form-text>
      <div
        class="search-input-close"
        @click="reset()"
      >
        <feather-icon icon="XIcon" />
      </div>
    </div>
  </li>
</template>

<script>
import { BFormInput, BFormText } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import { title } from '@core/utils/filter'
import store from '@/store'

export default {
  components: {
    BFormInput,
    BFormText,
  },
  setup() {
    const showSearchBar = ref(false)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
    }

    return {
      showSearchBar,
      perfectScrollbarSettings,
      title,
    }
  },
  data() {
    return {
      searchQuery: null,
      error: null,
    }
  },
  methods: {
    reset() {
      this.showSearchBar = false
      this.searchQuery = null
      this.error = null
    },
    doQuery() {
      const height = /^\d+$/
      const txhash = /^[A-Z\d]{64}$/
      const addr = /^[a-z]+1[a-z\d]{38,58}$/
      const key = this.searchQuery

      const c = store.state.chains.selected
      if (!Object.values(this.$route.params).includes(key)) {
        if (height.test(key)) {
          this.$router.push({ name: 'block', params: { chain: c.chain_name, height: key } })
        } else if (txhash.test(key)) {
          this.$router.push({ name: 'transaction', params: { chain: c.chain_name, hash: key } })
        } else if (addr.test(key)) {
          this.$router.push({ name: 'chain-account', params: { chain: c.chain_name, address: key } })
        } else {
          this.error = 'The input not recognized'
        }
      }
      // this.$router.push('/')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/components/variables-dark';

ul
{
  list-style: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}

/* .app-auto-suggest {
  position: relative;
}

.auto-suggest-suggestions-list {
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  border-radius: 6px;
  position: absolute;
  top: calc(100% + 1rem);
  background-color: white;
  width: 100%;
} */

.suggestion-group-title {
  font-weight: 500;
  padding: .75rem 1rem .25rem;
}

.suggestion-group-suggestion {
  padding: .75rem 1rem
}

.suggestion-current-selected {
  background-color: $body-bg;

  .dark-layout & {
    background-color: $theme-dark-body-bg;
  }
}
</style>
