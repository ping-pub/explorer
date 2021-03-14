<!--
 * @Description: /cdp/accounts
 * @Autor: dingyi
 * @Date: 2020-06-29 23:00:19
 * @LastEditors: Please set LastEditors
 * @lastTime: 2020-09-01 20:04:48
 * @FilePath: \look-web\src\views\kava\CDP.vue
--> 

<template>
  <div>
    <div style="display:flex;align-items:center;">
      <div class="list-title" style="margin-right: 10px;">CDP</div>
      <el-popover placement="top-start" trigger="hover" width="300">
        <div>
          <img style="width: 100%;" src="/static/cdp/risk.png" alt />
        </div>
        <i style="color: #aaa;margin-right: 10px;" class="el-icon-info" slot="reference"></i>
      </el-popover>
      <div
        class="pointer"
        style="color: #aaa"
        @click="() => { this.showStatus = !this.showStatus }"
      >{{ showStatus ? 'hide' : 'show'}}</div>
      <div class="flex-1"></div>
      <el-radio-group size="mini" v-model="tab" @change="switchTab">
        <el-radio-button
          v-for="(item, index) of collateral_params"
          :key="index"
          :label="item.denom"
        >{{ item.denom }}</el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <ParamItem v-show="showStatus" :title="''" :nums="4" :content="cdp" />

      <template v-if="show">
        <dingyi-empty v-if="dataPage.length === 0" v-loading="loading" />
        <div style="margin-top: 10px;" v-for="(item, index) of dataPage" :key="index">
          <van-cell-group>
            <van-cell bottom :title="item.owner">
              <el-popover trigger="click" placement="bottom-end" width="300">
                <div>
                  <img style="width: 100%;" src="/static/cdp/risk.png" alt />
                </div>
                <div
                  slot="reference"
                  style="font-size: 16px;"
                  :class="[item.riskType]"
                >{{ item.riskStr }}</div>
              </el-popover>
            </van-cell>
            <div style="padding: 0 15px 10px 15px;">
              <div class="cell-item">
                <div>Collateral Deposited</div>
                <div style="text-align:right">
                  <div>{{ item.collateral }}</div>
                  <div style="font-size: 10px;">{{ item.collateral2 }}</div>
                </div>
              </div>
              <div class="cell-item">
                <div>Principal Drawn</div>
                <div>{{ item.principal }}</div>
              </div>
              <div class="cell-item" style="margin-top: 5px;">
                <div>Ratio</div>
                <div>{{ item.ratio }}</div>
              </div>
              <div class="cell-item" style="margin-top: 5px;">
                <div>Accumulated Fees</div>
                <div>{{ item.accumulated_fees }}</div>
              </div>
              <div class="cell-item" style="margin-top: 5px;">
                <div>Fees Updated</div>
                <div>{{ item.time }}</div>
              </div>
            </div>
          </van-cell-group>
        </div>
      </template>

      <dingyi-data-table
        v-else
        ref="dt"
        :noLocalPaging="true"
        :toolbar="false"
        :btns="{ noFresh: true, index: true }"
        :datas="dataPage"
        :columns="columns"
        :loading="loading"
      ></dingyi-data-table>

      <div style="text-align:center;margin-top: 20px;">
        <el-pagination
          @current-change="pageChange"
          background
          layout="prev, pager, next"
          :total="datas.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatTime,
  formatUatom,
  formatPoint,
  timeToDay
} from "../../utils/format";
import { percent } from "../../utils/num";
import ParamItem from "../parameter/ParamItem";
export default {
  props: {
    show: {
      default: false
    }
  },
  components: {
    ParamItem
  },
  computed: {
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
        auction_size,
        conversion_factor,
        liquidation_market_id,
        liquidation_penalty,
        liquidation_ratio,
        prefix,
        spot_market_id,
        stability_fee,
        debt_limit
      } = this.data;
      return [
        // √
        {
          title: `liquidation ratio`,
          value:
            (liquidation_ratio && Number(liquidation_ratio).toFixed(2)) || "--"
        },
        // √
        {
          title: `liquidation penalty`,
          value:
            (liquidation_penalty && Number(liquidation_penalty).toFixed(4)) ||
            "--"
        }, // √
        {
          title: `debt param`,
          value: (debt_param && debt_param.denom) || "--"
        },
        // √
        {
          title: `reference asset`,
          value: (debt_param && debt_param.reference_asset) || "--"
        },
        // √
        {
          title: `circuit breaker`,
          value: circuit_breaker || false
        }
      ];
    }
  },
  data() {
    return {
      showStatus: !this.show,
      tab: "",
      tabObj: {},
      data: {},
      collateral_params: [],
      collateral_paramsObj: {},
      datas: [],
      dataPage: [],
      dataPageNum: 1,
      columns: [
        {
          label: "Owner",
          width: 130,
          render: (h, context) => {
            const row = context.props.scope.row;
            const { owner } = row || {};
            return <div class="validators-columns-name font-14">{owner}</div>;
          }
        },
        {
          label: "Collateral Deposited",
          render: (h, context) => {
            const row = context.props.scope.row;
            const { collateral, collateral2 } = row || {};
            return (
              <div>
                <div class="validators-columns-name font-14">{collateral}</div>
                <div class="validators-columns-name font-14">{collateral2}</div>
              </div>
            );
          }
        },
        // Principal Drawn
        {
          label: "Principal Drawn",
          render: (h, context) => {
            const row = context.props.scope.row;
            const { principal } = row || {};
            return (
              <div class="validators-columns-name font-14">{principal}</div>
            );
          }
        },
        {
          label: "Accumulated Fees",
          render: (h, context) => {
            const row = context.props.scope.row;
            const { accumulated_fees, time } = row || {};
            return (
              <div>
                <div class="validators-columns-name font-14">
                  {accumulated_fees}
                </div>
                <div class="validators-columns-name font-14">{time}</div>
              </div>
            );
          }
        },
        {
          label: "Ratio",
          width: 80,
          sortable: true,
          "sort-method": (a, b) => {
            const riskA = a.ratio
            const riskB = b.ratio
            return Number(riskA) - Number(riskB)
          },
          render: (h, context) => {
            const row = context.props.scope.row;
            const { ratio } = row || {};
            return <div class="validators-columns-name font-14">{ratio}</div>;
          }
        },
        {
          label: "Risk Score",
          width: 120,
          cdprisk: true,
          sortable: true,
          "sort-method": (a, b) => {
            const riskA = a.risk
            const riskB = b.risk
            return Number(riskA) - Number(riskB)
          },
          render: (h, context) => {
            const row = context.props.scope.row;
            const { risk } = row || {};
            return (
              <el-popover trigger="click" placement="top-start" width="300">
                <div>
                  <img style="width: 100%;" src="/static/cdp/risk.png" alt />
                </div>
                <div slot="reference" class="validators-columns-name font-14">
                  <el-tag
                    size="mini"
                    class="pointer"
                    style="font-size: 16px"
                    type={
                      Number(risk) < 50
                        ? "success"
                        : Number(risk) > 80
                        ? "danger"
                        : "warning"
                    }
                  >
                    {risk}
                  </el-tag>
                </div>
              </el-popover>
            );
          }
        }
      ],
      loading: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    pageChange(current) {
      this.dataPageNum = current || 1;
      this.dataPage = this.datas.slice(
        (this.dataPageNum - 1) * 10,
        this.dataPageNum * 10
      );
    },
    async getCdpDenom(den) {
      const res = await this.$axios.get(`/cdp/cdps/denom/${den}`, {
        headers: { server: window.chain.lcd }
      });
      this.formatDatas(res.result);
      this.pageChange();
      this.loading = false;
    },
    formatDatas(datas) {
      for (const item of datas) {
        const cdp = item.cdp;
        const cdpOwner = cdp.owner;
        const cdpCollateral = cdp.collateral;
        item.owner =
          cdpOwner && cdpOwner.substr(0, 4) + "..." + cdpOwner.substr(-8);
        item.collateral =
          cdpCollateral &&
          formatUatom(
            cdpCollateral.amount,
            false,
            true,
            cdpCollateral.denom,
            8
          );
        const collateral_value = item.collateral_value;
        item.collateral2 =
          collateral_value &&
          formatUatom(
            collateral_value.amount,
            false,
            true,
            collateral_value.denom
          );
        item.principal =
          cdp &&
          cdp.principal &&
          formatUatom(cdp.principal.amount, false, false, cdp.principal.denom);
        item.accumulated_fees =
          cdp &&
          cdp.accumulated_fees &&
          formatUatom(
            cdp.accumulated_fees.amount,
            false,
            false,
            cdp.accumulated_fees.denom
          );
        item.time = cdp && cdp.fees_updated && formatTime(cdp.fees_updated);
        item.ratio = Number(item.collateralization_ratio).toFixed(4);
        const current_price = collateral_value.amount;
        const liqui_price = cdp.principal.amount;
        item.risk = formatPoint(
          (1 - (current_price - liqui_price) / current_price) * 100
        );
        item.riskType =
          Number(item.risk) < 50
            ? "type-success"
            : Number(item.risk) > 80
            ? "type-danger"
            : "type-warning";
        item.riskStr =
          (Number(item.risk) < 50
            ? "Low Risk "
            : Number(item.risk) > 80
            ? "High Risk "
            : "Middle Risk ") + item.risk;
      }
      this.datas = datas;
    },
    async switchTab() {
      this.tabObj = this.collateral_paramsObj[this.tab];
      await this.getCdpDenom(this.tab);
      this.data = {
        ...this.data,
        ...this.tabObj
      };
    },
    async init() {
      this.loading = true;
      const res = await this.$axios.get(`/cdp/parameters`, {
        headers: { server: window.chain.lcd }
      });
      const result = res.result;
      result.debt_auction_lot = timeToDay(result.debt_auction_lot);
      result.surplus_auction_lot = timeToDay(result.surplus_auction_lot);
      result.debt_auction_threshold = timeToDay(result.debt_auction_threshold);
      result.surplus_auction_threshold = timeToDay(
        result.surplus_auction_threshold
      );
      result.savings_distribution_frequency = timeToDay(
        result.savings_distribution_frequency
      );
      result.debt_param.savings_rate = percent(result.debt_param.savings_rate);
      this.data = result;

      this.collateral_params = res.result.collateral_params;
      const obj = {};
      for (const item of this.collateral_params) {
        obj[item.denom] = item;
      }
      this.collateral_paramsObj = obj;
      this.tab = this.collateral_params[0].denom;
      this.switchTab();
    }
  }
};
</script>

<style scoped>
.list-title {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 10px;
}
.info-table {
  table-layout: auto;
  width: 100%;
  border-collapse: collapse;
}
.info-item {
  text-align: center;
}
.cell-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999;
  margin-top: 2px;
}
.type-warning {
  color: #faad14;
}
.type-danger {
  color: #ff4d4f;
}
.type-success {
  color: #52c41a;
}
</style>