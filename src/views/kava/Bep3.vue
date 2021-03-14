<!--
 * @Description: /cdp/accounts
 * @Autor: dingyi
 * @Date: 2020-06-29 23:00:19
 * @LastEditors: dingyi
 * @LastEditTime: 2020-06-30 15:06:40
 * @FilePath: /look-web/src/views/kava/Bep3.vue
--> 

<template>
  <div class="bg-white" style="padding: 10px 15px;">
    <div class="list-title">BEP3</div>

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
          label: 'amount',
          prop: 'amount',
          render: (h, context) => {
            const row = context.props.scope.row;
            const { amount } = row || {};
            const one = (amount && amount[0]) || { amount: '', denom: '--'}
            return (<div>{one.amount + one.denom }</div>);
          }
        },
        {
          label: 'random_number_hash',
          prop: 'random_number_hash'
        },
        {
          label: 'expire_height',
          prop: 'expire_height'
        },
        {
          label: 'timestamp',
          prop: 'timestamp'
        },
        {
          label: 'sender',
          prop: 'sender'
        },
        {
          label: 'recipient',
          prop: 'recipient'
        },
        {
          label: 'sender_other_chain',
          prop: 'sender_other_chain'
        },
        {
          label: 'recipient_other_chain',
          prop: 'recipient_other_chain'
        },
        {
          label: 'closed_block',
          prop: 'closed_block'
        },
        {
          label: 'status',
          prop: 'status'
        },
        {
          label: 'cross_chain',
          prop: 'cross_chain'
        },
        {
          label: 'direction',
          prop: 'direction'
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
      const res = await this.$axios.get(`/bep3/swaps`, { headers: { server: window.chain.lcd } })
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