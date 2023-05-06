<script lang="ts" setup>
import { useFormatter } from '@/stores';
import MdEditor from 'md-editor-v3';

const props = defineProps(['value']);
const format = useFormatter();
function isMD() {
  if (
    props.value &&
    (props.value.indexOf('\n') > -1 || props.value.indexOf('\\n') > -1)
  ) {
    return true;
  }
  return false;
}
</script>
<template>
  <MdEditor
    v-if="isMD()"
    :model-value="format.multiLine(value)"
    previewOnly
  ></MdEditor>
  <span v-else>{{ value }}</span>
</template>
