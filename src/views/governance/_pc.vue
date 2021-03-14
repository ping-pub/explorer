<template>
  <div>
    <div style="margin-bottom: 10px;" v-if="current.chainId === 'kava-2'">
      <el-radio-group class="box-base" size="mini" v-model="tab">
        <el-radio-button label="governance">{{$t('message.governance')}}</el-radio-button>
        <el-radio-button label="kava">{{$t('message.committee')}}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="tab === 'governance'" class="border-eee" v-loading="loading">
      <div class="bg-white governance-item" v-for="(item, index) of list" :key="index">
        <div class="flex-1">
          <div class="mb-10">
            <el-link
              :href="
              `#/governance/${item.id + (address ? '?address=' + address : '')}`
            "
              :disabled="item.id === '--'"
            >
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
          <div class="governance-text">{{ item.description_sub }}</div>
          <div class="governance-foot">
            <el-link v-if="item.id !== '--'" class="mr-10" :href="`#/governance/${item.id}`">
              {{ $t("message.block_detail") }}
              <i class="el-icon-arrow-right"></i>
            </el-link>
            <span v-if="item.proposal_status !== 'DepositPeriod'">
              <span class="governance-time">{{ item.voting_start_time }}</span>
              <span class="governance-time">{{ '~' + (item && item.voting_end_time || '') }}</span>
            </span>
            <span v-else class="governance-time">{{ item && item.submit_time || '' }}</span>
          </div>
        </div>

        <div v-if="item.proposal_status === 'VotingPeriod'">
          <!-- <FlipClock style="transform: scale(0.5);margin-right: -80px;"/> -->
        </div>

        <RateBar
          v-if="item.id !== '--' && (item.proposal_status !== 'VotingPeriod' && item.proposal_status !== 'DepositPeriod')"
          style="margin-right: 20px;"
          :id="index"
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

      <div v-if="list.length === 0" class="bg-white p-20">
        <dingyi-empty />
      </div>
    </div>

    <KavaGovernance v-show="current.chainId === 'kava-2' && tab === 'kava'" />
  </div>
</template>
<script>
import mixinData from "./minxinData";
import RateBar from "./RateBar";
import FlipClock from "../../components/FlipClock/FlipClock.vue";
import KavaGovernance from "../governance-kava/_pc";

export default {
  components: {
    KavaGovernance,
    FlipClock,
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
      tab: "governance",
      list
    };
  }
};
</script>

<style scoped>
.governance-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 20px 20px;
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
.governance-text {
  max-width: 900px;
  line-height: 22px;
  /* white-space: pre-wrap; */
  color: rgba(0, 0, 0, 0.65);
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
