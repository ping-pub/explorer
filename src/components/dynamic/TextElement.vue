<script lang="ts" setup>
import { isBech32Address } from '@/libs/utils';
import { useBlockchain, useFormatter } from '@/stores';
import MdEditor from 'md-editor-v3';
import { computed, onMounted, ref } from 'vue';
import nameMatcha from '@leapwallet/name-matcha'

const chainStore = useBlockchain()
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

function isAddress() {
  return isBech32Address(props.value) && String(props.value).indexOf('valoper1') === -1
}

const text = computed(() => {
  if(!props.value) return ""
  const v = props.value
  switch(true) {
    case v.length === 28 && v.endsWith("="): {
      return format.validator(v) || v
    }
    // 2023-06-12T03:09:38.253756368Z
    case v.search(/^[1-9]\d{3}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}:\d{2}[.\d]*Z$/g) > -1: {
      return new Date(v).toLocaleString(navigator.language)
    }
  }
  return v
})

const names = ref([] as {name?: string | null, provider?: string}[])

onMounted(() => {
  if(isAddress()) nameMatcha.lookupAll(props.value).then(re => {
    names.value = Object.keys(re).map(key => ({name: re[key], provider: key})).filter( x => x.name)
  })
})

</script>
<template>
  <MdEditor
    v-if="isMD()"
    :model-value="format.multiLine(value)"
    previewOnly
    class="md-editor-recover"
  ></MdEditor>
  <span v-else-if="isAddress()" class="flex">
    <RouterLink :to="`/${chainStore.chainName}/account/${text}`">{{ text }}</RouterLink>
    <div v-for="{name, provider} in names">
      <span class="text-xs truncate relative py-1 px-2 p2-4 w-fit ml-2 rounded text-success tooltip" :data-tip="provider" :title="provider">
        <span class="inset-x-0 inset-y-0 opacity-10 absolute bg-success"></span>
        <button>{{ name }}</button>
      </span>
    </div>
  </span>  
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