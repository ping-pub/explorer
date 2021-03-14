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
      <div style="font-size: 20px;">Send</div>
      <div style="color: #666;">
        From: {{ address }}
        <el-button
          type="primary"
          plain
          round
          style="font-size: 10px;padding: 2px 5px;margin-left: 4px;"
          title="switch address"
        >copy</el-button>
      </div>

      <div style="margin: 20px 0;">
        <el-steps :active="step" finish-status="success" simple>
          <el-step title="Form"></el-step>
          <el-step title="Sign"></el-step>
          <el-step title="Result"></el-step>
        </el-steps>
      </div>

      <template v-if="step === 0">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="to address" prop="toAddress">
            <el-input v-model="form.toAddress" placeholder="address"></el-input>
          </el-form-item>
          <el-form-item label="amount" prop="amount">
            <el-input v-model="form.amount" type="number" :min="0"></el-input>
          </el-form-item>
          <el-form-item label="memo">
            <el-input v-model="form.memo" placeholder="memo (optional)"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          style="width:  200px"
          round
          class="box-base"
          type="primary"
          @click="nextGasCommon"
          :loading="loading"
        >Next</el-button>
      </template>

      <template v-if="step === 1">
        <div>
          <div class="subtotal-item">
            <span>Gas:</span>
            {{ gasAtom }}
          </div>
          <div class="subtotal-item">
            <span>Amount:</span>
            {{ form.amount }}
          </div>
          <div class="subtotal-item subtotal-total">
            <span>Total:</span>
            {{ subTotal }}
          </div>
        </div>
        <el-button
          style="width:  200px;margin-top: 20px;"
          type="primary"
          class="box-base"
          round
          @click="nextSignCommon"
          :loading="loading"
        >Sure and Send by ledger</el-button>
        <div style="color: #666;margin-top: 10px;">To: {{ form.toAddress }}</div>
      </template>

      <template v-if="step === 2 || step === 3">
        <div class="tc" style="margin-top: 40px;">
          <div>
            <i class="el-icon-circle-check" style="font-size: 48px;color: #52c41a;"></i>
          </div>
          <div class="sendsuccess-title">Success!</div>
          <div class="sendsuccess-subtitle">To: {{form.toAddress}}</div>

          <div>
            <el-button
          class="box-base" round style="width:  200px;margin-top: 20px;" @click="goSend">Send Again</el-button>
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
  methods: {
    goSend() {
      this.step = 0;
      // TODO: clear form data
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