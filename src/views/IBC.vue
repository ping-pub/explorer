<template>
  <div>
    <b-card title="Channels">
      <b-table
        :items="channels"
        :fields="field"
      >
        <!-- A custom formatted column -->
        <template #cell(counterparty)="data">
          <router-link :to="{name: 'ibchannel', params: {channel: data.item.channel_id, port: data.item.port_id}}">
            {{ data.item.channel_id }}/<span
              class="text-truncate"
              style="max-width:200px;"
            >
              {{ data.item.port_id }}
            </span> &lt;&gt; {{ data.value.channel_id }}/<span
              class="text-truncate"
              style="max-width:200px;"
            >
              {{ data.value.port_id }}
            </span>
          </router-link>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTableSimple, BTr, BTd, BBadge, BCardBody, BTable, BCardTitle,
} from 'bootstrap-vue'
import { toDay, tokenFormatter } from '@/libs/utils'
import ObjectFieldComponent from './components/ObjectFieldComponent.vue'

export default {
  components: {
    BTable,
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
      channels: [],
    }
  },
  computed: {

  },
  created() {
    this.$http.getIBCChannels().then(res => {
      this.channels = res.channels
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
