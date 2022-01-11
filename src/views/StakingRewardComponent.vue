<template>
  <b-card
    class="card-transaction"
    no-body
  >
    <b-card-header>
      <b-card-title>Outstanding Rewards</b-card-title>
      <feather-icon
        v-b-modal.withdraw-commission-window
        icon="MoreVerticalIcon"
        size="18"
        class="cursor-pointer"
      />
    </b-card-header>

    <b-card-body
      class="overflow-auto"
      style="max-height:220px;"
    >
      <div
        v-for="d in data.self_bond_rewards"
        :key="d.amount"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar
              rounded
              size="42"
              variant="light-success"
            />
          </b-media-aside>
          <b-media-body>
            <h6 class="transaction-title">
              {{ formatNumber(d.amount) }}
            </h6>
            <small>{{ formatDenom(d.denom) }} </small>
          </b-media-body>
        </b-media>
        <small
          class="text-success d-none d-xl-block "
        >
          Reward
        </small>
      </div>
      <div
        v-for="d in data.val_commission"
        :key="d.amount"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar
              rounded
              size="42"
              variant="light-primary"
            >
              <feather-icon
                size="18"
                icon="ServerIcon"
              />
            </b-avatar>
          </b-media-aside>
          <b-media-body>
            <h6 class="transaction-title">
              {{ formatNumber(d.amount) }}
            </h6>
            <small>{{ formatDenom(d.denom) }}</small>
          </b-media-body>
        </b-media>
        <small
          class="text-primary d-none d-xl-block"
        >
          Commission
        </small>
      </div>
    </b-card-body>
    <b-card-body class="pt-0">
      <b-button
        v-b-modal.withdraw-commission-window
        block
        size="sm"
        variant="primary"
      >
        Withdraw Commission
      </b-button>
    </b-card-body>
    <operation-withdraw-commission-component
      :validator-address="validator"
      :address="address"
    />
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BMediaBody, BMedia, BMediaAside, BAvatar, BButton,
} from 'bootstrap-vue'
import { sha256 } from '@cosmjs/crypto'
import { toHex } from '@cosmjs/encoding'
import OperationWithdrawCommissionComponent from './OperationWithdrawCommissionComponent.vue'

export default {
  components: {
    BButton,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BAvatar,
    OperationWithdrawCommissionComponent,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    validator: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      denoms: {},
    }
  },
  created() {
    this.$http.getAllIBCDenoms().then(x => {
      x.denom_traces.forEach(trace => {
        const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
        this.$set(this.denoms, `ibc/${hash.toUpperCase()}`, trace.base_denom)
      })
    })
  },
  methods: {
    formatNumber(value) {
      return Number(value).toFixed(2)
    },
    formatDenom(value) {
      return value.startsWith('ibc') ? this.denoms[value] : value
    },
  },
}
</script>
