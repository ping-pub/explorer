<template>
  <div>
    <div class="board">
      <div
        v-if="1"
        class="data"
      >
        <div class="board-row">
          <div class="key">
            AMOUNT
          </div>
          <div class="value">
            1,233,000 USDT
          </div>
        </div>
        <div class="board-row">
          <div class="key">
            BRIDGE FEE
          </div>
          <div class="value">
            3,000 USDT
          </div>
        </div>
      </div>
      <div class="sum">
        <div class="key">
          TRANSFER AMOUNT
        </div>
        <div class="value">
          1,213,000 USDT
        </div>
      </div>
    </div>

    <p
      v-if="1"
      class="result-text"
    >
      Congratulations! Transfer completed successfully.
    </p>

    <div class="status">
      <!-- <b-progress
        :value="100"
        :variant="progressColor"
        :animated="isLoading"
      /> -->
      <b-progress :animated="isLoading">
        <b-progress-bar
          variant="success"
          :value="progresBar[0]"
        />
        <b-progress-bar
          variant="danger"
          :value="progresBar[1]"
        />
        <b-progress-bar
          variant="info"
          :value="progresBar[2]"
        />
      </b-progress>
      <div class="status-text">
        <span>SUBMITED</span>
        <span>COMPLETED</span>
      </div>
    </div>
    <div class="link">
      <router-link
        to="/"
      >
        View on explorer
      </router-link>
    </div>
  </div>
</template>

<script>
import { BProgress, BProgressBar } from 'bootstrap-vue'

export default {
  components: {
    BProgress,
    BProgressBar,
  },
  data() {
    return {
      isLoading: true,
    }
  },
  computed: {
    progresBar() {
      // success: [100, 0, 0]
      // fail: [50, 50, 0]
      // pending: [0, 0, 100]
      return [0, 0, 100]
    },
  },
}
</script>

<style lang="scss" scoped>
.board {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 0 12px;
  margin: 35px 0;
  .data {
    padding: 10px 0;
    border-bottom: 1px solid #607d8b;
  }
  .board-row {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    line-height: 34px;
    .key {
      color: #666;
    }
    .value {
      font-weight: bold;
    }
  }
  .sum {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: bold;
    padding: 15px 0;
  }
}
.result-text {
  text-align: center;
  font-size: 16px;
}
.status {
  margin-top: 30px;
  .status-text {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-weight: 500;
  }
}
.link {
  margin-top: 20px;
  text-align: center;
  a {
    text-decoration: underline;
    color: var(--purple)
  }

}
</style>
