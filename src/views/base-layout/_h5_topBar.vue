<!--
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-07-14 00:43:52
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\views\base-layout\_h5_topBar.vue
 -->
<template>
  <div class="topbar topnav max-width">
    <div class="logo" v-if="!back">LOOK</div>
    <div
      class="logo"
      v-else
      @click="
        () => {
          this.$router.back();
        }
      "
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <LangSwitch v-if="!back"/>
    <span style="flex: 1;"></span>
    <el-button
      @click="
        () => {
          this.$router.push('/dashboard');
        }
      "
      round
      size="mini"
      style="background:#343a40;color: #fff;"
    >
      <span
        class="box-base"
        style="display:inline-block;width: 8px;margin-right: 5px;height: 8px;border-radius: 10px;background: #52c41a;"
      ></span>
      {{ current.name }}
      <i class="el-icon-refresh" style="margin-left: 5px;"></i>
    </el-button>
  </div>
</template>

<script>
import { getChain } from "../../api/common/getChain";
import { switchChain } from "../../utils/initChain";
import dashboard from "../dashboard/_h5";
import LangSwitch from './LangSwitch'


export default {
  props: {
    back: {
      default: false
    }
  },
  data() {
    return {
      drawer: false,
      current: window.chain,
      chains: [],
      activeIndex: ""
    };
  },
  components: {
    dashboard,
    LangSwitch
  },
  created() {
    this.activeIndex = this.$route.path;
    this.getChains();
  },
  methods: {
    getChains() {
      const chains = getChain();
      this.chains = [...chains.Mainnet, ...chains.Testnet];
    },
    switchChain(chain) {
      switchChain(chain);
    }
  }
};
</script>

<style>
.drawer-class {
  margin-top: 48px;
  box-shadow: none;
  border-bottom: 1px solid #eee;
}
</style>

<style scoped>
.logo {
  font-size: 24px;
  font-weight: 500;
  margin-right: 20px;
  color: #eee;
}
.topbar {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 14px;
}
.topbar a {
  color: #999;
  cursor: pointer;
  padding: 0 15px;
}
.topbar a:hover {
  color: #333;
}
.topbar .topbar-active {
  color: #333;
}
</style>

<style>
/* .topnav {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
} */
.topnav .el-menu--horizontal > .el-menu-item {
  height: 46px;
  line-height: 46px;
  padding: 0 10px;
  background: #343a40;
}
.topnav .el-menu--horizontal > .el-menu-item:hover {
  color: #fff;
  background: #343a40;
}
.topnav .el-menu--horizontal > .el-menu-item.is-active {
  color: #fff;
  background: #343a40;
}
</style>
