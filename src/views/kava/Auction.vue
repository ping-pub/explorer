<!--
 * @Description: /cdp/accounts
 * @Autor: dingyi
 * @Date: 2020-06-29 23:00:19
 * @LastEditors: dingyi
 * @LastEditTime: 2020-06-30 15:23:56
 * @FilePath: /look-web/src/views/kava/Auction.vue
--> 

<template>
  <div class="bg-white" style="padding: 10px 15px;">
    <div class="list-title">Auction</div>

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
          label: 'initiator',
          prop: 'initiator'
        },
        {
          label: 'bidder',
          prop: 'bidder'
        },
        {
          label: 'has_received_bids',
          prop: 'has_received_bids'
        },
        // {
        //   label: 'end_time',
        //   prop: 'end_time'
        // },
        // {
        //   label: 'max_end_time',
        //   prop: 'max_end_time'
        // },
        {
          label: 'type',
          prop: 'type'
        },
        {
          label: 'phase',
          prop: 'phase'
        },
      ],
      loading: false
    };
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      const res = await this.$axios.get(`/auction/auctions`, { headers: { server: window.chain.lcd } })
      this.loading = false
      this.datas = res.result
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