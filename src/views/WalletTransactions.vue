<template>
  <div>
    <b-table
      :items="history"
      :fields="fields"
      stacked="sm"
    >
      <template #cell(chain)="data">
        <b-avatar
          size="sm"
          :src="data.item.chain.logo"
        /> {{ data.item.chain.chain_name }}
      </template>
      <template #cell(hash)="data">
        <router-link :to="`/${data.item.chain.chain_name}/tx/${data.value}`">
          {{ data.value }}
        </router-link>
      </template>
    </b-table>
    <div class="text-center">
      <b-button @click="clear()">
        Clear History
      </b-button>
    </div>
  </div>
</template>

<script>
import {
  VBTooltip, BTable, BAvatar, BButton,
} from 'bootstrap-vue'
import { getLocalTxHistory } from '@/libs/utils'

export default {
  components: {
    BTable, BAvatar, BButton,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      fields: [
        { key: 'chain', label: 'BLOCKCHAIN' },
        { key: 'op', label: 'ACTION' },
        { key: 'hash', label: 'TX HASH' },
        { key: 'time', label: 'TIME' },
      ],
      history: [],
    }
  },
  created() {
    this.history = getLocalTxHistory()
  },
  methods: {
    clear() {
      this.history = []
      localStorage.setItem('txHistory', [])
    },
  },
}
</script>
