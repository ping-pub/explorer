<template>
  <div>
    <b-alert
      :show="error !== null"
      variant="danger"
    >
      <h4 class="alert-heading">
        Error:
      </h4>
      <div class="alert-body">
        <span>Tx not found on chain. {{ error }}</span>
      </div>
    </b-alert>
    <b-card
      v-if="error===null"
      title="Summary"
      class="text-truncate"
    >
      <object-field-component
        v-if="!tx.std"
        :tablefield="tx.raw"
      />
      <b-table-simple
        v-else
        striped
        stacked="sm"
      >
        <tbody>
          <b-tr>
            <b-td style="width:200px">
              {{ 'txhash' }}
            </b-td><b-td
              class="text-truncate"
            >{{ tx.txhash }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'status' }}
            </b-td><b-td class="text-wrap"> <b-badge
              v-if="tx.code===0"
              variant="light-success"
            >
              Success
            </b-badge><b-badge
              v-else
              variant="light-danger"
            >
              Failed
            </b-badge>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'height' }}
            </b-td><b-td>
              <router-link :to="`../blocks/${tx.height}`">
                {{ tx.height }}
              </router-link></b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'timestamp' }}
            </b-td><b-td>{{ formatTime(tx.timestamp) }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'gas' }}
            </b-td><b-td>{{ tx.gas_used }} / {{ tx.gas_wanted }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'fee' }}
            </b-td><b-td>{{ formattoken(tx.tx.fee) }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'memo' }}
            </b-td><b-td>{{ tx.tx.memo }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ 'timeout_height' }}
            </b-td><b-td>{{ tx.tx.timeout_height }}</b-td>
          </b-tr>
        </tbody>
      </b-table-simple>
    </b-card>

    <b-card v-if="tx.tx.messages">
      <b-card-title>Messages (total: {{ tx.tx.messages.length }})</b-card-title>
      <b-card-body
        v-for="(item, i) in tx.tx.messages "
        id="message"
        :key="i"
        class="message px-0"
      >
        <object-field-component :tablefield="item" />
      </b-card-body>
    </b-card>

    <b-card
      v-if="tx.element"
      title="Details"
    >
      <object-field-component :tablefield="tx.element.tx_response" />
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTableSimple, BTr, BTd, BBadge, BCardBody, BAlert, BCardTitle,
} from 'bootstrap-vue'
import { toDay, tokenFormatter } from '@/libs/utils'
import ObjectFieldComponent from './components/ObjectFieldComponent.vue'

export default {
  components: {
    BAlert,
    BCard,
    BCardTitle,
    BCardBody,
    BTableSimple,
    BTr,
    BTd,
    BBadge,
    ObjectFieldComponent,
  },
  beforeRouteUpdate(to, from, next) {
    const { hash } = to.params
    if (hash !== from.params.hash) {
      this.error = null
      this.$http.getTxs(hash).then(res => {
        this.tx = res
      }).catch(err => {
        this.error = err
      })
      next()
    }
  },
  data() {
    return {
      error: null,
      tx: { tx: {} },
    }
  },
  created() {
    const { hash } = this.$route.params
    this.$http.getTxs(hash).then(res => {
      this.error = null
      this.tx = res
    }).catch(err => {
      this.error = err
    })
  },
  methods: {
    formattoken: v => tokenFormatter(v),
    formatTime: v => toDay(v),
  },
}
</script>

<style>
#message {
    border-top-width: 2px;
    border-top-style: double;
}
#message table.table-hover tr td:hover {
  border-style: solid;
  border-color: green;

    border: double;
    border-radius: 0.5px;
}
</style>
