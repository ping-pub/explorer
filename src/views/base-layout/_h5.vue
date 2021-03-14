<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-07-13 22:37:51
 * @LastEditors: dingyi
 * @LastEditTime: 2020-07-14 01:23:32
 * @FilePath: \look-web\src\views\base-layout\_h5.vue
--> 
<template>
  <div>
    <el-header style="background: #343a40;height: 48px;padding: 0 15px;">
      <H5TopBar />
    </el-header>
    <keep-alive>
    <router-view style="overflow-x: hidden;"></router-view>
    </keep-alive>
    <div style="height: 50px;"></div>
    <van-action-sheet cancel-text="cancel" :round="false" close-on-click-action v-model="show" :actions="actions" @select="switchAction"/>
    <van-tabbar v-show="path !== '/dashboard'" v-model="active" style="border-top: 1px solid #eee;" active-color="#333" inactive-color="#999">
      <van-tabbar-item icon="friends-o" name="/validator" to="/validator">{{ $t("message.validators") }}</van-tabbar-item>
      <van-tabbar-item icon="apps-o" name="/block" to="/block">{{ $t("message.blocks") }}</van-tabbar-item>
      <van-tabbar-item v-if="current.chainId === 'kava-2'" icon="add-o" @click="() => { this.show = !this.show }">
         {{ $t("message.kava_more") }}
      </van-tabbar-item>
      <van-tabbar-item  v-if="current.chainId !== 'e-money' && current.chainId !== 'kava-2'" icon="points" to="/uptime" name="/uptime">{{ $t("message.uptime") }}</van-tabbar-item>
      <van-tabbar-item v-if="current.chainId !== 'e-money'" icon="comment-o" to="/governance" name="/governance">{{ $t("message.governance") }}</van-tabbar-item>
      <van-tabbar-item icon="discount" to="/parameter" name=”/parameter“>{{ $t("message.parameters") }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import H5TopBar from "./_h5_topBar";

export default {
  components: {
    H5TopBar,
  },
  computed: {
    current() {
      return window.chain
    },
    path() {
      return this.$route.path
    }
  },
  data() {
    return {
      active: "/validator",
      show: false,
      actions: [
        { name: this.$t("message.uptime"), path: '/uptime' },
        { name: 'CDP', path: '/cdp' },
        { name: 'Auction', path: '/auction' },
        { name: 'BEP3', path: '/bep3' },
        { name: 'Pricefeed', path: '/pricefeed' }
      ],
    };
  },
  created() {
    this.active = this.$route.path
  },
  methods: {
    switchAction(action, index) {
      this.show = false
      this.$router.push(action.path)
    }
  }
};
</script>