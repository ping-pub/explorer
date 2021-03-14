<script>
export default {
  mixins: [],
  data() {
    return {
      operator_address: "",
      loading: false,
      header: {},
      block: {},
      height: "",
      precommits: [],
      precommitsLoading: false,
      precommitsColumns: [
        {
          label: this.$t("message.blockheight_Address"),
          prop: "address",
          width: 400,
          render: (h, context) => {
            const row = context.props.scope.row;
            const { address } = row;
            const user =
              this.validatorsObjHex &&
              this.validatorsObjHex[address] &&
              this.validatorsObjHex[address];
            const name = (user && user.moniker) || address;
            const str = user ? (
              <a
                to={{
                  path: `/validator/${user.operator_address}`
                }}
              >
                {name}
              </a>
            ) : (
              <div>{name}</div>
            );
            return str;
          }
        },
        {
          label: this.$t("message.blockheight_VotingPower"),
          prop: "voting_power"
        },
        {
          label: this.$t("message.blockheight_ProposerPriority"),
          prop: "proposer_priority"
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.height = this.$route.params.height;
      this.fetchBlockItem();
      this.showPrecommits();
    },
    // 展示 precommits 详情
    async showPrecommits() {
      this.precommits = [];
      this.precommitsLoading = true;
      const res = await this.$api.fetch("getRpcValidators", {
        height: this.height
      });

      this.precommitsLoading = false;
      if (!res) return;
      this.precommits = res.validators;
    },
    async fetchBlockItem() {
      this.loading = true;
      const res = await this.$api.fetch("getBlocksHeight", {
        height: this.height
      });
      this.loading = false;
      if (!res) return;
      const evidence = res.block.evidence.evidence;
      const item = res.block_meta || res;
      const { hash, parts } = item.block_id;
      const {
        height,
        app_hash,
        chain_id,
        consensus_hash,
        evidence_hash,
        data_hash,
        last_block_id,
        last_commit_hash,
        last_results_hash,
        next_validators_hash,
        num_txs,
        proposer_address,
        time,
        total_txs,
        validators_hash,
        version
      } = (item.block && item.block.header) || item.header;
      const lastBlockHash = last_block_id.hash || "";
      // const user = this.validatorsObjHex[proposer_address];
      const Proposer = proposer_address;
      // this.operator_address = (user && user.operator_address) || "";
      this.header = {
        [this.$t("message.blockheight_Height")]: height,
        [this.$t("message.blockheight_Proposer")]: Proposer,
        [this.$t("message.blockheight_BlockHash")]: hash,
        [this.$t("message.blockheight_LastBlockHash")]: lastBlockHash,
        [this.$t("message.blockheight_BlockTime")]: time,
        [this.$t("message.blockheight_NumberofTransactions")]: num_txs,
        [this.$t("message.blockheight_TotalofTransactions")]: total_txs
      };
      this.block = {
        [this.$t("message.blockheight_ChainId")]: chain_id,
        [this.$t("message.blockheight_BlockApp")]: version.app,
        [this.$t("message.blockheight_BlockVersion")]: version.block,
        [this.$t("message.blockheight_Evidence")]: evidence || "--",
        [this.$t("message.blockheight_EvidenceHash")]: evidence_hash || "--",
        [this.$t("message.blockheight_AppHash")]: app_hash,
        [this.$t("message.blockheight_ValidatorsHash")]: validators_hash,
        [this.$t(
          "message.blockheight_NextValidatorsHash"
        )]: next_validators_hash,
        [this.$t("message.blockheight_ConsensusHash")]: consensus_hash,
        [this.$t("message.blockheight_PartsHash")]: parts.hash,
        [this.$t("message.blockheight_DataHash")]: data_hash,
        [this.$t("message.blockheight_LastCommitHash")]: last_commit_hash,
        [this.$t("message.blockheight_LastResultsHash")]:
          last_results_hash || "--"
      };
    }
  }
};
</script>

<template>
  <div>
    <div class="area-title txitem-header">{{ $t("message.blockheight_header") }}</div>
    <div class="bg-white" style="padding: 20px;min-height: 140px;" v-loading="loading">
      <el-row v-for="(val,key) of header" :key="key">
        <el-col :xs="24" :sm="24" :md="8" class="tx-item-title">{{ key}}</el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="16"
          v-if="(key.substr(-4) === 'Hash' || (key.substr(-8) === 'Proposer' ||  key === '提议人' && !operator_address))"
          class="block-val"
        >
          <div class="text-overflow">{{val}}</div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="16"
          v-else-if="((key.substr(-8) === 'Proposer' || key === '提议人') && operator_address)"
          class="block-val"
        >
          <a :href="`#/validator/${operator_address}`">{{val}}</a>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" v-else class="block-val">{{ val }}</el-col>
      </el-row>
    </div>

    <div class="area-title block-more-title">{{ $t("message.blockheight_more") }}</div>

    <div class="bg-white block-more-wrap" v-loading="loading">
      <el-row class v-for="(val,key) of block" :key="key">
        <el-col :xs="24" :sm="24" :md="8" class="tx-item-title">{{ key}}</el-col>
        <el-col :xs="24" :sm="24" :md="16" v-if="key === 'Chain Id'" class="block-val">
          <el-tag type="primary">{{val}}</el-tag>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" v-else-if="key.substr(-4) === 'Hash'" class="block-val">
          <div class="text-overflow">{{val}}</div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" v-else class="block-val">{{ val }}</el-col>
      </el-row>
    </div>

    <div class="area-title block-more-title">{{ $t("message.validators") }}</div>

    <dingyi-data-table
      ref="dtPrecommits"
      :noLocalPaging="true"
      :toolbar="false"
      :btns="{ noFresh: true, index: true }"
      :datas="precommits"
      :columns="precommitsColumns"
      :loading="precommitsLoading"
    ></dingyi-data-table>
  </div>
</template>

<style scoped>
.block-more-title {
  margin-top: 20px;
  border-left: 4px solid #343a40;
  padding: 5px 10px;
}
.block-more-wrap {
  padding: 20px;
  margin-top: 20px;
  min-height: 300px;
}
.block-text {
  font-size: 20px;
  font-weight: 500;
}
.txitem-header {
  border-left: 4px solid #343a40;
  padding: 5px 10px;
}
.block-val {
  margin-bottom: 10px;
}
</style>
