<!--
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-06-30 17:30:05
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/views/base-layout/TopBarUbold.vue
 -->
<template>
  <div class="topbar topnav max-width">
    <div class="logo">LOOK</div>
    <el-menu
      v-if="!diff || (diff <= 0)"
      class="el-menu-demo hidden-sm-and-down"
      mode="horizontal"
      :router="true"
      :default-active="activeIndex"
      background-color="#343a40"
      text-color="#909399"
    >
      <el-menu-item index="/validator">{{ $t("message.validators") }}</el-menu-item>
      <el-menu-item index="/block">{{ $t("message.blocks") }}</el-menu-item>
      <el-menu-item index="/uptime" v-if="current.chainId !== 'e-money'">{{ $t("message.uptime") }}</el-menu-item>
      <el-menu-item
        index="/governance"
        v-if="current.chainId !== 'e-money'"
      >{{ $t("message.governance") }}</el-menu-item>
      <el-menu-item index="/parameter">{{ $t("message.parameters") }}</el-menu-item>
      <el-menu-item
        v-if="current.chainId === 'cosmoshub-3'"
        index="/wallet"
      >{{ $t("message.wallet") }}</el-menu-item>
    </el-menu>
    <KavaMore v-if="current.chainId === 'kava-2'"/>
    <span style="flex: 1;"></span>
    <el-button
      @click="goDashboard"
      round
      size="mini"
      style="margin-right: 20px;background:#343a40;color: #fff;"
    >
      <span
        class="box-base"
        style="display:inline-block;width: 8px;margin-right: 5px;height: 8px;border-radius: 10px;background: #52c41a;"
      ></span>
      {{ current.name
      }}
      <i class="el-icon-refresh" style="margin-left: 5px;"></i>
    </el-button>

    <LangSwitch />
  </div>
</template>

<script>
import { getChain } from "../../api/common/getChain";
import { switchChain } from "../../utils/initChain";
import dayjs from "dayjs";
import LangSwitch from "./LangSwitch";
import KavaMore from "./KavaMore";

export default {
  data() {
    return {
      diff: null,
      drawer: false,
      current: window.chain,
      chains: [],
      activeIndex: ""
    };
  },
  components: {
    LangSwitch,
    KavaMore
  },
  created() {
    const time = window.chain.genesis_time;
    if (time) {
      const diff = dayjs(time).diff(dayjs());
      this.diff = diff;
    }
    this.activeIndex = this.$route.path;
  },
  methods: {
    getChains() {
      const chains = getChain();
      this.chains = [...chains.Mainnet, ...chains.Testnet];
    },
    goDashboard() {
      if (this.$route.path !== "/dashboard") {
        this.$router.push("/dashboard");
      }
    },
    switchChain(chain) {
      switchChain(chain);
    }
  }
};
</script>

<style>
.topbar .el-menu {
  background-color: transparent;
}
.topbar .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent;
  color: #fff;
}
.topbar .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 46px;
  line-height: 46px;
}
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
