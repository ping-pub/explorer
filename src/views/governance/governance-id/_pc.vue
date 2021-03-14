<template>
  <div>
    <div class="bg-white box-dark governance-title-panel" v-loading="loading">
      <div class="flex-center mb-20">
        <div class="governance-id-title">{{ item.title }}</div>
        <div class="flex-1"></div>
        <el-button
          v-if="address"
          @click="
            () => {
              this.$router.push(`/wallet-vote?address=${address}`);
            }
          "
          type="primary"
          style="width: 80px;"
          round
          class="box-base"
        >{{ $t("message.governanceid_vote") }}</el-button>
      </div>

      <el-row>
        <el-col :span="9" :sm="9" :xs="24" class="mb-20">
          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_proposalId") }}:</span>
            <span class="governance-id-val">{{ item.id }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_submit_time") }}:</span>
            <span class="governance-id-val">{{ item.submit_time }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_voting_start_time") }}:</span>
            <span class="governance-id-val">{{ item.voting_start_time }}</span>
          </div>
        </el-col>

        <el-col :span="9" :sm="9" :xs="24" class="mb-20">
          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_proposalType") }}:</span>
            <span class="governance-id-val">{{ item.type }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_deposit_end_time") }}:</span>
            <span class="governance-id-val">{{ item.deposit_end_time }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t("message.governanceid_voting_end_time") }}:</span>
            <span class="governance-id-val">{{ item.voting_end_time }}</span>
          </div>
        </el-col>
        <el-col :span="6" :sm="6" :xs="24" class="mb-20 hidden-xs-only">
          <div class="flex-center" style="justify-content: flex-end;align-items: flex-start;">
            <div class="governance-id-sub">
              <div class="governance-id-subtitle">{{ $t("message.governanceid_total_deposit") }}</div>
              <div class="governance-id-subvalue">{{ total_deposit }}</div>
            </div>
            <div class="governance-id-sub">
              <div class="governance-id-subtitle">{{ $t("message.governanceid_status") }}</div>
              <div class="governance-id-subvalue">{{ item.proposal_status }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" :sm="6" :xs="24" class="mb-20 hidden-sm-and-up">
          <div class="flex-center" style="justify-content: flex-start;align-items: flex-start;flex-wrap: wrap;">
            <div
              class="governance-id-sub"
              style="text-align: left;padding-right: 40px;padding-left: 0;"
            >
              <div class="governance-id-subtitle">{{ $t("message.governanceid_total_deposit") }}</div>
              <div class="governance-id-subvalue">{{ total_deposit }}</div>
            </div>
            <div class="governance-id-sub" style="text-align: left;padding-left: 0px;">
              <div class="governance-id-subtitle">{{ $t("message.governanceid_status") }}</div>
              <div class="governance-id-subvalue">{{ item.proposal_status }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="flex-center" style="flex-wrap: wrap;">
        <div
          class="governance-tab"
          @click="
            () => {
              this.tab = 'Votes';
            }
          "
          :class="{ 'governance-tab-active': tab === 'Votes' }"
        >
          <el-button style="font-size: 14px;" type="text">
            {{
            $t("message.governanceid_votes")
            }}
          </el-button>
        </div>
        <div
          class="governance-tab"
          @click="
            () => {
              this.tab = 'Description';
            }
          "
          :class="{ 'governance-tab-active': tab === 'Description' }"
        >
          <el-button style="font-size: 14px;" type="text">
            {{
            $t("message.governanceid_description")
            }}
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-show="tab === 'Description'"
      class="bg-white box-dark p-20 mt-20"
      style="white-space: pre-wrap;color: #333;"
    >{{ item.description }}</div>

    <div v-show="tab === 'Votes'">
      <el-row :gutter="20">
        <el-col :md="12" :sm="24">
          <div class="bg-white box-dark mt-20">
            <div
              style="padding: 10px 15px;border-bottom: 1px solid #eee;"
            >{{ $t("message.governanceid_tallyingProcedure") }}</div>
            <div style="display:flex;justify-content:center;" class="tc" v-loading="loading">
              <RateBar
                style="height: 260px;margin-bottom: 20px;"
                v-if="item.id !== '--'"
                :id="item.id"
                :baseHeight="200"
                lineWidth="40px"
                :barWidth="barWidth"
                :data="[
                  {
                    type: 'Yes',
                    value: item.yes,
                    bg: '#8be4c1',
                    label: item.yes_percent,
                    line: 0.5
                  },
                  {
                    type: 'Abstain',
                    value: item.abstain,
                    label: item.abstain_percent,
                    bg: '#8cb0fb'
                  },
                  {
                    type: 'No',
                    value: item.no,
                    label: item.no_percent,
                    bg: '#eb7f65',
                    line: 0.334
                  },
                  {
                    type: 'No Veto',
                    value: item.no_with_veto,
                    label: item.no_with_veto_percent,
                    bg: '#7585a2'
                  },
                  {
                    type: 'Join',
                    value: item.join,
                    label: item.join_percent,
                    bg: '#91d5ff'
                  }
                ]"
              />
            </div>
          </div>
        </el-col>

        <el-col :md="12" :sm="24">
          <div class="bg-white box-dark mt-20">
            <div
              style="padding: 10px 15px;border-bottom: 1px solid #eee;"
            >{{ $t("message.governanceid_DEPOSITS") }}</div>
            <div style="padding:0 10px;">
              <el-table
                :data="depositList"
                height="280"
                style="width: 100%;"
                v-loading="loadingDeposits"
              >
                <el-table-column prop="depositor" :label="$t('message.governanceid_Depositor')"></el-table-column>
                <el-table-column
                  prop="amountCoin_str"
                  :label="$t('message.governanceid_Amount')"
                  width="140px"
                ></el-table-column>

                <dingyi-empty slot="empty" :loading="loadingDeposits"></dingyi-empty>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="bg-white box-dark mt-20">
        <div
          style="padding: 10px 20px;border-bottom: 1px solid #eee;"
        >{{ $t("message.governanceid_votes") }}</div>
        <div style="padding: 0 10px;">
          <el-table :data="voteList" style="width: 100%;min-height: 200px;">
            <el-table-column prop="voter" :label="$t('message.governanceid_Voter')">
              <template slot-scope="scope">
                <span v-if="!addressObj[scope.row.voter]">
                  {{
                  scope.row.voter
                  }}
                </span>
                <a
                  v-else
                  :href="
                    '#/validator/' +
                      addressObj[scope.row.voter].operator_address
                  "
                >{{ addressObj[scope.row.voter].moniker }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="option" :label="$t('message.governanceid_Option')"></el-table-column>

            <dingyi-empty slot="empty" :loading="loadingVotes"></dingyi-empty>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinData from "./mixinData";
import RateBar from "../governance/RateBar";

export default {
  props: {
    barWidth: {
      default: '90px'
    }
  },
  components: {
    RateBar
  },
  mixins: [mixinData],
  data() {
    return {
      tab: "Votes"
    };
  }
};
</script>

<style scoped>
.governance-title-panel {
  padding: 20px 20px 0 20px;
}
.governance-id-title {
  padding-right: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
}
.governance-tab {
  width: 100px;
  text-align: center;
}
.governance-tab-active {
  border-bottom: 2px solid #232323;
}
.governance-id-sub {
  padding-left: 40px;
  text-align: right;
}
.governance-id-subtitle {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.governance-id-subvalue {
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}
.governance-id-name {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5715;
  white-space: nowrap;
  margin-right: 10px;
}
.governance-id-val {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5715;
}
</style>
