<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-12 01:55:27
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-12 03:13:38
 * @FilePath: \look-web\src\views\genesis-time\_pc.vue
 -->
<template>
  <div>
    <FlipClock style="margin-top: 60px;margin-bottom: 20px;" />
    <div v-for="(item, index) of height_vote_set" :key="index">
      <div
        style="padding: 5px 0;font-size: 18px;font-weight: bold;color: #666;"
      >Round {{ item.round }}</div>

      <dingyi-data-table
        ref="dt"
        :noLocalPaging="true"
        :toolbar="false"
        :defaultSort="{prop: 'voting_power', order: 'descending'}"
        :btns="{ noFresh: true, index: true }"
        :datas="item.precommits"
        :loading="loading"
        :columns="columns"
      ></dingyi-data-table>
    </div>
  </div>
</template>

<script>
import FlipClock from "../../components/FlipClock/FlipClock.vue";

export default {
  components: {
    FlipClock
  },
  created() {
    // this.fetchGenesis()
    this.loop();
  },
  data() {
    return {
      timer: null,
      loading: false,
      columns: [
        {
          label: "content",
          render: (h, context) => {
            const row = context.props.scope.row;
            return <div>{row}</div>;
          }
        }
      ],
      height_vote_set: []
    };
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async fetchGenesis() {
      const res = await this.$api.fetch("getRpcGenesis");
      if (!res) {
      }
    },
    loop() {
      this.fetchConsensusState()
      this.timer = setInterval(() => {
        this.fetchConsensusState();
      }, 30000);
    },
    async fetchConsensusState() {
      this.loading = true
      const res = await this.$api.fetch("getRpcConsensus_state");
      this.loading = false
      if (!res) return;
      this.height_vote_set = res.height_vote_set;
    }
  }
};
</script>