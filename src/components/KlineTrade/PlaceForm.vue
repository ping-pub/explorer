<template>
  <div>
    <div class="place-able">
      <div>Available:</div>
      <div>-- USDT</div>
    </div>
    <div class="place-price">
      <div class="place-input-title">
        Price
      </div>
      <div class="place-price-value">
        59000
      </div>
      <div class="place-input-unit">
        USDT
      </div>
    </div>
    <div class="place-input">
      <div class="place-input-title">
        Amount
      </div>
      <b-form-input type="text" />
      <div class="place-input-unit">
        BTC
      </div>
    </div>
    <div class="place-input">
      <div class="place-input-title">
        Value
      </div>
      <b-form-input type="text" />
      <div class="place-input-unit">
        USDT
      </div>
    </div>
    <div class="place-value-money">
      ≈ 213123 CNY
    </div>
    <div>
      Slippage tolerance
    </div>
    <div class="place-percent">
      <div>1%</div>
      <div>3%</div>
      <div>5%</div>
    </div>
    <div class="place-btn">
      <BButton :variant="type === 0 ? 'success': 'danger'">
        {{ type === 0 ? 'Buy' : 'Sell' }}
      </BButton>
    </div>
    <b-alert
      style="margin-top: 2rem"
      variant="secondary"
      show
    >
      <div class="alert-heading">
        Note
      </div>
      <div class="alert-body">
        If the execution price exceeds the 5% slippage protection, your order will be automatically cancelled
      </div>
    </b-alert>

  </div>
</template>

<script>
import {
  BFormInput, BButton, BAlert,
} from 'bootstrap-vue'

export default {
  components: {
    BAlert,
    BButton,
    BFormInput,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.place-percent {
  display: flex;
  margin-bottom: 2rem;
  margin-top: 1rem;
  div {
    flex: 1;
    text-align: center;
    border: 1px solid #404656;
    margin-right: 5px;
    border-radius: 2px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
}
.place-btn {
  margin-bottom: 1rem;
  button {
    width: 100%;
  }
}
.place-market {
  display: flex;
  height: 3rem;
  align-items: center;
  div {
    margin-right: 2rem;
    font-weight: bold;
    color: #999;
  }
  div:first-of-type {
    color: #fff;
  }
}
.place-able {
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.place-input {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid #404656;
  border-radius: 0.3rem;
  padding: 0 1rem;

  &:focus-within {
    border-color: #fff;
  }
  .place-input-title {
    width: 7rem;
  }
  .place-input-unit {
    width: 5rem;
    text-align: right;
  }
  .form-control {
    border-color: #2A3044 !important;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}
.place-price {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  .place-price-value {
    font-size: 20px;
    flex: 1;
    text-align: center;
  }
}
.place-value-money {
  text-align: right;
}
</style>
