/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @LastEditTime: 2020-06-23 17:02:02
 * @FilePath: /look-web/src/views/governance-id-kava/mixinData.js
 */
import mixinValidatorsObj from '../validator/mixinValidatorsObj'

export default {
  mixins: [mixinValidatorsObj],
  computed: {
    total_deposit() {
      if (!this.item.total_deposit_str) return '--'
      const str = this.item.total_deposit_str.amount + ' ' + this.item.total_deposit_str.denom
      return str
    }
  },
  data() {
    return {
      loading: false,
      loadingDeposits: false,
      loadingVotes: false,
      item: {},
      address: '',
      depositList: [],
      voteList: []
    }
  },
  created() {
    this.initData()
  },
  activated() {
    this.initData()
  },
  methods: {
    back() {
      this.$router.back()
    },
    async fetchTotalBondedTokens() {
      const res = await this.$api.fetch('getStakingPool')
      this.$store.commit('bondedTokensSet', res.bonded_tokens_val)
      this.initData()
    },
    initData() {
      const { id } = this.$route.params
      if (this.$route.query.address) {
        this.address = this.$route.query.address
      }
      this.item = {}
      this.init(id)
      // this.getGovProposalsDeposits(id)
      // this.getGovProposalsVotes(id)
    },
    async getGovProposalsDeposits(proposalId) {
      this.loadingDeposits = true
      const res = await this.$api.fetch('getGovProposalsDeposits', { proposalId })
      this.loadingDeposits = false
      this.depositList = res
    },
    async getGovProposalsVotes(proposalId) {
      this.loadingVotes = true
      const res = await this.$api.fetch('getGovProposalsVotes', { proposalId })
      this.loadingVotes = false
      this.voteList = res
    },
    async init(id) {
      // this.loading = true
      const res = await this.$api.fetch('getCommitteeCommitteesId', { id })
      this.loading = false
      this.item = res
    }
  }
}
