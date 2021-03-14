<template>
  <div>
    <div style="margin-bottom: 10px;text-align:center;margin-top: 10px;" v-if="current.chainId === 'kava-2'">
      <el-radio-group size="mini" v-model="tab">
        <el-radio-button label="governance">{{$t('message.governance')}}</el-radio-button>
        <el-radio-button label="kava">{{$t('message.committee')}}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="tab === 'governance'">
      <div class="bg-white governance-item mb-10" v-for="(item, index) of list" :key="index">
        <div class="flex-1">
          <div class="mb-10">
            <el-link :href="`#/governance/${item.id}`" :disabled="item.id === '--'">
              <i v-if="item.id !== '--'" class="el-icon-reading mr-10"></i>
              {{ item.title }}
            </el-link>
          </div>
          <div class="mb-10">
            <el-tag class="mr-10" type="info" size="mini">
              {{
              `id: ${item.id}`
              }}
            </el-tag>
            <el-tag class="mr-10" type="info" size="mini">
              {{
              item.proposal_status
              }}
            </el-tag>
          </div>
          <div style="background: #f5f5f5;padding: 10px 0;" v-if="item.id !== '--' && (item.proposal_status !== 'VotingPeriod' && item.proposal_status !== 'DepositPeriod')">
            <RateBar
              
              :baseHeight="40"
              barWidth="70px"
              :id="index"
              :data="[
          { type: 'Yes', value: item.yes, bg: '#52c41a', label: item.yes_percent },
          { type: 'Abstain', value: item.abstain, label: item.abstain_percent, bg: '#faad14' },
          { type: 'No', value: item.no, label: item.no_percent, bg: '#e66' },
          { type: 'No Veto', value: item.no_with_veto, label: item.no_with_veto_percent,bg: '#ddd' },
          {
            type: 'Join',
            value: item.join,
            label: item.join_percent,
            bg: '#91d5ff'
          }
        ]"
            />
          </div>
          <div class="governance-foot">
            <el-link v-if="item.id !== '--'" class="mr-10" :href="`#/governance/${item.id}`">
              {{ $t("message.block_detail") }}
              <i class="el-icon-arrow-right"></i>
            </el-link>
            <span class="governance-time">{{ item.submit_time }}</span>
          </div>
        </div>
      </div>
    </div>
    <KavaGovernance v-show="current.chainId === 'kava-2' && tab === 'kava'" />
  </div>
</template>
<script>
import mixinData from "./minxinData";
import RateBar from "./RateBar";
import KavaGovernance from "../governance-kava/_h5";

export default {
  components: {
    KavaGovernance,
    RateBar
  },
  computed: {
    current() {
      return window.chain;
    }
  },
  mixins: [mixinData],
  data() {
    const list = [];
    for (let i = 0; i < 5; i += 1) {
      list.push({
        id: "--",
        title: "--",
        description_sub: "--",
        proposal_status: "--",
        time: "---"
      });
    }
    return {
      list,
      tab: "governance"
    };
  }
};
</script>

<style scoped>
.governance-item {
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  padding: 15px;
}
.governance-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.governance-title {
  cursor: pointer;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 24px;
}
.governance-title:hover {
  color: #1890ff;
}
.governance-foot {
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.45);
}
.governance-time {
  color: rgba(0, 0, 0, 0.25);
  font-style: normal;
}
</style>
