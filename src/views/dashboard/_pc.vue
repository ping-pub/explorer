<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @lastTime: 2020-12-11 10:20:58
 * @FilePath: /look-web/src/views/dashboard/_pc.vue
 -->
<template>
  <div >
    <!-- <div style="margin-bottom: 15px;">
      <el-button
        :loading="loading"
        @click="goAddChain"
        type="primary"
        icon="el-icon-plus"
      >{{ $t(`message.createNewChain`) }}</el-button>
    </div> -->
    <div v-loading="loading">
      <dingyi-empty  v-if="!chains.Mainnet"  style="padding: 60px 15px;"/>
      <div v-for="(el, key) of chains" :key="key" class="mb-10">
        <div class="flex-center mb-10">
          <div
            class="dashboard-title"
          >{{ key === 'Mainnet' ? $t(`message.mainnet`) : key === 'Testnet' ? $t(`message.testnet`) : key }}</div>
        </div>
        <el-row :gutter="10">
          <el-col
            v-for="(item, index) in el"
            :key="index"
            :xs="12"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="4"
            style="margin-bottom: 10px;"
          >
            <div
              class="dashboard-item"
              :class="{
              'dashboard-item-active': current.chainId === item.chainId
            }"
              @click="switchChain(item)"
            >
              <img :src="item.logo" class="dashboard-logo" />
              <p class="dashboard-text">{{ item.name }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
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
.dashboard-item {
  cursor: pointer;
  display: flex;
  background: #fff;
  padding: 8px 10px;
  border: 1px solid #eee;
}
.dashboard-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 8px;
}
.dashboard-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #343a3f;
}
.dashboard-item-active {
  border: 1px solid #343a3f;
}
.dashboard-title {
  font-weight: 400;
  font-size: 16px;
  color: #333;
}
.dashboard-text {
  line-height: 30px;
  font-size: 16px;
  color: #333;
}
</style>
