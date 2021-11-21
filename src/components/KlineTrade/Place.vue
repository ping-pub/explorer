<template>
  <div class="ticker-place">
    <b-tabs small class="nav-fill">
      <b-tab title="BUY">
        BUY
      </b-tab>
      <b-tab title="SELL">
        SELL
      </b-tab>
    </b-tabs>
    <div class="place-able">
      <div>Available:</div>
      <div>-- USDT</div>
    </div>
    <div class="place-input">
      <div class="place-input-title">
        Price
      </div>
      <b-form-input type="text" />
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
    <div>
      Slippage tolerance
    </div>
    <div class="place-percent">
      <div>1%</div>
      <div>3%</div>
      <div>5%</div>
    </div>
    <div class="place-btn">
      <BButton variant="success">
        BUY
      </BButton>
    </div>
  </div>
</template>

<script>
import {
  BFormInput, BButton, BTabs, BTab,
} from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BFormInput,
    BTab,
    BTabs,
  },
}
</script>

<style lang="scss" scoped>
.ticker-place {
  background: #283046;
  border-radius: 0.428rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  min-height: 44.5rem;
}
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
  margin-bottom: 2rem;
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
  }
}
</style>
