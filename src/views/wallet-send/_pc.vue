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
        <div style="font-size: 20px;">{{ $t('message.walletsend_Send') }}</div>
        <div style="color: #666;margin-bottom: 20px;">
          {{ $t('message.walletsend_From') }}: {{ address }}
          <!-- <el-button
            type="primary"
            plain
            round
            style="font-size: 10px;padding: 2px 5px;margin-left: 4px;"
            title="switch address"
            >copy</el-button
          > -->
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item :label="$t('message.walletsend_From')" prop="toAddress">
            <el-input v-model="form.toAddress" :placeholder="$t('message.walletsend_address')"></el-input>
          </el-form-item>
          <el-form-item :label="`${$t('message.walletsend_Amount')} (${$t('message.walletsend_Max')} ${available})`" prop="amount">
            <el-input v-model="form.amount" type="number" :min="0">
              <el-button :loading="loading" slot="append" @click="setMax"
                >{{$t('message.walletsend_Max')}}</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('message.walletsend_Memo')">
            <el-input
              v-model="form.memo"
              :placeholder="$t('message.walletsend_Memo')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.walletsend_LedgerAccountIndex')">
            <div>
              <span style="display:inline-block;width: 60px;">{{$t('message.walletsend_Account')}}</span>
              <el-input-number
                size="mini"
                v-model="numAccount"
                :min="0"
              ></el-input-number>
              <span style="display:inline-block;width: 40px;margin-left: 20px;">{{$t('message.walletsend_Index')}}</span>
              <el-input-number
                size="mini"
                v-model="numIndex"
                :min="0"
              ></el-input-number>
            </div>
            <div style="margin-top: 10px;">
              <span style="display:inline-block;width: 60px;">{{$t('message.walletsend_Gas')}}</span>
              <span> {{ gasAtom }}</span>
            </div>
            <div>
              <span style="display:inline-block;width: 60px;">{{$t('message.walletsend_Total')}}</span>
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
          >{{$t('message.walletsend_Sendbyledger')}}</el-button
        >

        <div
          class="sendsuccess-subtitle"
          style="text-align: left;margin-top: 10px;"
        >
          * {{$t('message.walletsend_exception')}}
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
            {{$t('message.walletsend_sign')}}
          </div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_openledger')}}
          </div>

          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="goSend"
              >{{$t('message.walletsend_Canceltransaction')}}</el-button
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
          <div class="sendsuccess-title">{{$t('message.walletsend_Success')}}!</div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_BlockHeight')}}:
            <a :href="`${tx ? `#/block/${tx.height}` : 'javascript:void(0)'}`">
              {{ (tx && "#" + tx.height) || "--" }}</a
            >
          </div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_TxHash')}}:
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
              >{{$t('message.walletsend_SendAgain')}}</el-button
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
          <div class="sendsuccess-title">{{$t('message.walletsend_checkit')}}</div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_notbeenfoun')}}
          </div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_TxHash')}}:
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
              >{{$t('message.walletsend_gettransaction')}}</el-button
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
          <div class="sendsuccess-title">{{$t('message.walletsend_SubmissionFailed')}}</div>
          <div class="sendsuccess-subtitle">
            {{$t('message.walletsend_pleasecheck')}}
          </div>
          <div>
            <el-button
              class="box-base"
              round
              style="width:  200px;margin-top: 20px;"
              @click="goSend"
              :loading="loading"
              >{{$t('message.walletsend_SendAgain')}}</el-button
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
        return callback(new Error(this.$t('message.walletsend_Pleaseinputtoaddress')));
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
          { required: true, trigger: "blur", message: this.$t('message.walletsend_pleaseinputamount') },
          { min: 0, trigger: "blur", message: this.$t('message.walletsend_pleaseinputamount')  }
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
