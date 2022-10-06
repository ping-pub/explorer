<template>
  <div>
    <b-card>
      <b-card-title class="d-flex justify-content-between">
        <span>#{{ height }}</span>
        <span><b-button
          size="sm"
          @click="goblock(height-1)"
        > &lt; </b-button> <b-button
          size="sm"
          @click="goblock(Number(height)+1)"
        > > </b-button></span>
      </b-card-title>
      <object-field-component :tablefield="block.block_id" />
    </b-card>

    <b-card title="Block Header">
      <object-field-component :tablefield="block.block.header" />
    </b-card>

    <b-card
      v-if="block.block.data.txs"
      title="Transaction"
    >
      <b-table
        :items="txs"
        :fields="fields"
        responsive="sm"
      >
        <template #cell(hash)="data">
          <router-link :to="`../tx/${data.value}`">
            {{ data.value }}
          </router-link>
        </template>
      </b-table>
    </b-card>

    <b-card
      v-if="block.block.evidence.evidence"
      title="Evidence"
    >
      <array-field-component :tablefield="block.block.evidence.evidence" />
    </b-card>

    <b-card title="Last Commit">
      <object-field-component
        :tablefield="block.block.last_commit"
        :small="true"
      />
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTable, BCardTitle, BButton,
} from 'bootstrap-vue'
import { fromBase64 } from '@cosmjs/encoding'
import { decodeTxRaw } from '@cosmjs/proto-signing'
import Tx from '@/libs/data/tx'
import { abbrMessage, tokenFormatter } from '@/libs/utils'
import ObjectFieldComponent from './components/ObjectFieldComponent.vue'
import ArrayFieldComponent from './components/ArrayFieldComponent.vue'

export default {
  components: {
    BButton,
    BCard,
    BTable,
    BCardTitle,
    ObjectFieldComponent,
    ArrayFieldComponent,
  },
  beforeRouteUpdate(to, from, next) {
    const { height } = to.params
    if (height > 0 && height !== from.params.height) {
      this.initData(height)
      next()
    }
  },
  data() {
    return {
      block: { block: { header: {}, data: {}, evidence: {} } },
      txs: null,
      height: 0,
      fields: [
        { key: 'hash' },
        { key: 'fee', formatter: v => tokenFormatter(v) },
        { key: 'messages', formatter: v => abbrMessage(v) },
        { key: 'memo' },
      ],
    }
  },
  created() {
    const { height } = this.$route.params
    this.initData(height)
  },
  methods: {
    initData(height) {
      this.height = height
      this.$http.getBlockByHeight(height).then(res => {
        this.block = res
        const { txs } = res.block.data
        if (txs === null) return
        const array = []
        for (let i = 0; i < txs.length; i += 1) {
          let tx = new Tx()
          try {
            const origin = decodeTxRaw(fromBase64(txs[i]))
            tx = Tx.create(origin)
          } catch (e) {
            // catch errors
          }
          tx.setHash(txs[i])
          array.push(tx)
        }
        if (array.length > 0) this.txs = array
      })
    },
    goblock(height) {
      this.$router.push({ name: 'block', params: { height } })
    },
  },
}
</script>
