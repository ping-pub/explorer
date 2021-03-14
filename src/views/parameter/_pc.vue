<template>
  <div>
    <ParamItem
       v-if="filterShow.node"
      :title="$t('message.parameter_VersionParameters')"
      :content="nodeInfo"
    />
    <ParamItem
       v-if="filterShow.node"
      :title="$t('message.parameter_NodeParameters')"
      :content="nodeParameters"
    />

    <div v-if="filterShow.governance">
      <p class="area-title">{{ $t("message.parameter_GovernanceParameters") }}</p>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="parameter-item">
          <div class="parameter-item-content">
            <div class="parameter-item-title">{{ $t("message.parameter_Deposit") }}</div>
            <div class="parameter-item-value">{{ min_deposit }}</div>
            <div class="parameter-item-subtitle">
              {{ $t("message.parameter_MaxDepositPeriod") }}
              <span class="parameter-item-subvalue">
                {{
                max_deposit_period
                }}
              </span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="parameter-item">
          <div class="parameter-item-content">
            <div class="parameter-item-title">{{ $t("message.parameter_Voting") }}</div>
            <div class="parameter-item-value">{{ voting_period }}</div>
            <div
              class="parameter-item-subtitle"
              style="text-align:center;"
            >{{ $t("message.parameter_VotingPeriod") }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="parameter-item">
          <div class="parameter-item-content">
            <div
              class="parameter-item-title"
              style="margin-bottom: 0px;"
            >{{ $t("message.parameter_Tallying") }}</div>
            <div class="parameter-item-subvalue2">
              {{ $t("message.parameter_Quorum") }}
              <span>{{ quorum }}</span>
            </div>
            <div class="parameter-item-subvalue2">
              {{ $t("message.parameter_Threshold") }}
              <span>{{ threshold }}</span>
            </div>
            <div class="parameter-item-subvalue2">
              {{ $t("message.parameter_Veto") }}
              <span>{{ veto }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <ParamItem
      v-if="filterShow.staking"
      :title="$t('message.parameter_StakingParameters')"
      :content="stakingParameters"
    />
    <ParamItem
      :title="$t('message.parameter_SlashingParameters')"
      :nums="4"
      :content="slashingParameters"
    />
    <ParamItem
      v-if="filterShow.distribution"
      :title="$t('message.parameter_DistributionParameters')"
      :content="distributionParameters"
    />
    <ParamItem
      v-if="filterShow.mint"
      :title="$t('message.parameter_MintParameters')"
      :nums="3"
      :content="mintParameters"
    />
     <ParamItem
       v-if="filterShow.cdp"
      :title="$t('message.parameter_cdp')"
      :content="cdp"
    />
    <ParamItem
       v-if="filterShow.cdp"
      title="Auction"
      :content="auction"
    />
    <ParamItem
       v-if="filterShow.cdp"
      title="Bep3"
      :content="bep3"
    />
    <ParamItem
       v-if="filterShow.cdp"
      title="Incentive"
      :content="incentive"
    />
  </div>
</template>

<script>
import ParamItem from "./ParamItem";
import mixinData from "./mixinData";

export default {
  mixins: [mixinData],
  components: {
    ParamItem
  },
  computed: {
    incentive() {
      const {
        rewards
      } = this.data;
      let rewards_available = rewards && rewards[0]
        && rewards[0].available_rewards
        && rewards[0].available_rewards.amount
        && (rewards[0].available_rewards.amount/ 6).toFixed(2)
      return [
        {
          title: `rewards denom`,
          value: rewards && rewards[0] && rewards[0].denom || "--"
        },
        {
          title: `rewards available`,
          value: rewards_available || "--"
        },
        {
          title: `rewards duration`,
          value: rewards && rewards[0] && rewards[0].duration || "--"
        },
        {
          title: `rewards time_lock`,
          value: rewards && rewards[0] && rewards[0].time_lock || "--"
        },
        {
          title: `rewards claim_duration`,
          value: rewards && rewards[0] && rewards[0].claim_duration || "--"
        },
      ];
    },
    bep3() {
      const {
        bnb_deputy_address,
        bnb_deputy_fixed_fee,
        min_amount,
        max_amount,
        min_block_lock,
        max_block_lock,
      } = this.data;
      return [
        {
          title: `bnb_deputy_address`,
          value: bnb_deputy_address || "--"
        },
        {
          title: `bnb_deputy_fixed_fee`,
          value:  (bnb_deputy_fixed_fee && parseFloat((bnb_deputy_fixed_fee/8).toFixed(2))) || "--"
        },
        {
          title: `min_amount`,
          value: min_amount || "--"
        },
        {
          title: `max_amount`,
          value: (max_amount && parseFloat((max_amount/8).toFixed(2))) || "--"
        },
        {
          title: `min_block_lock`,
          value: min_block_lock || "--"
        },
        {
          title: `max_block_lock`,
          value: max_block_lock || "--"
        },
      ];
    },
    auction() {
      const {
        max_auction_duration,
        bid_duration,
        increment_surplus,
        increment_debt,
        increment_collateral,
      } = this.data;
      return [
        {
          title: `max_auction_duration`,
          value: max_auction_duration || "--"
        },
        {
          title: `bid_duration`,
          value: bid_duration || "--"
        },
        {
          title: `increment_surplus`,
          value: increment_surplus || "--"
        },
        {
          title: `increment_debt`,
          value: (increment_debt) || "--"
        },
        {
          title: `increment_collateral`,
          value: increment_collateral || "--"
        },
      ];
    },
    cdp() {
      const {
        circuit_breaker,
        debt_auction_lot,
        debt_auction_threshold,
        global_debt_limit,
        savings_distribution_frequency,
        surplus_auction_lot,
        surplus_auction_threshold,
        collateral_params,
        debt_param,
      } = this.data;
      return [
        {
          title: `circuit_breaker`,
          value: circuit_breaker ? 'Active' : 'Inactive'
        },
        {
          title: `debt_auction_lot`,
          value: debt_auction_lot || "--"
        },
        {
          title: `debt_auction_threshold`,
          value: debt_auction_threshold || "--"
        },
        {
          title: `global_debt_limit`,
          value: (global_debt_limit && parseFloat((global_debt_limit.amount/ 6).toFixed(2))) || "--"
        },
        {
          title: `savings_distribution_frequency`,
          value: savings_distribution_frequency || "--"
        },
        {
          title: `surplus_auction_lot`,
          value: surplus_auction_lot || "--"
        },
        {
          title: `surplus_auction_threshold`,
          value: surplus_auction_threshold || "--"
        },
        {
          title: `debt_param conversion_factor`,
          value: (debt_param && debt_param.conversion_factor) || "--"
        },
        {
          title: `debt_param debt_floor`,
          value: (debt_param && parseFloat((debt_param.debt_floor/ 6).toFixed(2))) || "--"
        },
        {
          title: `debt_param reference_asset`,
          value: (debt_param && debt_param.reference_asset) || "--"
        },
        {
          title: `debt_param savings_rate`,
          value: (debt_param && debt_param.savings_rate) || "--"
        },
        {
          title: `debt_param denom`,
          value: (debt_param && debt_param.denom) || "--"
        },
      ];
    },
    nodeInfo() {
      const {
        node_info,
        application_version,
      } = this.data;
      return [
        {
          title: this.$t("message.validator_network"),
          value: node_info && node_info.network || "--"
        },
        {
          title: this.$t("message.validator_version"),
          value: node_info && node_info.version || "--"
        },
        {
          title: this.$t("message.validator_go"),
          value: application_version && application_version.go || "--"
        },
        {
          title: this.$t("message.validator_application_version"),
          value: application_version && application_version.version || "--"
        },
      ];
    },
    nodeParameters() {
      const {
        unbonding_time,
        max_validators,
        max_entries,
        bond_denom
      } = this.data;
      return [
        {
          title: this.$t("message.validator_BlockHeight"),
          value: this.blockHeight || "--"
        },
        {
          title: this.$t("message.validator_Validators"),
          value: max_validators || "--"
        },
        {
          title: this.$t("message.validator_BondedTokens"),
          value: this.tokens.bonded_tokens + '/' + this.tokenTotal_str || "--"
        },
        {
          title: this.$t("message.validator_EarningRate"),
          value: this.earningRate.percent || "--"
        }
      ];
    },
    filterShow() {
      let obj = {
        governance: true,
        staking: true,
        slashing: true,
        distribution: true,
        mint: true,
        node: true,
        cdp: false,
      };
      const chainId = window.chain.chainId;
      switch (chainId) {
        case "e-money":
        case "irishub":
          obj.governance = false;
          obj.mint = false;
          obj.node = false
          break;
        case 'kava-2':
          obj.cdp = true;
          break;
      }
      return obj;
    },
    stakingParameters() {
      const {
        unbonding_time,
        max_validators,
        max_entries,
        bond_denom
      } = this.data;
      return [
        {
          title: this.$t("message.parameter_UnbondingTime"),
          value: unbonding_time || "--"
        },
        {
          title: this.$t("message.parameter_MaxValidators"),
          value: max_validators || "--"
        },
        {
          title: this.$t("message.parameter_MaxEntries"),
          value: max_entries || "--"
        },
        {
          title: this.$t("message.parameter_BondDenom"),
          value: bond_denom || "--"
        }
      ];
    },
    slashingParameters() {
      const {
        max_evidence_age,
        signed_blocks_window,
        min_signed_per_window,
        downtime_jail_duration,
        slash_fraction_double_sign,
        slash_fraction_downtime
      } = this.data;
      return [
        {
          title: this.$t("message.parameter_MaxEvidenceAge"),
          value: max_evidence_age || "--"
        },
        {
          title: this.$t("message.parameter_SignedBlocksWindow"),
          value: signed_blocks_window || "--"
        },
        {
          title: this.$t("message.parameter_MinSignedPerWindow"),
          value: min_signed_per_window || "--"
        },
        {
          title: this.$t("message.parameter_DowntimeJailDuration"),
          value: downtime_jail_duration || "--"
        },
        {
          title: this.$t("message.parameter_DoubleSignSlash"),
          value: slash_fraction_double_sign || "--"
        },
        {
          title: this.$t("message.parameter_DowntimeSlash"),
          value: slash_fraction_downtime || "--"
        }
      ];
    },
    distributionParameters() {
      const {
        community_tax,
        base_proposer_reward,
        bonus_proposer_reward,
        withdraw_addr_enabled
      } = this.data;
      return [
        {
          title: this.$t("message.parameter_CommunityTax"),
          value: community_tax || "--"
        },
        {
          title: this.$t("message.parameter_BaseProposerReward"),
          value: base_proposer_reward || "--"
        },
        {
          title: this.$t("message.parameter_BonusProposerReward"),
          value: bonus_proposer_reward || "--"
        },
        {
          title: this.$t("message.parameter_WithdrawAddrEnabled"),
          value: withdraw_addr_enabled || "--"
        }
      ];
    },
    mintParameters() {
      const {
        goal_bonded,
        inflation,
        inflation_max,
        inflation_min,
        inflation_rate_change,
        blocks_per_year,
        annual_provisions,
        mint_denom
      } = this.data;
      return [
        {
          title: this.$t("message.parameter_GoalBonded"),
          value: goal_bonded || "--"
        },
        {
          title: this.$t("message.parameter_Inflation"),
          value: inflation || "--"
        },
        {
          title: this.$t("message.parameter_InflationMax"),
          value: inflation_max || "--"
        },
        {
          title: this.$t("message.parameter_InflationMin"),
          value: inflation_min || "--"
        },
        {
          title: this.$t("message.parameter_InflationChange"),
          value: inflation_rate_change || "--"
        },
        {
          title: this.$t("message.parameter_BlocksPerYear"),
          value: blocks_per_year || "--"
        },
        {
          title: this.$t("message.parameter_AnnualProvisions"),
          value: annual_provisions || "--"
        },
        {
          title: this.$t("message.parameter_MintDenom"),
          value: mint_denom || "--"
        }
      ];
    },
    min_deposit() {
      return this.data.min_deposit || "--";
    },
    max_deposit_period() {
      return this.data.max_deposit_period || "--";
    },
    voting_period() {
      return this.data.voting_period || "--";
    },
    quorum() {
      return this.data.quorum || "--";
    },
    threshold() {
      return this.data.threshold || "--";
    },
    veto() {
      return this.data.veto || "--";
    }
  }
};
</script>

<style scoped>
.area-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.parameter-item {
  margin-bottom: 15px;
}
.parameter-item-content {
  background: #fff;
  padding: 10px 20px;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  border: 1px solid #eee;
}

.parameter-item-content:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #343a40;
}
.parameter-item-title {
  font-size: 16px;
  font-weight: bold;
}
.parameter-item-value {
  color: #343a40;
  font-size: 18px;
  text-align: center;
  padding: 8px 0;
  font-weight: 500;
}
.parameter-item-subtitle {
  color: #98a6ad;
}
.parameter-item-subvalue {
  float: right;
  color: #333;
}
.parameter-item-subvalue2 {
  font-size: 14px;
  color: #98a6ad;
}
.parameter-item-subvalue2 span {
  float: right;
  color: #333;
}
</style>
