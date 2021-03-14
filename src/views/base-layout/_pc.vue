<!--
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-04-27 22:40:09
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\views\base-layout\_pc.vue
 -->
<template>
  <el-container>
    <el-header style="background: #343a40;height: 48px;">
      <top-bar />
    </el-header>
    <el-main style="padding: 15px;">
      <keep-alive>
        <router-view class="max-width"/>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
import TopBar from "./TopBarUbold";

export default {
  components: {
    TopBar
  }
};
</script>

<style scoped>
.base-layout-nav {
  background: #fff;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  transition: background 0.3s, width 0.2s;
}
</style>
