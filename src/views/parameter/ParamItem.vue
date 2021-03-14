<!--
 * @Author: your name
 * @Date: 2020-03-07 11:07:22
 * @LastEditTime: 2020-07-13 23:10:39
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\views\parameter\ParamItem.vue
 -->
<script>
export default {
  props: {
    nums: {
      default: 6
    },
    title: "",
    content: {
      default() {
        return {};
      }
    }
  }
};
</script>
<template>
  <div>
    <p class="area-title">{{ title }}</p>
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="12"
        :md="nums"
        :lg="nums"
        :xl="nums"
        v-for="(item, key) in content"
        :key="key"
        style="margin-bottom: 15px;"
      >
        <div class="area-item">
          <h3 class="area-item-text">
            {{ item.value }}
          </h3>
          <p class="area-item-title">{{ item.title }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.area-item {
  text-align: center;
  padding: 10px 0;
  background: #fff;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  border: 1px solid #eee;
}

.area-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .1);
  border: 1px solid #343a40;
}
.area-item-text {
  margin: 0;
  font-weight: 500;
  color: #343a40;
  font-size: 18px;
}
.area-item-title {
  font-size: 14px;
  color: #98a6ad;
}
.area-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}
</style>
