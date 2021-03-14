<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-12 12:41:16
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-28 08:34:12
 * @FilePath: /look-web/src/views/governance/RateBar.vue
 -->
<template>
  <div class="flex-center" style="align-items:flex-end;align-self: flex-end;justify-content: center;">
    <div
      class="ratebar-item"
      :style="{ width: barWidth }"
      v-for="(item, index) of data"
      :key="index"
    >
      <div>{{ item.label || item.value }}</div>
      <div
        class="rateline-line"
        :style="{
          height: item.value * baseHeight + 'px',
          background: item.bg,
          width: lineWidth
        }"
      ></div>
      <div
        v-if="item.line"
        class="ratebar-scale"
        :style="{ top: '-' +item.line * baseHeight + 'px' }"
      ></div>
      <div
        class="ratebar-text"
      >{{ item.type === 'Yes' ? $t(`message.governance_Yes`) : item.type === 'Abstain' ? $t(`message.governance_Abstain`) : item.type === 'No' ? $t(`message.governance_No`) : item.type === 'No Veto' ? $t(`message.governance_NoVeto`) : item.type === 'Join' ? $t(`message.governance_Join`) : '' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    barWidth: {
      default: "50px"
    },
    lineWidth: {
      default: "20px"
    },
    baseHeight: {
      default: 100
    },
    data: {
      default() {
        return [
          { type: "Yes", value: 1, bg: "#52c41a", line: 0.5 },
          { type: "No", value: 0.3, bg: "#faad14", line: 0.334 },
          { type: "Abstain", value: 0.3, bg: "#e66", line: null },
          { type: "No Veto", value: 0.2, bg: "#ddd", line: null }
        ];
      }
    }
  }
};
</script>

<style scoped>
.ratebar-item {
  color: #343a40;
  width: 50px;
  text-align: center;
}
.rateline-line {
  width: 20px;
  margin: 0 auto;
}
.ratebar-text {
  font-size: 10px;
}
.ratebar-scale {
  width: 30px;
  margin: 0 auto;
  position: relative;
  border-top: 1px dashed #e66;
}
</style>
