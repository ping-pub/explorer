<!--
 * @Author: your name
 * @Date: 2020-03-08 21:59:04
 * @LastEditTime: 2020-03-08 22:12:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /look/src/views/wallet-portfolio/_pc.vue
 -->
<template>
  <div>
    <div v-if="!address">
      <div class="tc" style="background: #fff;padding: 60px 20px;">
        <el-image
          style="width: 100px; height: 100px"
          src="/static/icon/empty3.png"
          fit="contain"
        ></el-image>
        <div style="margin: 20px 0;color: #999;">
          {{ $t("message.wallet_Addressisrequired") }}
        </div>
        <el-button
          @click="
            () => {
              this.$router.push('/wallet-add');
            }
          "
          style="padding-left: 20px;padding-right: 20px;"
          class="box-base"
          type="primary"
          icon="el-icon-plus"
          round
          >{{ $t("message.wallet_Useanexistingaddress") }}</el-button
        >
      </div>
    </div>

    <template v-if="address">
      <div style="background: #fff;padding: 20px;">
        <div
          style="display:flex;align-items:center;border-bottom: 1px solid #eee;padding-bottom: 20px;"
        >
          <el-avatar
            size="large"
            src="/static/chains/cosmoshub.svg"
            style="margin-right: 10px;"
          />
          <div style="flex: 1;">
            <div>
              {{ address }}
              <el-button
                type="primary"
                plain
                round
                style="font-size: 10px;padding: 2px 5px;margin-left: 4px;"
                title="switch address"
                @click="
                  () => {
                    this.$router.push('/wallet-add');
                  }
                "
                >{{ $t("message.wallet_switch") }}</el-button
              >
            </div>
            <div style="color: #999;">Cosmoshub</div>
          </div>
          <div>
            <el-button
              type="primary"
              style="margin-right: 5px;"
              @click="
                () => {
                  this.$router.push('/wallet-send?address=' + address);
                }
              "
              >{{ $t("message.wallet_Send") }}</el-button
            >
            <!-- <el-button
              style="margin-right: 5px;"
              @click="
                () => {
                  this.$router.push('/wallet-claim?address=' + address);
                }
              "
              >Claim</el-button
            >
            <el-button
              style="margin-right: 5px;"
              @click="
                () => {
                  this.$router.push('/wallet-stake?address=' + address);
                }
              "
              >Stake</el-button
            > -->
            <!-- <el-button
              @click="
                () => {
                  this.$router.push('/governance?address=' + address);
                }
              "
              >Vote</el-button
            > -->
          </div>
        </div>

        <el-row class="tc" style="margin-bottom: 20px;margin-top: 40px;">
          <el-col :span="6">
            <data-statistic
              :title="$t('message.wallet_AvailableAmount')"
              :value="available"
              style="margin-right: 100px"
            />
          </el-col>
          <el-col :span="6">
            <data-statistic
              :title="$t('message.wallet_DelegatedAmount')"
              :value="delegated"
              style="margin-right: 100px"
            />
          </el-col>
          <el-col :span="6">
            <data-statistic
              :title="$t('message.wallet_Rewards')"
              :value="reward"
              style="margin-right: 100px"
            />
          </el-col>
          <el-col :span="6">
            <data-statistic
              :title="$t('message.wallet_Total')"
              :value="total"
              style="margin-right: 100px"
            />
          </el-col>
        </el-row>
      </div>

      <div class="mt-20 bg-white" style="padding: 15px 20px;">
        <div
          style="margin-bottom: 10px;font-size: 18px;border-left: 2px solid #343a40;padding-left: 10px;line-height: 1"
        >
          {{ $t("message.wallet_Delegations") }}
        </div>
        <el-table class="mt-10" :data="delegations" border>
          <el-table-column type="index" label="#" width="60" />
          <el-table-column
            prop="validator_address"
            :label="$t('message.wallet_Validator')"
          >
            <template slot-scope="scope">
              <a :href="`#/validator/${scope.row.validator_address}`">{{
                validatorObj[scope.row.validator_address]
                  ? validatorObj[scope.row.validator_address].moniker
                  : scope.row.validator_address
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="shares"
            :label="$t('message.wallet_DelegatedAmount')"
          >
            <template slot-scope="scope">
              <span style="font-size: 16px;">{{ scope.row.shares }}</span>
              <el-tag
                v-if="rewardObj[scope.row.validator_address]"
                size="mini"
                style="margin-left: 10px;"
                type="success"
                >{{
                  " " + rewardObj[scope.row.validator_address]
                    ? "+" + rewardObj[scope.row.validator_address].amount
                    : ""
                }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-20 bg-white" style="padding: 15px 20px;">
        <div
          style="margin-bottom: 10px;font-size: 18px;border-left: 2px solid #343a40;padding-left: 10px;line-height: 1"
        >
          {{ $t("message.wallet_Transcantions") }}
        </div>
        <el-table class="mt-10" :data="txs" border>
          <el-table-column type="index" label="#" width="60" />
          <el-table-column
            prop="height"
            :label="$t('message.wallet_Height')"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="txhash"
            :label="$t('message.wallet_txhash')"
          ></el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>

<script>
import mixinData from "./mixinData";
import DataStatistic from "./data-statistic";

export default {
  components: {
    DataStatistic
  },
  mixins: [mixinData]
};
</script>
