<template>
  <div class="ticker-bar">
    <div class="ticker-name">
      BTC / USDT
    </div>
    <div class="ticker-price">
      59300
    </div>
    <div class="ticker-item">
      <div>24h Change</div>
      <div>460 +0.78%</div>
    </div>
    <div class="ticker-item">
      <div>24h High</div>
      <div>59000</div>
    </div>
    <div class="ticker-item">
      <div>24h Low</div>
      <div>58000</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ticker-bar {
  height: 5rem;
  display: flex;
  align-items: center;
  .ticker-name {
    font-size: 20px;
    font-weight: bold;
    margin-right: 2rem;
  }
  .ticker-price {
    font-size: 24px;
    font-weight: bold;
    color: rgb(65, 242, 173);
    margin-right: 2rem;
  }
  .ticker-item {
    margin-right: 2rem;
    div:first-of-type {
      font-size: 12px;
      color: #999;
    }
    div:last-child {
      font-size: 14px;
    }
  }
}
</style>
