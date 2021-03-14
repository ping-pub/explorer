
<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 5px;">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="flex-center flex-sb pagevalidators-item border-eee">
          <div class="pagevalidators-iconwrap flex-center flex-justifycenter validators-1">
            <i class="iconfont icon-block pagevalidators-icon validators-1-icon"></i>
          </div>
          <div class="pagevalidators-text">
            <div
              class="pagevalidators-number"
              element-loading-spinner="el-icon-loading"
            >{{ blockHeight }}</div>
            <div class="pagevalidators-subtitle">{{$t('message.validator_BlockHeight')}}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="flex-center flex-sb pagevalidators-item border-eee">
          <div class="pagevalidators-iconwrap flex-center flex-justifycenter validators-2">
            <i class="iconfont icon-validators pagevalidators-icon validators-2-icon"></i>
          </div>
          <div class="pagevalidators-text">
            <div
              class="pagevalidators-number"
              element-loading-spinner="el-icon-loading"
            >{{ validatorsLength }}</div>
            <div class="pagevalidators-subtitle">{{$t('message.validator_Validators')}}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="flex-center flex-sb pagevalidators-item border-eee">
          <div class="pagevalidators-iconwrap flex-center flex-justifycenter validators-3">
            <i class="iconfont icon-BondedTokens pagevalidators-icon validators-3-icon"></i>
          </div>
          <div class="pagevalidators-text">
            <div
              class="pagevalidators-number"
              element-loading-spinner="el-icon-loading"
            >{{ tokens.bonded_tokens  }}</div>
            <div class="pagevalidators-subtitle">{{ bondedRate.percent }} / {{tokenTotal_str}} {{$t('message.validator_Bonded')}}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="flex-center flex-sb pagevalidators-item border-eee">
          <div class="pagevalidators-iconwrap flex-center flex-justifycenter validators-4">
            <i class="iconfont icon-BlockTime pagevalidators-icon validators-4-icon"></i>
          </div>
          <div class="pagevalidators-text">
            <div
              class="pagevalidators-number"
              element-loading-spinner="el-icon-loading"
            >{{ earningRate.percent }}</div>
            <div class="pagevalidators-subtitle">{{$t('message.validator_EarningRate')}}</div>
          </div>
        </div>
      </el-col>
    </el-row>


    <div class="validators-table-wrap border-eee">
      <div class="flex-center mb-10">
        <span class="validators-table-title">{{$t('message.validator_Validators')}}</span>
        <div style="flex: 1;"></div>
        <div>
          <el-radio-group class="box-base" size="mini" v-model="type">
            <el-radio-button label="bonded">{{$t('message.validator_Active')}}</el-radio-button>
            <el-radio-button label="unbonded">{{$t('message.validator_Inactive')}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <dingyi-data-table
        v-show="type === 'bonded'"
        ref="dt"
        :tableRowClassName="tableRowClassName"
        :noLocalPaging="true"
        :toolbar="false"
        :defaultSort="{prop: 'voting_power', order: 'descending'}"
        :btns="{ noFresh: true, index: true }"
        :datas="validators"
        :columns="columns"
        :loading="loading"
      ></dingyi-data-table>

      <dingyi-data-table
        v-show="type === 'unbonded'"
        :noLocalPaging="true"
        :toolbar="false"
        :btns="{ noFresh: true, index: true }"
        :datas="validatorsUnbonded"
        :columns="columnsUnbonded"
        :loading="loading"
      ></dingyi-data-table>

      <div class="flex-center" style="margin-top: 20px;">
        <p style="margin-right: 20px;">{{$t('message.validator_Legend')}}</p>
        <div style="width: 20px;height: 20px;background: #f8dbdb;margin-right: 5px; "></div>
        <p style="margin-right: 20px;">
          33.3%
          <span>{{$t('message.validator_ofbondedtokens')}}</span>
        </p>

        <div style="width: 20px;height: 20px;background: #faeed9;margin-right: 5px; "></div>
        <p>66.7% {{$t('message.validator_ofbondedtokens')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import mixinData from "./mixinData";

// 列表配置混入
const mixinColumns = {
  data() {
    const columnFront = [
      {
        label: this.$t('message.validator_Validator'),
        width: window.innerWidth < 800 ? 160 : null,
        sortable: true,
        "sort-method": (a, b) => {},
        render: (h, context) => {
          const row = context.props.scope.row;
          const { moniker, operator_address } = row || {
            description: {}
          };
          return (
            <a
              href={`#/validator/${operator_address}`}
              class="flex-center"
              style="color: #333;font-size: 14px;"
            >
              <div class="validators-columns-name font-14">{moniker}</div>
            </a>
          );
        }
      }
    ];
    const columnBack = [
      {
        label: this.$t('message.validator_CommissionMax'),
        prop: "commission",
        width: window.innerWidth < 800 ? 180 : 180,
        align: "right",
        sortable: true,
        "sort-method": (a, b) => {
          const rate = row => {
            const { commission_rate } = row || { commission: {} };
            return commission_rate;
          };
          return Number(rate(a)) - Number(rate(b));
        },
        render: (h, context) => {
          const row = context.props.scope.row;
          const {
            commission_rate_percent,
            commission_rate_max_percent
          } = row || { commission: {} };
          return (
            <div class="font-14 text-right">
              {commission_rate_percent + "/" + commission_rate_max_percent}
            </div>
          );
        }
      },
      {
        label: this.$t('message.validator_Rewards'),
        prop: "commission",
        align: "right",
        sortable: true,
        width: window.innerWidth < 800 ? 120 : 120,
        "sort-method": (a, b) => {
          const rewardNew = row => {
            const { rewards } = row || { commission: {} };
            return rewards;
          };
          return rewardNew(a) - rewardNew(b);
        },
        render: (h, context) => {
          const row = context.props.scope.row;
          const { rewards } = row;
          return <div class="font-14 text-right">{rewards || "--"}</div>;
        }
      }
    ];
    const columnsBonded = [
      {
        label: this.$t('message.validator_BondedTokens'),
        prop: "tokens",
        align: "right",
        width: window.innerWidth < 800 ? 180 : 180,
        sortable: true,
        "sort-method": (a, b) => {
          return Number(a.tokens) - Number(b.tokens);
        },
        render: (h, context) => {
          const row = context.props.scope.row;
          let { voting_power } = row || { tokens: "" };
          return <div class="font-14 text-right">{voting_power || "--"}</div>;
        }
      },
      {
        label: this.$t('message.validator_DailyChanges'),
        prop: "difference",
        width: window.innerWidth < 800 ? 150 : 150,
        align: "right",
        sortable: true,
        "sort-method": (a, b) => {
          return a.dailyChange - b.dailyChange;
        },
        render: (h, context) => {
          const row = context.props.scope.row;
          const { dailyChange } = row || {
            dailyChange: "--"
          };
          return (
            <div
              class="font-14 text-right"
              style={{ color: dailyChange > 0 ? "#1abc9c" : "#e66" }}
            >
              {dailyChange > 0
                ? "+" + dailyChange
                : dailyChange < 0
                ? dailyChange
                : "--"}
            </div>
          );
        }
      }
    ];
    const columnsUnbonded = [
      {
        label: this.$t('message.validator_BondedTokens'),
        prop: "tokens",
        width: window.innerWidth < 800 ? 160 : 160,
        align: "right",
        sortable: true,
        "sort-method": (a, b) => {
          return Number(a.tokens) - Number(b.tokens);
        },
        render: (h, context) => {
          const row = context.props.scope.row;
          const { voting_power_str } = row
          return <div class="font-14 text-right">{voting_power_str || "--"}</div>;
        }
      },
      {
        label:  this.$t('message.validator_UnbondingHeight'),
        prop: "unbonding_height",
        align: "right",
        width: window.innerWidth < 800 ? 180 : 180
      },
      {
        label: this.$t('message.validator_UnbondingTime'),
        prop: "unbonding_time",
        width: window.innerWidth < 800 ? 180 : 180,
        render: (h, context) => {
          const row = context.props.scope.row;
          const { unbonding_time } = row || {};
          return <div>{unbonding_time}</div>;
        }
      }
    ];
    return {
      columns: [...columnFront, ...columnsBonded, ...columnBack],
      columnsUnbonded: [
        ...columnFront,
        ...columnsUnbonded
      ]
    };
  }
};

export default {
  mixins: [mixinColumns, mixinData],
  data() {
    return {
      blockHeight: "--",
      loading: false,
      type: "bonded",
      tokenObj: {}
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (this.type !== "unbonded") {
        let tokens = Number(row.tokens);
        let tokenPrev = this.tokenObj[rowIndex - 1];
        if (rowIndex > 0) {
          tokens += tokenPrev;
        }
        this.tokenObj[rowIndex] = tokens;
        const percent = tokens / this.tokens.bonded_tokens_val;
        const percentPrev = tokenPrev / this.tokens.bonded_tokens_val;
        if (percent <= 0.33 || (percentPrev <= 0.33 && percent > 0.33)) {
          return "less33";
        }
        if (
          (percent <= 0.67 && percent > 0.33) ||
          (percentPrev <= 0.67 && percentPrev > 0.33 && percent > 0.67)
        ) {
          return "less68";
        }
      }
      return "";
    }
  }
};
</script>

<style>
.less33 {
  background: #f8dbdb !important;
  border-top-color: #fff !important;
  border-bottom-color: #fff !important;
}
.less33 td {
  border-bottom-color: #fff !important;
}

.less68 {
  background: #faeed9 !important;
  border-top-color: #fff !important;
  border-bottom-color: #fff !important;
}
.less68 td {
  border-bottom-color: #fff !important;
}
</style>

<style scoped>
.validators-table-wrap {
  padding: 15px;
  background: #fff;
}
.validators-table-title {
  font-size: 16px;
  font-weight: bold;
}
.validators-1 {
  border: 1px solid #6658dd;
  background: #d8d5f7;
}
.validators-1-icon {
  color: #6658dd;
  font-size: 40px;
}
.validators-2 {
  border: 1px solid #1abc9c;
  background: #c5eee6;
}
.validators-2-icon {
  color: #1abc9c;
  font-size: 18px;
}
.validators-3 {
  border: 1px solid #4fc6e1;
  background: #d3f1f8;
}
.validators-3-icon {
  color: #4fc6e1;
  font-size: 18px;
}
.validators-4 {
  border: 1px solid #f7b84b;
  background: #fdedd2;
}
.validators-4-icon {
  color: #f7b84b;
  font-size: 16px;
}
.validators-columns-name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
}
.pagevalidators-item {
  background: #fff;
  padding: 10px 20px;
  margin-bottom: 5px;
}
.pagevalidators-text {
  text-align: right;
}
.pagevalidators-number {
  color: #323a46;
  font-weight: 500;
  margin: 10px 0;
  font-family: -apple-system, "Cerebri Sans", "sans-serif";
  font-size: 24px;
}
.pagevalidators-subtitle {
  color: #98a6ad;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pagevalidators-iconwrap {
  width: 70px;
  height: 70px;
  border-radius: 100%;
}
</style>
