<script lang="ts" setup>
import DynamicComponent from './DynamicComponent.vue';
import {select} from './index'

const props = defineProps(["value"]);
const tab = ref("")
</script>
<template>
    <div>
        <VTabs v-model="tab">
            <VTab v-for="(v, k) of value" :value="k">{{ k }}</VTab>
        </VTabs>
        <VWindow v-model="tab" style="min-height: 25px;">
            <VWindowItem v-for="(v, k) of value" :value="k"><DynamicComponent :value="v"/></VWindowItem>
        </VWindow>
    </div>
</template>