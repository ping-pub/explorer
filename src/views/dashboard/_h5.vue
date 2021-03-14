<!--
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-22 19:19:39
 * @LastEditors: dingyi
 * @lastTime: 2020-12-11 10:21:07
 * @FilePath: \look-web\src\views\dashboard\_h5.vue
 -->
<template>
  <div>
    <!-- <div>
      <van-button @click="goAddChain" icon="plus" block>{{ $t(`message.createNewChain`) }}</van-button>
    </div> -->
    <van-cell-group v-for="(item, key) of chains" :title="key === 'Mainnet' ? $t(`message.mainnet`) : key === 'Testnet' ? $t(`message.testnet`) : key" :key="key">
      <!--   :value="el.version" -->
      <van-cell
        center
        v-for="(el, index) of item"
        :key="index"
        :title="el.name"
        is-link
         @click="switchChain(el)"
      >
      <div slot="icon">
        <img :src="el.logo" style="width: 30px;height: 30px;margin-right: 10px;" alt="">
      </div>
      </van-cell>
      <div v-if="item.length === 0" style="padding: 20px 15px;">
        <van-button round block color="#343a40" icon="plus">New Chain</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import mixinData from "./mixinData";

export default {
  mixins: [mixinData]
};
</script>