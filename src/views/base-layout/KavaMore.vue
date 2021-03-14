<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-06-29 21:17:00
 * @LastEditors: dingyi
 * @LastEditTime: 2020-07-14 00:57:10
 * @FilePath: \look-web\src\views\base-layout\KavaMore.vue
--> 
<template>
  <el-dropdown @command="handleCommand">
    <span
      class="el-dropdown-link flex-center"
      style="color: #909399;cursor:pointer;margin-left: 10px;margin-right: 5px;"
    >
      {{ $t("message.kava_more") }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="/cdp" >CDP</el-dropdown-item>
      <el-dropdown-item command="/auction" divided>Auction</el-dropdown-item>
      <el-dropdown-item command="/bep3" divided>BEP3</el-dropdown-item>
      <el-dropdown-item command="/pricefeed" divided>Pricefeed</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      this.$router.push(command);
    }
  }
};
</script>