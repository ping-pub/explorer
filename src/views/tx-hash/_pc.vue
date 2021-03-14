<script>
import { formatPointPecent, formatTime } from "../../utils/format";

export default {
  mixins: [],
  data() {
    return {
      tx: {},
      loading: false,
      hash: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.hash = this.$route.params.hash;
      this.loading = true;
      const res = await this.$api.fetch("getTxsHash", { hash: this.hash });
      if (!res) {
        this.loading = false;
        return;
      }
      // status 获取
      res.success = !!(res.logs);
      if (!res.success && res.logs) {
        res.log = res.logs[0] && res.logs[0].log && JSON.parse(res.logs[0].log) || res.raw_log;
      }
      if (this.chainId === "irishub") {
        res.success = res.result.Code === 0 ? true : false;
        res.log = res.success ? "" : res.result.Log;
        res.gas_used = res.result.GasUsed;
        res.gas_wanted = res.result.GasWanted;
      }
      // fee
      res.fee =
        (res.tx.value.fee.amount &&
          ((res.tx.value.fee.amount.amount &&
            res.tx.value.fee.amount.amount +
              " " +
              res.tx.value.fee.amount.denom) ||
            (res.tx.value.fee.amount[0] &&
              res.tx.value.fee.amount[0].amount +
                " " +
                res.tx.value.fee.amount[0].denom))) ||
        "0";
      res.time = formatTime(res.timestamp);
      const msgs = res.tx.value.msg;
      const msgArr = [];
      for (const item of msgs) {
        const value = item.value;
        const obj = {};
        for (const key in value) {
          const keySplit = key.split("_");
          let keyFormat = "";
          for (const el of keySplit) {
            const str = el.replace(el[0], el[0].toUpperCase());
            keyFormat += keyFormat ? " " + str : str;
          }
          let val = "";
          if (
            (key === "amount" || key === "value") &&
            value[key] &&
            value[key].amount
          ) {
            val = value[key].amount + " " + value[key].denom;
          } else if (key === "amount" && value[key] && !value[key].amount) {
            val = value[key][0].amount + " " + value[key][0].denom;
          } else if (key === "description") {
            const description = value[key];
            val = description.details || "--";
            obj[this.$t('message.txhash_moniker')] = description.moniker;
            obj[this.$t('message.txhash_identity')] = description.identity;
            obj[this.$t('message.txhash_website')] = description.website;
          } else if (key === "commission") {
            const commission = value[key];
            val = null;
            obj[this.$t('message.txhash_CommissionRate')] = formatPointPecent(commission.rate);
            obj[this.$t('message.txhash_CommissionMaxRate')] = formatPointPecent(commission.max_rate);
            obj[this.$t('message.txhash_CommissionMaxChangeRate')] = formatPointPecent(
              commission.max_change_rate
            );
          } else if (key === "delegation") {
            val = value[key].amount + " " + value[key].denom;
          } else {
            val = value[key];
          }
          if (val) {
            obj[keyFormat] = val;
          }
        }
        msgArr.push({
          type: item.type,
          value: obj
        });
      }
      res.msgs = msgArr;
      this.tx = res;
      this.loading = false;
    }
  }
};
</script>

<template>
  <div>
    <div class="area-title area-title-main">{{ $t('message.txhash_Information')}}</div>
    <div class="bg-white" style="padding: 20px;" v-loading="loading">
      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_TxHash')}}</div>
        <div class="tx-item-val">{{ hash }}</div>
      </div>

      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_Status')}}</div>
        <div class="tx-item-val">
          <el-tag :type="tx.success ? 'success' : 'danger'">{{ tx.success ? 'Success' : 'Fail' }}</el-tag>
          <span v-if="!tx.success" style="margin-left: 10px;">{{ tx.log && tx.log.message || tx.log }}</span>
        </div>
      </div>

      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_Height')}}</div>
        <div class="tx-item-val">{{ tx.height }}</div>
      </div>
      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_Fee')}}</div>
        <div class="tx-item-val">{{ tx.fee }}</div>
      </div>

      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_Gas')}}</div>
        <div class="tx-item-val">{{tx.gas_used}} / {{tx.gas_wanted}}</div>
      </div>

      <div class="tx-item">
        <div class="tx-item-title">{{ $t('message.txhash_Time')}}</div>
        <div class="tx-item-val">{{ tx.time }}</div>
      </div>
    </div>

    <div class="area-title area-title-main">{{ $t('message.txhash_Msgs')}}</div>

    <dingyi-empty v-if="!tx.msgs || (tx.msgs && tx.msgs.length === 0)" :loading="loading" />

    <div
      v-loading="loading"
      v-for="(item, index) of tx.msgs"
      :key="index"
      class="bg-white"
      style="padding: 20px;margin-top: 20px;padding-bottom: 10px;"
    >
      <div class="area-title">{{item.type}}</div>

      <div class="tx-item" v-for="(el, key) of item.value" :key="key">
        <div class="tx-item-title">{{ key }}</div>
        <div class="tx-item-val">{{el}}</div>
      </div>
    </div>
  </div>
</template>

<style scope>
.tx-item {
  margin-bottom: 10px;
}
.tx-item-title {
  font-weight: 500;
  font-size: 15px;
  color: #343a40;
}
.tx-item-val {
  color: #98a6ad;
  overflow-wrap: break-word;
}

.datatable-empty {
  text-align: center;
  padding: 80px 0;
}
.datatable-empty-icon {
  font-size: 64px;
}
.area-title-main {
  margin-top: 20px;
  border-left: 4px solid #343a40;
  padding: 5px 10px;
}
</style>