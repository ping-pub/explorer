/*
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-03-08 22:22:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /look/src/views/wallet-portfolio/mixinData.js
 */
import mixinValidatorsObj from "../validator/mixinValidatorsObj";

export default {
  mixins: [mixinValidatorsObj],
  data() {
    return {
      address: "",
      available: "--",
      reward: "--",
      delegated: "--",
      delegations: [],
      rewards: [],
      rewardObj: {},
      data: [],
      txs: [],
      page: 1,
      total_count: 0
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  computed: {
    total() {
      if (!this.available || !this.delegated || !this.reward) return "--";
      const total =
        Number(this.available) + Number(this.delegated) + Number(this.reward);
      return isNaN(total) ? "--" : total;
    }
  },
  watch: {
    address(val) {
      if (val) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      const address = this.$route.query.address;
      const addressTemp = window.sessionStorage.getItem("address");
      if (address) this.address = address;
      if (!address && !addressTemp) return
      if (!address && addressTemp)
        this.$router.replace({ query: { address: addressTemp } });
      this.getAuthAccounts();
      this.getStakingDelegatorsDelegations();
      this.getDistributionDelegatorsRewards();
      this.getTxs()
    },
    async getAuthAccounts() {
      const address = this.address;
      this.loading = true;
      const res = await this.$api.fetch("getAuthAccounts", { address });
      if (!res) return;
      this.available = res.available;
      this.loading = false;
    },
    async getStakingDelegatorsDelegations() {
      const delegatorAddress = this.address;
      const res = await this.$api.fetch("getStakingDelegatorsDelegations", {
        delegatorAddress
      });
      if (!res) return;
      this.delegations = res.delegations;
      this.delegated = res.delegated;
    },
    async getDistributionDelegatorsRewards() {
      const delegatorAddress = this.address;
      const res = await this.$api.fetch("getDistributionDelegatorsRewards", {
        delegatorAddress
      });
      if (!res) return;
      this.rewards = res.rewards;
      this.reward = res.reward;
      this.rewardObj = res.rewardObj;
    },
    // 查询交易
    async getTxs() {
      const address = this.address;
      const res = await this.$api.fetch("getTxsHistory", {
        address,
        page: this.page
      });
      if (!res) return;
      this.txs = res.txs
    }
  }
};
