<template>
  <b-table
    v-if="Array.isArray(tablefield)"
    :items="tablefield"
    :sticky-header="true"
    :no-border-collapse="true"
    responsive
    class="ml-0 mr-0"
  >
    <template #cell()="data">
      <span v-if="isTokenField(data.value)">{{ formatTokens(data.value) }}</span>
      <span v-else-if="isHex(data.value)">{{ formatHexAddress(data.value) }}</span>
      <array-field-component
        v-else-if="isArrayText(data.value)"
        :tablefield="eval_value(data.value)"
      />
      <span
        v-else
        :title="data.value"
      >{{ formatText(data.value) }}</span>
    </template>
  </b-table>
</template>

<script>
import { BTable } from 'bootstrap-vue'
// import fetch from 'node-fetch'

import {
  getStakingValidatorByHex, isHexAddress, isToken, toDay, tokenFormatter,
} from '@/libs/data/data'
// import { Proposal, Proposer } from '@/libs/data'
// import { formatToken } from '@/libs/data/data'

export default {
  name: 'ArrayFieldComponent',
  components: {
    BTable,
  },
  props: {
    tablefield: {
      type: [Array, Object],
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
      const has = String(value).startsWith('[') && String(value).endsWith(']')
      return has
    },
    formatText(value) {
      const reg = /^\d{4}.\d{1,2}.\d{1,2}T\d{2}:\d{2}:.+Z$/
      if (reg.test(value)) {
        return toDay(value)
      }
      return value
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
    isHex(value) {
      return isHexAddress(value)
    },
    formatHexAddress(v) {
      return getStakingValidatorByHex(this.$http.config.chain_name, v)
    },
  },
}
</script>
