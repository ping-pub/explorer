<template>
  <b-tabs>
    <b-tab title="Sended Transactions">
      <object-field-component :tablefield="sending.txs" />
    </b-tab>

    <b-tab title="Received Transactions">
      <object-field-component :tablefield="recv.txs" />
    </b-tab>
  </b-tabs>
</template>

<script>
import {
  BCard, BTableSimple, BTr, BTd, BBadge, BCardBody, BCardTitle, BTab, BTabs,
} from 'bootstrap-vue'
import { toDay, tokenFormatter } from '@/libs/utils'
import ObjectFieldComponent from './components/ObjectFieldComponent.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BCardTitle,
    BCardBody,
    BTableSimple,
    BTr,
    BTd,
    BBadge,
    ObjectFieldComponent,
  },
  data() {
    return {
      error: null,
      field: ['state', 'counterparty'],
      sending: [],
      recv: {},
    }
  },
  computed: {

  },
  created() {
    const { channel, port } = this.$route.params
    this.$http.getTxsByChannelAndPort(channel, port).then(res => {
      this.sending = res
    })

    this.$http.getRecvTxsByChannelAndPort(channel, port).then(res => {
      this.recv = res
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
