<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-15 19:48:37
 * @LastEditors: dingyi
 * @LastEditTime: 2020-05-01 10:16:20
 * @FilePath: \look-web\src\views\chain-add\_pc.vue
 -->
<template>
  <div class="bg-white p-20">
    <div
      style="margin-bottom: 10px;font-size: 18px;border-bottom: 1px solid #eee;padding-bottom: 10px;"
    >{{ $t(`message.createNewChain`) }}</div>
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm">
      <el-form-item :label="$t(`message.chaindadd_name`)" prop="name">
        <el-input v-model="form.name" placeholder="Cosmos Hub"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_chainId`)" prop="chainId">
        <el-input v-model="form.chainId" placeholder="cosmoshub-3"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_logo`)">
        <el-input v-model="form.logo" placeholder="/static/chains/cosmoshub.svg"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_lcd`)" prop="lcd">
        <el-input
          v-model="form.lcd"
          placeholder="https://lcd.nylira.net (Please add the protocol completely, default http)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_rpc`)" prop="rpc">
        <el-input
          v-model="form.rpc"
          placeholder="https://rpc.nylira.net (Please add the protocol completely, default http)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_prefix`)" prop="prefix">
        <el-input v-model="form.prefix" placeholder="cosmos"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_unit`)" prop="unit">
        <el-input v-model="form.unit" placeholder="ATOM"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_version`)">
        <el-input v-model="form.version" placeholder="0.32.7"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_api`)" prop="api">
        <el-radio-group v-model="form.api">
          <el-radio label="V1">{{ $t("message.chaindadd_apiV1") }}</el-radio>
          <el-radio label="V2">{{ $t("message.chaindadd_apiV2") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_type`)" prop="type">
        <el-radio-group v-model="form.type" prop="type">
          <el-radio label="Mainnet">{{ $t("message.chaindadd_mainnet") }}</el-radio>
          <el-radio label="Testnet">{{ $t("message.chaindadd_testnet") }}</el-radio>
          <el-radio label="GoZ">{{ $t("message.chaindadd_gos") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t(`message.chaindadd_desc`)">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="submitForm('ruleForm')"
          icon="el-icon-check"
          type="primary"
        >{{ $t("message.chaindadd_save") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixinData from "./mixinData";

export default {
  mixins: [mixinData],
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        chainId: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        api: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        lcd: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        rpc: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        prefix: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: true,
            message: this.$t("message.chaindadd_tip"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      if (
        this.form.lcd.substr(0, 7) !== "http://" &&
        this.form.lcd.substr(0, 8) !== "https://" &&
        this.form.rpc.substr(0, 7) !== "http://" &&
        this.form.rpc.substr(0, 8) !== "https://"
      ) {
        this.$message.error( this.$t("message.chaindadd_http"));
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitChain();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
