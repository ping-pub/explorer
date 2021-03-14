<!--
 * @Description: /cdp/accounts
 * @Autor: dingyi
 * @Date: 2020-06-29 23:00:19
 * @LastEditors: dingyi
 * @LastEditTime: 2020-06-30 15:16:01
 * @FilePath: /look-web/src/views/kava/Pricefeed.vue
--> 

<template>
  <div class="bg-white" style="padding: 10px 15px;">
    <div class="list-title">Pricefeed</div>

    <dingyi-data-table
      ref="dt"
      :noLocalPaging="true"
      :toolbar="false"
      :btns="{ noFresh: true, index: true }"
      :datas="datas"
      :columns="columns"
      :loading="loading"
    ></dingyi-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datas: [],
      columns: [
        {
          label: "oracles",
          prop: "oracles",
          render: (h, context) => {
            const row = context.props.scope.row;
            const { oracles } = row || {};
            let arr = [];
            for (const item of oracles) {
              arr.push(<div style="margin-bottom: 5px;"><el-tag type="info">{item}</el-tag></div>);
            }
            return (
              <el-popover placement="right-start" trigger="click">
                <div>{arr}</div>
                <el-button type="text" slot="reference" style="color: #409EFF">
                  Show
                </el-button>
              </el-popover>
            );
          }
        },
        {
          label: "market_id",
          prop: "market_id"
        },
        {
          label: "base_asset",
          prop: "base_asset"
        },
        {
          label: "quote_asset",
          prop: "quote_asset"
        },
        {
          label: "active",
          prop: "active"
        }
      ],
      loading: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      const res = await this.$axios.get(`/pricefeed/markets`, {
        headers: { server: window.chain.lcd }
      });
      this.loading = false;
      this.datas = res.result;
    }
  }
};
</script>

<style scoped>
.list-title {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 10px;
}
</style>