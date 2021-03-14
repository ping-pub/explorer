<!--
 * @Author: your name
 * @Date: 2020-02-29 01:57:59
 * @LastEditTime: 2020-03-08 22:37:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /serverless/look-web/src/views/wallet-send/_pc.vue
 -->
<template>
  <div style="background: #fff;">
    <div style="max-width: 500px;margin: 0 auto;padding: 40px 0;">
      <template v-if="step === 'form'">
        <div style="font-size: 20px;">Stake</div>
        <div style="color: #666;margin-bottom: 20px;">From: {{ address }}</div>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="Select Validator" prop="toAddress">
            <el-select v-model="form.toAddress" placeholder="please select" style="width: 100%;">
              <el-option
                v-for="(item, key) in validatorObj"
                :key="key"
                :label="item.moniker"
                :value="item.operator_address"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`Amount (Max ${available})`" prop="amount">
            <el-input v-model="form.amount" type="number" :min="0">
              <el-button :loading="loading" slot="append" @click="setMax"
                >Max</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item label="Memo (optional)">
            <el-input
              v-model="form.memo"
              placeholder="memo (optional)"
            ></el-input>
          </el-form-item>
          <el-form-item label="Ledger Account Index (default 0,0)">
            <div>
              <span style="display:inline-block;width: 60px;">Account</span>
              <el-input-number
                size="mini"
                v-model="numAccount"
                :min="0"
              ></el-input-number>
              <span style="display:inline-block;width: 40px;margin-left: 20px;"
                >Index</span
              >
              <el-input-number
                size="mini"
                v-model="numIndex"
                :min="0"
              ></el-input-number>
            </div>
            <div style="margin-top: 10px;">
              <span style="display:inline-block;width: 60px;">Gas</span>
              <span> {{ gasAtom }}</span>
            </div>
            <div>
              <span style="display:inline-block;width: 60px;">Total</span>
              <span> {{ subTotal }}</span>
            </div>
          </el-form-item>
        </el-form>

        <el-button
          style="width:  200px;"
          type="primary"
          class="box-base"
          round
          @click="sendByLedger"
          :loading="loading"
          >Stake by ledger</el-button
        >

        <div
          class="sendsuccess-subtitle"
          style="text-align: left;margin-top: 10px;"
        >
          * If there are any exceptions, refresh the page and try again.
        </div>
      </template>

      <template v-if="step === 'load'">
        <div class="tc" style="margin-top: 40px;">
          <div>
            <i
              class="el-icon-info"
              style="font-size: 48px;color: #1890ff;"
              v-loading="loading"
            ></i>
          </div>
          <div class="sendsuccess-title">
            You can view transaction information and sign.
          </div>
          <div class="sendsuccess-subtitle">
            Please open ledger and cosmos app.
          </div>

          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="goSend"
              >Cancel transaction</el-button
            >
          </div>
        </div>
      </template>

      <template v-if="step === 'ok'">
        <div class="tc" style="margin-top: 40px;">
          <div>
            <i
              class="el-icon-circle-check"
              style="font-size: 48px;color: #52c41a;"
            ></i>
          </div>
          <div class="sendsuccess-title">Success!</div>
          <div class="sendsuccess-subtitle">
            Block Height:
            <a :href="`${tx ? `#/block/${tx.height}` : 'javascript:void(0)'}`">
              {{ (tx && "#" + tx.height) || "--" }}</a
            >
          </div>
          <div class="sendsuccess-subtitle">
            Tx Hash:
            <a
              :href="`${tx ? `#/tx/${tx.txhash}` : 'javascript:void(0)'}`"
              style="font-size: 12px;"
            >
              {{ (tx && tx.txhash) || "--" }}</a
            >
          </div>

          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="goSend"
              >Send Again</el-button
            >
          </div>
        </div>
      </template>

      <template v-if="step === 'warn'">
        <div class="tc" style="margin-top: 40px;">
          <div>
            <i
              class="el-icon-warning-outline"
              style="font-size: 48px;color: #faad14;"
            ></i>
          </div>
          <div class="sendsuccess-title">Please check it later.</div>
          <div class="sendsuccess-subtitle">
            Transaction information has not been found.
          </div>
          <div class="sendsuccess-subtitle">
            Tx Hash:
            <a
              :href="`${txhash ? `#/tx/${txhash}` : 'javascript:void(0)'}`"
              style="font-size: 12px;"
            >
              {{ txhash || "--" }}</a
            >
          </div>

          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="checkTx"
              :loading="loading"
              >Get Transaction Again</el-button
            >
          </div>
        </div>
      </template>

      <template v-if="step === 'error'">
        <div class="tc" style="margin-top: 40px;">
          <div>
            <i
              class="el-icon-circle-close"
              style="font-size: 48px;color: #ff4d4f;"
            ></i>
          </div>
          <div class="sendsuccess-title">Submission Failed.</div>
          <div class="sendsuccess-subtitle">
            Please check and modify the following information before
            resubmitting.
          </div>
          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="goSend"
              :loading="loading"
              >Send Again</el-button
            >
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import b32 from "../../utils/b32";
import mixinData from "./mixinData";

export default {
  mixins: [mixinData],
  data() {
    const validateToAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Please input to address"));
      } else {
        try {
          b32.decode(value);
          callback();
        } catch (e) {
          callback(new Error(e.message));
        }
      }
    };
    return {
      rules: {
        toAddress: [
          { required: true, validator: validateToAddress, trigger: "blur" }
        ],
        amount: [
          { required: true, trigger: "blur", message: "please input amount" },
          { min: 0, trigger: "blur", message: "please input amount" }
        ]
      }
    };
  },
  watch: {
    noticeMsg(val) {
      if (val) {
        this.$message.error(val);
        this.noticeMsg = "";
      }
    },
    noticOk(val) {
      if (val) {
        this.$message.success(val);
        this.noticeOk = "";
      }
    }
  }
};
</script>

<style scoped>
.logo {
  width: 50px;
  height: 31px;
  line-height: 31px;
  font-size: 24px;
  font-weight: 700;
  color: #2e3338;
  margin: 16px 24px 16px 0;
  float: left;
}
.subtotal-item {
  padding: 5px 0;
  font-size: 18px;
  font-weight: 400;
  color: #333;
}
.subtotal-item span {
  color: #666;
  font-size: 14px;
  display: inline-block;
  font-weight: normal;
  width: 100px;
}
.subtotal-total {
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 10px;
}
.sendsuccess-title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
  line-height: 1.8;
  text-align: center;
}
.sendsuccess-subtitle {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}
</style>
