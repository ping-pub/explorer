<template>
  <div>
    <dl>
      <dt>Available</dt>
      <dd class="d-flex justify-content-between mt-1">
        <feather-icon icon="PlusSquareIcon" /> <span> {{ 0 }} {{ type === 0 ? target: base }} </span>
      </dd>
    </dl>
    <dl>
      <dt>Price</dt>
      <dd class="d-flex justify-content-end mt-1">
        {{ price }} {{ target }}
      </dd>
    </dl>
    <b-form-group>
      <label for="amount">
        Amount
      </label>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="amount"
          v-model="amount"
          type="number"
          placeholder="Amount"
          @change="changeAmount()"
        />
        <b-input-group-append is-text>
          {{ type === 0 ? target: base }}
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group>
      <label for="total">
        Total
      </label>
      <b-input-group class="input-group-merge">
        <b-form-input
          id="total"
          v-model="total"
          type="number"
          placeholder="Total"
          @change="changeTotal()"
        />
        <b-input-group-append is-text>
          {{ type === 1 ? target: base }}
        </b-input-group-append>
      </b-input-group>
      <b-alert
        variant="danger"
        :show="total > available"
      >
        <div class="alert-body">
          Insufficient available amount
        </div>
      </b-alert>
    </b-form-group>
    <b-form-group>
      <label>
        Slippage tolerance
      </label>
      <div class="demo-inline-spacing">
        <b-form-radio
          v-model="slippage"
          value="0.01"
        >
          1%
        </b-form-radio>
        <b-form-radio
          v-model="slippage"
          value="0.025"
        >
          2.5%
        </b-form-radio>
        <b-form-radio
          v-model="slippage"
          value="0.05"
        >
          5%
        </b-form-radio>
      </div>
    </b-form-group>
    <b-form-group>
      <BButton
        block
        :variant="type === 0 ? 'success': 'danger'"
      >
        {{ type === 0 ? 'Buy' : 'Sell' }}
      </BButton>
    </b-form-group>
    <b-alert
      class="mt-2"
      variant="secondary"
      show
    >
      <div class="alert-heading">
        Note
      </div>
      <div class="alert-body">
        If the execution price exceeds the {{ slippage * 100 }}% slippage protection, your order will be automatically cancelled
      </div>
    </b-alert>

  </div>
</template>

<script>
import {
  BFormInput, BButton, BAlert, BFormGroup, BInputGroup, BInputGroupAppend, BFormRadio,
} from 'bootstrap-vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BAlert,
    BButton,
    BFormInput,
    BFormRadio,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    FeatherIcon,
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
    base: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      available: 0,
      amount: 0,
      total: 0,
      // price: 50000,
      slippage: 0.05,
      marks: [0, 0.01, 0.025, 0.05],
    }
  },
  computed: {
    price() {
      const p1 = this.$store.state.chains.quotes[this.base]
      const p2 = this.$store.state.chains.quotes[this.target]
      return p1 && p2 ? (p1.usd / p2.usd).toFixed(4) : '-'
    },
  },
  methods: {
    changeAmount() {
      this.total = this.amount * this.price
    },
    changeTotal() {
      this.amount = this.total / this.price
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
