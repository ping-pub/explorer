<script lang="ts" setup>
import type { PropType } from 'vue';
import { isToken,isStringArray,isHexAddress } from '@/libs/utils'
import TableItemParameter from '@/components/TableItemParameter.vue'
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';

const props = defineProps({
    tableItem: {
        type: Object,
    },
})

function formatTitle(name: string) {
  return String(name).replaceAll('_', ' ');
}
function isTokenField (value: string){
    return value ? isToken(value) : false
}

function formatTokens (name: string){
    return String(name).replaceAll('_', ' ')
}
function isArrayText (value: string){
    return value ? isStringArray(value) : false
    
}
function isHex(value: string) {
    return value ? isHexAddress(value) : false
}
function formatHexAddress(v:any) {
      return 2
    //   getStakingValidatorByHex(this.$http.config.chain_name, v)
}
</script>

<!-- <template>
  <div class="bg-card px-4 pt-3 pb-4 rounded mt-">
    <div class="text-base mb-3 text-main">{{ props.tableItem?.title }}</div>
    <div class="">
      <div
        class="flex flex-nowrap"
        v-for="(item, index) of props.tableItem?.items"
        :key="index"
      >
        <div class="mr-6">{{ formatTitle(item?.subtitle) }}</div>
        <div class="flex-1">{{ item?.value }}</div>
        <div>{{ typeof item?.value }}</div>
      </div> -->



<template>
    <div class="d-table">
        <div class="flex  flex-nowrap" v-for="(item,index ) of props.tableItem" :key="index">
            <DynamicComponent :value="item"/>
        </div>
    </div>
</template>
