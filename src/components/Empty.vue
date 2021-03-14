<template>
  <div class="datatable-empty" v-loading="loading" element-loading-text="Loading...">
    <el-image style="width: 100px; height: 100px" src="/static/icon/empty3.png" fit="contain"></el-image>
    <div style="line-height: 1;">No Data</div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      default: false
    }
  }
};
</script>

<style scoped>
.datatable-empty {
  text-align: center;
  margin: 30px 20px;
}
.datatable-empty-icon {
  font-size: 64px;
}
</style>