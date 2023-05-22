<script lang="ts" setup>
import { useFormatter } from '@/stores';
import MdEditor from 'md-editor-v3';
import { computed } from 'vue';

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

const text = computed(() => {
  if(!props.value) return ""
  const v = props.value
  switch(true) {
    case v.length === 28 && v.endsWith("="): {
      return format.validator(v)
    }
  }
  return v
})
</script>
<template>
  <MdEditor
    v-if="isMD()"
    :model-value="format.multiLine(value)"
    previewOnly
    class="md-editor-recover"
  ></MdEditor>
  <span v-else>{{ text }}</span>
</template>

<style lang="scss">
.md-editor-recover {
  .h1,h1 {
    font-size: 2rem;
  }
  .h2,h2 {
    font-size: 1.5rem;
  }
  .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  dl, ol, ul {
    margin-top: 0;
  }
  address, dl, ol, ul {
    margin-bottom: 1rem;
  }
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  a {
      color: #666cff !important;
  }
  .h1 > a, .h2> a, .h3> a, .h4> a, .h5> a, .h6> a, h1> a, h2> a, h3> a, h4> a, h5> a, h6> a { 
    color: inherit !important;
  }

}
</style>