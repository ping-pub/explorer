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
        v-for="(item, i) in messages"
        id="message"
        :key="i"
        class="message px-0"
      >
        <object-field-component :tablefield="item" />
      </b-card-body>
    </b-card>

    <b-card v-if="ibcAcks">
      <b-card-title>IBC Acknowledgements</b-card-title>
      <b-card-body
        v-for="(item, i) in ibcAcks"
        id="message"
        :key="`ack${i}`"
        class="message px-0"
      >
        <object-field-component :tablefield="item" />
      </b-card-body>
      Note: <code>CPdVftUYJv4Y2EUSvyTsdQAe268hI6R333KgqfNkCnw=</code> is success status in bytes
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
      ibcAcks: { },
    }
  },
  computed: {
    messages() {
      return this.tx.tx.messages.map((x, i) => {
        const x1 = x
        if (this.ibcAcks[i]) {
          x1.status = this.ibcAcks[i].acknowledgement
        }
        return x1
      })
    },
  },
  created() {
    const { hash } = this.$route.params
    this.$http.getTxs(hash).then(res => {
      this.error = null
      this.tx = res
      res.logs.forEach((log, i) => {
        log.events.forEach(e => {
          const keys = Object.values(e.attributes).map(x => x.key)
          if (keys.includes('packet_src_port')) {
            const att = {}
            e.attributes.forEach(x => {
              att[x.key] = x.value
            })
            // console.log(att)
            // this.$http.getIBCReceipts(att.packet_dst_channel, att.packet_dst_port, att.packet_sequence).then(re => console.log(re))
            this.$http.getIBCAcks(att.packet_src_channel, att.packet_src_port, att.packet_sequence).then(re => {
              this.$set(this.ibcAcks, i, JSON.parse(JSON.stringify(re)))
            })
          }
        })
      })
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
