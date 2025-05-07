<script lang="ts" setup>
import { isBech32Address } from '@/libs/utils';
import { useBlockchain, useFormatter } from '@/stores';
import MdEditor from 'md-editor-v3';
import { computed, onMounted, ref } from 'vue';
import nameMatcha from '@leapwallet/name-matcha';
import { fromBase64, toHex } from '@cosmjs/encoding';

const chainStore = useBlockchain()
const props = defineProps(['value']);
const format = useFormatter();
function isMD() {
  if (
    props.value &&
    (String(props.value).indexOf('\n') > -1 || String(props.value).indexOf('\\n') > -1)
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
  const v = String(props.value)
  switch(true) {
    case v.length === 28 && v.endsWith("="): {
      return format.validator(v) || v
    }
    // 2023-06-12T03:09:38.253756368Z
    case v.search(/^[1-9]\d{3}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}:\d{2}[.\d]*Z$/g) > -1: {
      return new Date(v).toLocaleString(navigator.language)
    }
    case toHexOutput.value:
      return toHex(fromBase64(v)).toUpperCase()
  }
  return v
})

const names = ref([] as {name?: string | null, provider?: string}[])

onMounted(() => {
  if(isAddress()) nameMatcha.lookupAll(props.value).then(re => {
    names.value = Object.keys(re).map(key => ({name: re[key], provider: key})).filter( x => x.name)
  })
})
const toHexOutput = ref(false)
const isConvertable = computed(() => {
  return String(props.value).endsWith('=') && props.value.length !== 28
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
  <span v-else class="flex"><span class="break-words max-w-5xl">{{ text }}</span>
    <span v-if="isConvertable" @click="toHexOutput = !toHexOutput" class="ml-2 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </span> 
  </span>
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
