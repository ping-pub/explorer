<template>
  <b-table
    v-if="Array.isArray(tablefield)"
    :items="tablefield"
    :sticky-header="true"
    :no-border-collapse="true"
    responsive="sm"
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

import {
  getStakingValidatorByHex, isHexAddress, isToken, percent, toDay, tokenFormatter,
} from '@/libs/utils'

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
      const percentage = /^0\.\d+/
      if (reg.test(value)) {
        return toDay(value)
      }
      if (percentage.test(value)) {
        return `${percent(value)}%`
      }
      if (value.length > 40) {
        return value.substring(0, 40).concat('...')
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
