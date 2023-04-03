
<script lang="ts" setup>
import TextElement from './TextElement.vue'
import ObjectElement from './ObjectElement.vue'
import { select } from './index'

const props = defineProps(["value"]);
</script>
<template>
    <Component :is="select(value)" :value="value"></Component>
</template>