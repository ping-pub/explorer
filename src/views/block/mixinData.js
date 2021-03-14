
import mixinValidatorsObj from '../validator/mixinValidatorsObj'

export default {
  mixins: [mixinValidatorsObj],
  created() {
    this.getBlocksLatest()
  },
  data() {
    return {
      loading: false,
      page: 1,
      size: 6,
      block_metas: [],
      blocks: [{}, {}, {}, {}, {}, {}],
      blockTxObj: {},
      last_height: null,
      maxHeight: null,
      minHeight: null,
    }
  },
  methods: {
    async getBlocksLatest() {
      this.loading = true
      const res = await this.getRpcBlockchain(0, 0)
      this.loading = false
      this.last_height = res.last_height
      const block_metas = res.block_metas
      this.block_metas = block_metas
      this.blocks = this.splitblock_metas()
      this.getTxs()
    },
    splitblock_metas() {
      const start = (this.page - 1) * this.size
      const end = start + (this.size - 1)
      if (end > this.block_metas.length - 1) return []
      const arr = []
      for (let i = start; i <= end; i += 1) {
        arr.push(this.block_metas[i])
      }
      this.maxHeight = this.last_height - (this.page - 1) * this.size
      this.minHeight = this.maxHeight - this.size + 1
      return arr.reverse()
    },
    prevPage() {
      this.maxHeight += this.size
      if (this.maxHeight > (this.last_height - 1)) {
        this.maxHeight = this.last_height - 1
      }
      this.switchHeight()
    },
    async nextPage() {
      // 总数超过总条数
      const page = this.page + 1
      if (page <= parseInt(this.block_metas.length / this.size)) {
        this.page = page
        this.blocks = this.splitblock_metas()
        this.getTxs()
        return
      }
      // 条数超过第一次获取的数量
      this.maxHeight = this.maxHeight - this.size
      await this.switchHeight()
    },
    async getRpcBlockchain(minHeight, maxHeight) {
      this.loading = true
      const res = await this.$api.fetch('getRpcBlockchain', { minHeight, maxHeight })
      this.loading = false
      return res
    },
    async switchHeight() {
      this.page = 5
      if (this.maxHeight > this.last_height) this.maxHeight = this.last_height
      if (this.maxHeight < this.size) this.maxHeight = this.size
      this.minHeight = this.maxHeight - this.size + 1
      const res = await this.getRpcBlockchain(this.minHeight, this.maxHeight)
      this.blocks = res.block_metas.reverse()
      this.getTxs()
    },
    getTxs() {
      const blockTxObj = {}
      for (const item of this.blocks) {
        if (item.num_txs > 0) {
          this.$api.fetch('getTxs', { height: item.height }).then((txsRes) => {
            if (txsRes) {
              const txsArr = []
              const txs = txsRes.txs || txsRes || [];
              for (const tx of txs) {
                // 判断单个交易是否成功
                let success = !!(tx.logs);
                // 获取 action
                let tagArr = tx.tags || tx.events || (tx.logs && tx.logs[0] && tx.logs[0].events) || [];
                // 获取hash
                let hash = tx.txhash;
                let txObj = {};
                for (const el of tagArr) {
                  if (el.key) {
                    const key = el.key;
                    const val = el.value;
                    if (key === "action") {
                      txObj = {
                        ...txObj,
                        height: tx.height,
                        success,
                        hash,
                        action: val,
                        timestamp: tx.timestamp
                      };
                    }
                    if (key === "sender") {
                      txObj.sender = val;
                    }
                  }
                  if (el.attributes) {
                    for (const one of el.attributes) {
                      if (one.key === "action") {
                        txObj = {
                          ...txObj,
                          height: tx.height,
                          success,
                          hash,
                          action: one.value,
                          timestamp: tx.timestamp
                        };
                      }
                      if (one.key === "sender") {
                        txObj.sender = one.value;
                      }
                    }
                  }
                }
                txObj.hash = tx.txhash
                txObj.memo = tx.tx.value.memo
                txsArr.push(txObj);
              }
              blockTxObj[item.height] = txsArr
              this.blockTxObj = JSON.parse(JSON.stringify(blockTxObj))
            }
          })
        }
      }
    }
  },
}
