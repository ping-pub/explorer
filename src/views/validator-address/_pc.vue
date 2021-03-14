<template>
  <div>
    <div class="bg-white box-dark governance-title-panel" v-loading="loading">
      <div class="flex-center mb-10" style="align-items:flex-start;">
        <el-avatar
          v-if="item.avatar"
          :src="item.avatar"
          shape="square"
          :size="60"
          style="margin-right: 20px;"
        ></el-avatar>
        <div class="governance-id-title">
          <div>{{ item.moniker }}</div>
          <div>
            <el-tag
              v-if="item.identity"
              type="info"
              size="mini"
              style="align-self:flex-end;margin-right: 10px;"
            >{{ item.identity}}</el-tag>
            <el-tag
              v-if="item.website"
              type="info"
              size="mini"
              style="align-self:flex-end;"
            >{{ item.website}}</el-tag>
          </div>
        </div>

        <div class="governance-id-sub" style="">
          <div class="governance-id-subvalue" style="color: #ffa607">{{ earningRate.rewards }}</div>
          <div class="governance-id-subtitle">{{ $t('message.validatoraddress_EarningRate') }}</div>
        </div>
        <div class="flex-1"></div>
      </div>

      <div class="mb-20" style="color: #999;">{{ item.details }}</div>

    <el-divider></el-divider>
      <el-row>
        <el-col :sm="10" :xs="24" class="mb-20">
          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_VotingPower') }}:</span>
            <span class="governance-id-val" style="font-size: 16px;">
              {{ item.voting_power }}
              <span style="font-size:14px;">({{voting_power_percent}})</span>
            </span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_SelfDelegation') }}:</span>
            <span class="governance-id-val" style="font-size: 16px;">
              {{ selfShare.shares_str }}
              <span
                style="font-size:14px;"
              >({{ selfShare.shares_percent || '--' }})</span>
            </span>
          </div>
          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_Uptime') }}:</span>
            <span class="governance-id-val" style="font-size: 16px;">
              {{ uptime.percent }}
              <span style="font-size:14px;">({{ uptime.missed_blocks_counter }})</span>
            </span>
          </div>
          <div class="mb-10">{{ $t('message.validatoraddress_Commission') }}:</div>
          <div class="flex-center" style="justify-content: flex-start;align-items: flex-start;">
            <div class="governance-id-sub" style="text-align: left;padding-left: 0;">
              <div class="governance-id-subtitle">{{ $t('message.validatoraddress_Rate') }}</div>
              <div class="governance-id-subvalue">{{ item.commission_rate_percent }}</div>
            </div>
            <div class="governance-id-sub" style="text-align: left;padding-left: 30px;">
              <div class="governance-id-subtitle">{{ $t('message.validatoraddress_Max') }}</div>
              <div class="governance-id-subvalue">{{ item.commission_rate_max_percent }}</div>
            </div>
            <div class="governance-id-sub" style="text-align: left;padding-left: 30px;">
              <div class="governance-id-subtitle">{{ $t('message.validatoraddress_Change') }}</div>
              <div class="governance-id-subvalue">{{ item.commission_rate_max_change_percent }}</div>
            </div>
          </div>
        </el-col>

        <el-col :sm="14" :xs="24" class="mb-20 address-area">
          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_Address') }}:</span>
            <span class="governance-id-val">{{ item.userAddress }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_ValidatorAddress') }}:</span>
            <span class="governance-id-val">{{ item.operator_address }}</span>
          </div>
          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_Publickey') }}:</span>
            <span class="governance-id-val">{{ item.consensus_pubkey }}</span>
          </div>

          <div class="mb-10">
            <span class="governance-id-name">{{ $t('message.validatoraddress_HEXAddress') }}:</span>
            <span class="governance-id-val">{{ item.hexAddress }}</span>
          </div>
        </el-col>
      </el-row>

      <div class="flex-center">
        <div
          class="governance-tab"
          @click="
            () => {
              this.tab = 'Votes';
            }
          "
          :class="{ 'governance-tab-active': tab === 'Votes' }"
        >
          <el-button style="font-size: 14px;" type="text">{{ $t('message.validatoraddress_Info') }}</el-button>
        </div>
        <div class="flex-1"></div>

      </div>
    </div>

    <div v-show="tab === 'Votes'">
      <el-row :gutter="20">
        <el-col :md="24" :sm="24">
          <div class="bg-white box-dark mt-20">
            <div
              style="padding: 10px 15px;border-bottom: 1px solid #eee;"
            >{{ $t('message.validatoraddress_Delegations') }}</div>
            <div style="padding: 0 10px;">
              <el-table :data="delegationList" style="width: 100%;">
                <el-table-column
                  prop="delegator_address"
                  :label="$t('message.validatoraddress_Delegator')"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="!addressObj[scope.row.delegator_address]"
                    >{{ scope.row.delegator_address }}</span>
                    <a
                      v-else
                      :href="'#/validator/' + addressObj[scope.row.delegator_address].operator_address"
                    >{{ addressObj[scope.row.delegator_address].moniker }}</a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="shares_str"
                  :label="$t('message.validatoraddress_Amount')"
                  width="200px"
                ></el-table-column>
                <el-table-column
                  prop="shares_percent"
                  :label="$t('message.validatoraddress_Share')"
                  width="100px"
                ></el-table-column>

                <dingyi-empty slot="empty" :loading="loadingDelegations"></dingyi-empty>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import mixinData from "./mixinData";
import RateBar from "../governance/RateBar";

export default {
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
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
}
.governance-tab {
  width: 100px;
  text-align: center;
  align-self: flex-end;
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
  width: 100px;
  display: inline-block;
  line-height: 1.5715;
  white-space: nowrap;
  margin-right: 10px;
}
.address-area .governance-id-name {
  display: block;
}
.governance-id-val {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5715;
}
</style>
