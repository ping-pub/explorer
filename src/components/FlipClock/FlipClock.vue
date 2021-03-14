<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-10 20:40:39
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-12 14:24:14
 * @FilePath: \look-web\src\components\FlipClock\FlipClock.vue
 -->
/*
 * 翻牌时钟
 * @author： 兔子先生
 * @createDate: 2019-11-24
 */
<template>
  <div class="FlipClock">
    <Flipper ref="flipperDay1" frontText="9" />
    <Flipper ref="flipperDay2" />
    <Flipper ref="flipperDay3" />
    <em>-</em>
    <Flipper ref="flipperHour1" />
    <Flipper ref="flipperHour2" />
    <em>:</em>
    <Flipper ref="flipperMinute1" />
    <Flipper ref="flipperMinute2" />
    <em>:</em>
    <Flipper ref="flipperSecond1" />
    <Flipper ref="flipperSecond2" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import Flipper from "./Flipper";

export default {
  name: "FlipClock",
  data() {
    return {
      target: "2020-05-01 10:30:30", // 目标时间
      timer: null,
      flipObjs: []
    };
  },
  components: {
    Flipper
  },
  methods: {
    // 日期时间补零
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    // 计算差值
    calRange() {
      const now = dayjs();
      const diff = dayjs(this.target).diff(now, "s");
      console.log(diff);
      const daySencond = 24 * 60 * 60;
      const diff_day = parseInt(diff / daySencond);
      const diff_senconds = diff - diff_day * daySencond;
      const diff_hours = parseInt(diff_senconds / 60 / 60);
      const diff_mints = diff_senconds - diff_hours * 60 * 60;
      const diff_min = parseInt(diff_mints / 60);
      const diff_s = diff_mints - diff_min * 60;
      console.log(diff_day, diff_hours, diff_min, diff_s);
    },
    testTimer() {
      let target = 9;
      const timer = setInterval(() => {
        this.$refs.flipperDay1.flipDown(target, target - 1);
        target -= 1;
        if (target === 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  },
  mounted() {
    this.calRange();
    this.$nextTick(() => {
      // this.testTimer()
    });
  }
};
</script>

<style>
.FlipClock {
  text-align: center;
}
.FlipClock .M-Flipper {
  margin: 0 3px;
}
.FlipClock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
</style>
