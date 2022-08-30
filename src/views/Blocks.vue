<template>
  <div>
    <b-card
      no-body
      class="text-truncate"
    >
      <b-tabs
        pills
        class="mt-1"
      >
        <b-tab
          title="Recent"
          disabled
        />
        <b-tab
          title="Blocks"
          active
        >
          <b-table
            :items="blocks"
            :fields="list_fields"
            :sort-desc="true"
            sort-by="tokens"
            striped
            hover
            stacked="sm"
          >
            <!-- Column: Height -->
            <template #cell(height)="data">
              <router-link :to="`./blocks/${data.item.block.header.height}`">
                {{ data.item.block.header.height }}
              </router-link>
            </template>
            <template #cell(hash)="data">
              <small>{{ data.item.block_id.hash }}</small>
            </template>
            <template #cell(time)="data">
              {{ formatTime(data.item.block.header.time) }}
            </template>
            <template #cell(proposer)="data">
              {{ formatProposer(data.item.block.header.proposer_address) }}
            </template>
            <template #cell(txs)="data">
              {{ length(data.item.block.data.txs) }}
            </template>

          </b-table>
        </b-tab>
        <b-tab title="Transactions">
          <b-table
            :items="txs"
            :fields="txFields"
            responsive="sm"
          >
            <template #cell(hash)="data">
              <router-link :to="`./tx/${data.value}`">
                {{ shortHash(data.value) }}
              </router-link>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import {
  BTable, BCard, BCardHeader, BCardTitle, VBTooltip, BTab, BTabs,
} from 'bootstrap-vue'
import {
  getCachedValidators,
  getStakingValidatorByHex,
  toDay, abbr, abbrMessage, tokenFormatter,
} from '@/libs/utils'
import { decodeTxRaw } from '@cosmjs/proto-signing'
import { fromBase64 } from '@cosmjs/encoding'
import Tx from '@/libs/data/tx'
// import fetch from 'node-fetch'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BTable,
    BCardHeader,
    BCardTitle,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      islive: true,
      blocks: [],
      txs: [],
      list_fields: [
        {
          key: 'height',
          sortable: true,
        },
        {
          key: 'hash',
          thClass: 'd-none d-lg-block',
          tdClass: 'd-none d-lg-block text-truncate',
        },
        {
          key: 'proposer',
          tdClass: 'text-truncate',
        },
        {
          key: 'txs',
        },
        {
          key: 'time',
          thClass: 'd-none d-md-block',
          tdClass: 'd-none d-md-block',
        },
      ],
      txFields: [
        { key: 'hash' },
        { key: 'time', formatter: v => toDay(v, 'from') },
        { key: 'fee', formatter: v => tokenFormatter(v) },
        { key: 'messages', formatter: v => abbrMessage(v) },
        { key: 'memo' },
      ],
    }
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      this.blocks.push(res)
      const list = []
      const { height } = res.block.header
      for (let i = 1; i < 10; i += 1) {
        list.push(height - i)
      }

      if (!getCachedValidators()) {
        this.$http.getValidatorList()
      }

      let promise = Promise.resolve()
      list.forEach(item => {
        promise = promise.then(() => new Promise(resolve => {
          this.$http.getBlockByHeight(item).then(b => {
            resolve()
            this.blocks.push(b)
            if (this.txs.length < 20) {
              this.extractTx(b, 'tail')
            }
          })
        }))
      })
      this.timer = setInterval(this.fetch, 6000)
    })
  },
  beforeDestroy() {
    this.islive = false
    clearInterval(this.timer)
  },
  methods: {
    length: v => (Array.isArray(v) ? v.length : 0),
    shortHash: v => abbr(v),
    formatTime: v => toDay(v, 'from'),
    formatProposer(v) {
      return getStakingValidatorByHex(this.$http.config.chain_name, v)
    },
    fetch() {
      this.$http.getLatestBlock().then(b => {
        const has = this.blocks.findIndex(x => x.block.header.height === b.block.header.height)
        if (has < 0) {
          this.blocks.unshift(b)
          this.extractTx(b)
        }
        if (this.blocks.length > 200) this.blocks.pop()
      })
    },
    extractTx(block, direction = 'head') {
      const { txs } = block.block.data
      if (txs === null) return
      for (let i = 0; i < txs.length; i += 1) {
        let tx = new Tx()
        try {
          const origin = decodeTxRaw(fromBase64(txs[i]))
          tx = Tx.create(origin)
          tx.time = block.block.header.time
        } catch (e) {
          // catch errors
        }
        tx.setHash(txs[i])
        if (direction === 'head') {
          this.txs.unshift(tx)
          if (this.txs.length > 200) {
            this.txs.pop()
          }
        } else if (this.txs.length < 100) {
          this.txs.push(tx)
        }
      }
    },
  },
}
</script>
