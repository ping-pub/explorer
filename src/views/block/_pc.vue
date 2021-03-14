

<template>
  <div>
    <div>
      <div class="flex-center" style="justify-content: center;">
        <el-button
          :disabled="loading || minHeight <= 1"
          icon="el-icon-arrow-left"
          style="font-size: 14px;margin-right: 10px;margin-left: 10px;"
          circle
          @click="nextPage"
        ></el-button>

        <el-form>
          <el-input
            class="chain-input"
            :disabled="loading"
            v-model="minHeight"
            style="min-width: 100px;"
            type="number"
            @blur="switchHeight"
          ></el-input>
        </el-form>
        <span style="margin: 0 10px;">-</span>
        <el-input :disabled="true" v-model="maxHeight" :style="{ width: '200px' }" type="number" />
        <el-button
          :disabled="loading || maxHeight >= (last_height - 1)"
          @click="prevPage"
          icon="el-icon-arrow-right"
          style="font-size: 14px;margin-left: 10px;margin-right: 10px;"
          circle
        ></el-button>
      </div>
    </div>

    <div class="block-bg">
      <el-row :gutter="10" class="block-wrap">
        <el-col
          class="mb-20"
          :xs="24"
          :sm="8"
          :md="8"
          :lg="4"
          :xl="4"
          v-for="(item, index) of blocks"
          :key="index"
        >
          <div class="block-area" v-loading="loading" element-loading-text="Loading...">
            <a class="block-title-bg" :href="`#/block/${item.height}`">
              <div class="block-height"># {{ item.height }}</div>
            </a>

            <div style="margin-top: 10px;">
              <!-- Last Block Hash -->
              <div class="mb-5 flex-center">
                <div class="flex-1">
                  <div class="text-item-title">{{ $t("message.block_lastBlockHash") }}</div>
                  <div
                    class="text-item-content"
                    :style="{ fontSize: '14px'}"
                  >{{ item.last_block_hash | miniHash }}</div>
                </div>
                <div style="text-align:right;">
                  <div class="text-item-title">{{ $t("message.block_hash") }}</div>
                  <div
                    class="text-item-content"
                    :style="{ fontSize: '14px'}"
                  >{{ item.block_hash | miniHash }}</div>
                </div>
              </div>
              <!-- proposer_address -->
              <div class="mb-5">
                <div class="text-item-title">{{ $t("message.block_proposer") }}</div>
                <div class="text-item-content">
                  <span
                    v-if="!hexObj[item.proposer_address]"
                  >{{ item.proposer_address | shortHash }}</span>
                  <a
                    v-else
                    :href="'#/validator/' + hexObj[item.proposer_address].operator_address"
                  >{{ hexObj[item.proposer_address].moniker }}</a>
                </div>
              </div>

              <div class="mb-5">
                <div class="text-item-title">{{ $t("message.block_time") }}</div>
                <div class="text-item-content">
                  <span :title="item.time">{{ item.time }}</span>
                </div>
              </div>

              <!-- txs -->
              <div>
                <div class="text-item-title">{{ $t("message.block_transactions") }}</div>
                <div class="text-item-content flex-center">
                  <span :title="item.num_txs">{{ item.total_txs }}({{ '+' + (item.num_txs || 0) }})</span>
                </div>
                <div>
                  <a
                    style="color: #98a6ad;font-size: 12px;padding: 10px;border: 1px solid #eee;margin-top: 5px;display:block;"
                    :href="`#/tx/${item.hash}`"
                    v-for="(item, index) of blockTxObj[item.height]"
                    :key="index"
                  >
                    <div class="flex-center">
                      <div
                        style="width: 6px;height: 6px;border-radius: 10px;margin-right: 5px;"
                        :style="{ background: item.success ? '#52c41a' : '#e66'}"
                      ></div>
                      {{ $t("message.block_txhash") }}:
                    </div>
                    <div class="text-overflow">{{ item.hash }}</div>
                    <div>{{ $t("message.block_sentby") }}:</div>
                    <div>{{ item.sender | shortHash }}</div>
                    <div v-if="item.memo" class="text-overflow">{{ $t("message.block_memo") }}: {{ item.memo }}</div>
                    <div style="margin-top: 5px;">
                      <el-button
                        class="text-overflow"
                        style="width: 100%"
                        round
                        type="primary"
                        size="mini"
                      >{{ item.action || 'Failed' }}</el-button>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import mixinData from "./mixinData";

export default {
  mixins: [mixinData]
};
</script>

<style scoped>
.block-height {
  font-size: 24px;
}
.block-bg {
  margin-top: 20px;
}
.block-area {
  border: 1px solid #eee;
  background: #fff;
  padding: 10px;
}
.block-title-bg {
  background: #343a40;
  color: #fff;
  display: block;
  padding: 5px 10px;
  cursor: pointer;
}
.link-line {
  height: 1px;
  width: 60px;
  background: #ddd;
  position: absolute;
  top: 40px;
}
.text-item-title {
  font-size: 14px;
  color: #343a40;
}
.text-item-content {
  padding: 5px 0;
  color: #98a6ad;
}
.styicky-operation {
  position: fixed;
  top: 70px;
  left: 20px;
  right: 20px;
  background: #f5f6f8;
  z-index: 20;
  padding: 10px 0;
}
.chain-input-h5 .el-input__inner {
  padding: 0 5px;
}
</style>
