<!--
 * @Description: /cdp/accounts
 * @Autor: dingyi
 * @Date: 2020-06-29 23:00:19
 * @LastEditors: dingyi
 * @LastEditTime: 2020-06-30 15:56:21
 * @FilePath: /look-web/src/views/governance-id-kava/_pc.vue
--> 

<template>
  <div v-loading="loading">
    <div class="bg-white" style="padding: 10px 15px;margin-bottom: 10px;">
      <div class="list-title">Committee</div>
      <div>
        <div>
          <span style="display:inline-block;width: 140px;">id</span>
          <span>{{ item.id }}</span>
        </div>
        <div>
          <span style="display:inline-block;width: 140px;">description</span>
          <span>{{ item.description }}</span>
        </div>
        <div>
          <span style="display:inline-block;width: 140px;">vote_threshold</span>
          <span>{{ item.vote_threshold }}</span>
        </div>
        <div>
          <span style="display:inline-block;width: 140px;">proposal_duration</span>
          <span>{{ item.proposal_duration }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white" style="padding: 10px 15px;margin-bottom: 10px;">
      <div class="list-title">Members</div>
      <div v-for="(one,key) of item.members" :key="key" style="margin-bottom: 5px;">
        <el-tag>{{one}}</el-tag>
      </div>
    </div>

    <div>
      <div class="list-title">Permissions</div>
      <div >
        <div v-for="(one, key) of item.permissions" :key="key" class="bg-white" style="padding: 10px 15px;margin-bottom: 10px;">
          <div class="list-title" style="border-bottom: 1px solid #eee;padding-bottom: 10px;">{{ one.type }}</div>
          <div v-for="(el, x) of one.value" :key="x">
            <div style="font-size: 16px;margin-bottom: 10px;border-left: 3px solid #2e3338;padding-left: 5px;">{{ x }}</div>
            <div>
              <div v-for="(obj, b) of el" :key="b">
                <el-tag
                  style="margin-right: 10px;margin-bottom: 10px;"
                  type="primary"
                  v-for="(val, a) of obj"
                  :key="a"
                >{{ a }} : {{ val }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  activated() {
    this.init()
  },
  data() {
    return {
      loading: false,
      item: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      const id = this.$route.params.id;
      const res = await this.$axios.get(`/committee/committees/${id}`, {
        headers: { server: window.chain.lcd }
      });
      this.loading = false;
      this.item = res.result;
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