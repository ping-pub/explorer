<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-22 19:19:39
 * @LastEditors: dingyi
 * @LastEditTime: 2020-07-18 16:30:27
 * @FilePath: \look-web\src\components\DataTable.vue
 -->
<script>
import DataTableColumn from "./DataTableColumn";

export default {
  props: {
    defaultSort: {
      default() {
        return {};
      }
    },
    tableRowClassName: {
      default() {
        return null;
      }
    },
    rowKey: {
      default: null
    },
    columns: {
      default() {
        return [];
      }
    },
    datas: {
      default: null
    },
    tableSize: {
      default: "small"
    },
    loading: {
      default: false
    }
  },
  components: {
    DataTableColumn
  }
};
</script>

<template>
  <div style="overflow: auto;-webkit-overflow-scrolling: touch;">
    <el-table
      style="min-width: 600px;"
      border
      :size="tableSize"
      :data="datas"
      :default-sort="defaultSort"
      v-show="columns.length > 0"
      :row-class-name="tableRowClassName"
      :header-cell-style="{ background: '#f1f5f7' }"
    >
      <el-table-column label="#" type="index" width="60"></el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :label="item.label"
        :align="item.align"
        :key="item[rowKey] || index"
        :width="item.width"
        :sortable="item.sortable"
        :sort-method="item['sort-method']"
      >
        <template slot-scope="scope">
          <data-table-column v-if="item.render" :column="item" :scope="scope" :render="item.render"></data-table-column>
          <span v-else v-text="scope.row[item.prop]"></span>
        </template>
      </el-table-column>

      <div
        slot="empty"
        class="datatable-empty"
        v-loading="loading"
        element-loading-text="Loading..."
      >
        <el-image style="width: 100px; height: 100px" src="/static/icon/empty3.png" fit="contain"></el-image>
        <div style="line-height: 1;">No Data</div>
      </div>
    </el-table>
  </div>
</template>

<style scoped>
.datatable-empty {
  text-align: center;
  padding: 80px 0;
}
.datatable-empty-icon {
  font-size: 64px;
}
.datatable-paging-wrap {
  margin-top: 20px;
}
</style>
