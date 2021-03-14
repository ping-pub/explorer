<template>
  <div style="background: #fff;" class="box-dark p-20">
    <div>
      <div class="flex-center" style="justify-content: center;">
        <el-radio-group class="box-base" size="mini" v-model="type">
          <el-radio-button label="bonded">{{$t('message.validator_Active')}}</el-radio-button>
          <el-radio-button label="unbonded">{{$t('message.validator_Inactive')}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex-center" style="justify-content: center;margin-top: 20px;">
        <el-button
          class="box-base"
          :disabled="loading || blockHeightMin <= 1"
          icon="el-icon-arrow-left"
          style="font-size: 16px;margin-right: 10px;margin-left: 10px;"
          size="mini"
          circle
          @click="nextPage"
        ></el-button>

        <el-form @submit.native.prevent="switchHeight" @keyup.enter.native.prevent="switchHeight">
          <el-input
            class="box-base"
            :disabled="loading"
            @blur="switchHeight"
            v-model="blockHeightMin"
            style="min-width: 100px;max-width: 200px;"
            type="number"
          ></el-input>
        </el-form>
        <span style="margin: 0 10px;">-</span>
        <el-input
          class="box-base"
          disabled
          v-model="blockHeightMax"
          style="min-width: 100px;max-width: 200px;"
          type="number"
        />
        <el-button
          class="box-base"
          :disabled="loading || blockHeightMax >= blockHeight - 1"
          @click="prevPage"
          size="mini"
          icon="el-icon-arrow-right"
          style="font-size: 14px;margin-left: 10px;margin-right: 10px;"
          circle
        ></el-button>
      </div>
    </div>

    <div style="margin-top: 20px;margin-bottom: 30px;">
      <div class="uptime-content" v-show="type === 'bonded'">
        <div v-for="(item, index) of validators" :key="index">
          <div style="margin-bottom: 6px;">
            <a
              :href="`#/validator/${item.operator_address}`"
              :title="item.moniker"
              :underline="false"
              class="uptime-username"
            >
              {{ item.moniker }}
              <i class="el-icon-arrow-right"></i>
            </a>
          </div>

          <div class="flex-center mb-10">
            <a
              :href="`#/block/${el.height}`"
              v-for="(el, key) of heightArr"
              :key="key"
              :title="el.height"
              class="uptime-block-item"
              :class="{
                'uptime-block-item-active':
                  el.precommits && el.precommits[item.hexAddress]
              }"
            ></a>
          </div>
        </div>
      </div>
      <div class="uptime-content" v-show="type === 'unbonded'">
          <div v-for="(item, index) of validatorsUnbonded" :key="index">
            <div style="margin-bottom: 6px;">
              <a
                :href="`#/validator/${item.operator_address}`"
                :title="item.moniker"
                :underline="false"
                class="uptime-username"
              >
                {{ item.moniker }}
                <i class="el-icon-arrow-right"></i>
              </a>
            </div>

            <div class="flex-center mb-10">
              <a
                :href="`#/block/${el.height}`"
                v-for="(el, key) of heightArr"
                :key="key"
                :title="el.height"
                class="uptime-block-item"
                :class="{
                'uptime-block-item-active':
                  el.precommits && el.precommits[item.hexAddress]
              }"
              ></a>
            </div>
          </div>
        </div>
      <dingyi-empty v-if="validators.length === 0" :loading="loading" />
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
.uptime-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.uptime-block-item {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 1px solid #67c23a;
  margin-right: 2px;
}
.uptime-block-item-active {
  background: #c2e7b0;
}
.uptime-username {
  color: #343a40;
}
.uptime-username:hover {
  color: #1890ff;
}
.styicky-operation {
  position: fixed;
  top: 70px;
  left: 20px;
  right: 20px;
  background: #f5f6f8;
  z-index: 20;
  padding: 10px 10px !important;
}
.h5-p10 {
  padding: 0 10px;
}
</style>
