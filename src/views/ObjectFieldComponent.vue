<template>
  <b-table-simple>
    <b-tr
      v-for="(value, name) in tablefield"
      :key="name"
    >
      <b-td
        style="text-transform: capitalize; vertical-align: top; width:200px"
      >
        {{ name.replaceAll('_',' ') }}
      </b-td>
      <b-td v-if="isTokenField(value)">
        {{ formatTokens( value ) }}
      </b-td>
      <b-td v-else-if="Array.isArray(value)">
        <array-field-component :tablefield="value" />
      </b-td>
      <b-td v-else>
        {{ value }}
      </b-td>
    </b-tr>
  </b-table-simple>
</template>

<script>
import {
  BTableSimple, BTr, BTd,
} from 'bootstrap-vue'
import { isToken, tokenFormatter } from '@/libs/data'
import ArrayFieldComponent from './ArrayFieldComponent.vue'
// import fetch from 'node-fetch'

// import { tokenFormatter } from '@/libs/data/data'
// import { Proposal, Proposer } from '@/libs/data'
// import { formatToken } from '@/libs/data/data'

export default {
  name: 'ObjectFieldComponent',
  components: {
    BTableSimple,
    BTr,
    BTd,
    ArrayFieldComponent,
  },
  props: {
    tablefield: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    eval_value(value) {
      return Array.from(value)
    },
    isTokenField(value) {
      return isToken(value)
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
  },
}
</script>
