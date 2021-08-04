<template>
  <b-table
    :items="tablefield"
    :sticky-header="true"
    :no-border-collapse="true"
    responsive
  >
    <template #cell()="data">
      <span v-if="isTokenField(data.value)">{{ formatTokens(data.value) }}</span>
      <array-field-component
        v-else-if="isArrayText(data.value)"
        :tablefield="eval_value(data.value)"
      />
      <span v-else>{{ data.value }}</span>
    </template>
  </b-table>
</template>

<script>
import { BTable } from 'bootstrap-vue'
// import fetch from 'node-fetch'

import { isToken, tokenFormatter } from '@/libs/data/data'
// import { Proposal, Proposer } from '@/libs/data'
// import { formatToken } from '@/libs/data/data'

export default {
  name: 'ArrayFieldComponent',
  components: {
    BTable,
  },
  props: {
    tablefield: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    eval_value(value) {
      if (typeof (value) === 'string') {
        return JSON.parse(value)
      }
      return value
    },
    isTokenField(value) {
      return isToken(value)
    },
    isArrayText(value) {
      const has = String(value).startsWith('[')
      return has
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
  },
}
</script>
