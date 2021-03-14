<template>
  <div>
    <el-header style="background: #343a40;height: 48px;padding: 0 15px;">
      <H5TopBar :back="true"/>
    </el-header>
    <keep-alive>
    <router-view style="overflow-x: hidden;"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import H5TopBar from "./_h5_topBar";

export default {
  components: {
    H5TopBar
  },
  data() {
    return {
      active: "/validator"
    };
  },
  created() {
    this.active = this.$route.path;
  }
};
</script>
