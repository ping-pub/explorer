<template>
  <div>
    <div
      v-if="false"
      class="board "
    >
      <div class="data">
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
      v-if="succeed"
      class="result-text mt-1 text-success"
    >
      Congratulations! Transfer completed successfully.
    </p>
    <p
      v-else-if="error"
      class="result-text mt-1 text-danger"
    >
      {{ error }}
    </p>
    <p
      v-else
      class="result-text mt-1 text-primary"
    >
      Processing...
    </p>

    <div class="status">
      <b-progress :animated="isLoading">
        <b-progress-bar
          variant="success"
          :value="progresBar[0]"
        />
        <b-progress-bar
          variant="danger"
          :value="progresBar[1]"
        />
      </b-progress>
      <div class="status-text">
        <span v-if="hash">SUBMITTED</span>
        <span v-if="succeed">COMPLETED</span>
        <span v-if="error">FAILED</span>
      </div>
    </div>
    <div class="link">
      <router-link
        :to="txUrl"
      >
        View Transaction
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
  props: {
    hash: {
      type: String,
      default: null,
    },
    selectedChain: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isLoading: true,
      succeed: false,
      error: '',
      checkTimes: 0,
    }
  },
  computed: {
    progresBar() {
      // success: [100, 0, 0]
      // fail: [50, 50, 0]
      // pending: [0, 0, 100]
      if (!this.hash) {
        return [0, 0, 100]
      }
      if (this.succeed) {
        return [100, 0, 0]
      }
      return [50, 0, 50]
    },
    txUrl() {
      const chain = this.selectedChain ? this.selectedChain.chain_name : this.$store.state.chains.selected.chain_name
      return `/${chain}/tx/${this.hash}`
    },
  },
  mounted() {
    this.timer = setInterval(this.trace, 6000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    trace() {
      if (this.hash) {
        this.error = null
        this.$http.getTxs(this.hash, this.selectedChain).then(res => {
          if (res.code === 0) {
            this.succeed = true
            this.isLoading = false
            clearInterval(this.timer)
            const elem = document.getElementById('txevent')
            if (elem) {
              const event = new Event('txcompleted', res)
              elem.dispatchEvent(event)
            }
          } else if (res.code !== 3) { // code 3 is tx unconfirmed(not founded).
            this.error = res.raw_log
            clearInterval(this.timer)
          }
        }, () => {
          // error statement
          this.checkTimes += 1
          if (this.checkTimes > 5) {
            clearInterval(this.timer)
            this.error = 'Timeout'
          }
        }).catch(e => {
          this.error = e
          clearInterval(this.timer)
        })
      }
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
