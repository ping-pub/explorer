<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-13 09:38:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-07 09:15:36
 * @FilePath: /look-web/src/views/base-layout/LangSwitch.vue
 -->
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link flex-center" style="color: #fff;cursor:pointer;">
      <i class="iconfont icon-yuyanqiehuan" style="margin-right: 5px;"></i>
      {{ $t("message.lang") }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="en">English</el-dropdown-item>
      <el-dropdown-item command="cn" divided>中文</el-dropdown-item>
      <el-dropdown-item command="it" divided>Italiano</el-dropdown-item>
      <el-dropdown-item command="fr" divided>Français</el-dropdown-item>
      <el-dropdown-item command="ru" divided>Русский</el-dropdown-item>
      <el-dropdown-item command="es" divided>Español</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      this.$i18n.locale = command;
      window.localStorage.setItem("lang", command);
    }
  }
};
</script>