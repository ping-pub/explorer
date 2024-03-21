<script setup lang="ts">
import { get, post } from "@/libs/http"
import { useBaseStore, useTxDialog } from "@/stores";
import { computed, onMounted, ref } from "vue";
import TextElement from "@/components/dynamic/TextElement.vue";
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { codeToHtml } from 'shiki'
import { useWasmStore } from "@/modules/[chain]/cosmwasm/WasmStore";
import { toBase64 } from "@cosmjs/encoding";

import { JsonViewer } from "vue3-json-viewer"
import { CosmjsOfflineSigner } from "@leapwallet/cosmos-snap-provider";

interface Verification {
  chainId?: string;
  account?: string;
  codeId?: string;
  contract?: string;
  txHash?: string;
  error?: string;
}

interface SourceCode<T> {
  path: string;
  isDirectory: boolean;
  sourceCode?: T;
}

interface Argument {
  format?: string;
  type: string;
  properties: Record<string, Argument>
}

interface Method {
  type: string;
  required: string[];
  properties: Record<string, Argument>
  additionalProperties: boolean;
}

interface Schema {
  $schema: string;
  title: string;
  oneOf?: Method[];
}

const props = defineProps({
  contract: { type: String },
});

const baseurl = "https://prod.compiler.welldonestudio.io"

const verification = ref<Verification>({});
const sourceCode = ref<SourceCode<string>[]>([]);
const schemas = ref<SourceCode<string>[]>([]);
const wasmStore = useWasmStore();
const baseStore = useBaseStore();
const dialog = useTxDialog();
const result = ref<Record<string, any>>({});


function fetchVerification() {
  const url = `${baseurl}/deploy-histories/${chain_id.value}?contract=${props.contract}`
  get(url).then((x) => {
    console.log("verification:", x)
    verification.value = x
  }).catch(e => {
    console.error(e)
  })
}

function fetchSchema() {
  const base = useBaseStore()
  const chainId = base.latest?.block?.header?.chain_id || "neutron-1"
  const url = `${baseurl}/schemas/${chainId}?contract=${props.contract}`
  get(url).then(async (x) => {
    console.log("schema:", x)
    schemas.value = x.sourceCodes
  }).catch(e => {
    console.error(e)
  })
}
  
function fetchSourceCode() {
  const base = useBaseStore()
  const chainId = base.latest?.block?.header?.chain_id || "neutron-1"
  const url = `${baseurl}/source-codes/${chainId}?contract=${props.contract}`
  const theme = baseStore.theme === 'dark' ? 'material-theme' : 'github-light'
  get(url).then(async (x) => {
    console.log("source codes:", x)
    for (let i = 0; i < x.sourceCodes.length; i++) {
      const sc = x.sourceCodes[i];
      sc.sourceCode = await codeToHtml(sc.sourceCode, {lang: sc.path.endsWith('.toml')?'toml':'rust', theme})
    }
    sourceCode.value = x.sourceCodes
  }).catch(e => {
    console.error(e)
  })
}

const base = useBaseStore()
const chain_id = ref("")
base.$subscribe((m, s) => {
  if (chain_id.value !== s.latest?.block?.header?.chain_id) {
    chain_id.value = s.latest?.block?.header?.chain_id || "unknown"
    fetchVerification();
    fetchSchema();
    fetchSourceCode();
  }
})

function verify() {

    const base = useBaseStore()
    const id =  base.latest?.block?.header?.chain_id || "unknown"
    const data = {"contractAddress": props.contract, "chainId": id}

    post(`${baseurl}/verification/neutron`, data).then((x)=> {
        if(x.result) {
          verification.value = x.result
          fetchSchema();
          fetchSourceCode();
        }
    })
}

const tab = ref('verification')
function selectTab(tabName: string) {
  tab.value = tabName
}

const executions = computed(() => {
  return schemas.value
      .filter(x => x.path.indexOf('execute_msg')>-1 || x.path.indexOf('query_msg')>-1)
      .map(x => JSON.parse(x.sourceCode||"{}") as Schema)
  // if(raw && raw.sourceCode) {
  //   return JSON.parse(raw.sourceCode) as Schema
  // } 
  // return {} as Schema
})

const queries = computed(() => {
  let raw = schemas.value.find(x => x.path.indexOf('query_msg')>-1)
  if(raw && raw.sourceCode) {
    return JSON.parse(raw.sourceCode) as Schema
  } 
  return {} as Schema
})

function callFunction(title: string, method: string, arg: Argument) {
  if(!props.contract) return

  // console.log("callFunction", title, method, arg)

  let args = {} as Record<string, any>
  if(arg.properties) Object.keys(arg.properties).forEach(k => {
    const input = document.querySelector(`input[name="${method}-${k}"]`) as HTMLInputElement
    if (input) {
      args[k] = input.value
    }
  })

  //console.log("args", arg.properties, JSON.stringify(args))

  if(title === 'ExecuteMsg') {
    let execution = {} as Record<string, any>
    execution[method] = args 
    console.log("execution", execution)
    dialog.open('wasm_execute_contract', { contract: props.contract, execution})
  } else {
    // QueryMsg
    wasmStore.wasmClient
      .getWasmContractSmartQuery(props.contract, `{"${method}": ${JSON.stringify(args)}}`)
      .then((x) => {
          result.value[`${title}-${method}`] = x;
      })
      .catch((err) => {
        result.value[`${title}-${method}`] = err;
      });
  }
}

</script>
<template>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div role="tablist" class="tabs tabs-boxed">
          <a role="tab" class="tab tooltip tooltip-right tooltip-success" data-tip="Powered By WELLDONE Studio">
            <div class="w-8 rounded">
              <img src="../assets/images/welldone-logo.svg"  alt="Powered By WELLDONE Studio"/>
            </div>
          </a>
          <a role="tab" class="tab" :class="{'tab-active': tab==='verification'}" @click="selectTab('verification')">Verification</a>
          <a role="tab" class="tab" :class="{'tab-active': tab==='executions'}" @click="selectTab('executions')">Functions</a> 
          <a role="tab" class="tab" :class="{'tab-active': tab==='source_code'}" @click="selectTab('source_code')">Source Code</a>
        </div>
        <div class="">
          <div v-if="tab === 'verification'"><DynamicComponent :value="verification"/></div>
          <div v-if="tab === 'executions'" class="">
            <div v-for="{title, oneOf} in executions" class="join join-vertical w-full mt-2">
              <div v-if="oneOf" v-for="m in oneOf">
                <div v-for="(props, method) in m.properties" class="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="my-accordion-1" :checked="false"/> 
                  <div class="collapse-title font-medium">
                    {{title}}::{{ method }}
                  </div>
                  <div class="collapse-content"> 
                    <div v-for="(p, name) in props.properties" class="form-control pb-2">
                      <label class="label">
                          <span class="label-text">{{ name }}</span>
                          <span></span>
                      </label>
                      <input :name="`${method}-${name}`" type="text" :placeholder="p.format" class="input input-sm border border-gray-300 dark:border-gray-600 w-full" />
                    </div>
                    <div>
                      <label v-if="title==='ExecuteMsg'" for="wasm_execute_contract" class="btn btn-sm" @click="callFunction(title, method, props)">{{ method }}</label>
                      <label v-else class="btn btn-sm" @click="callFunction(title, method, props)">{{ method }}</label>
                    </div>
                    <div v-if="result[`${title}-${method}`]" class="mt-2">
                      <JsonViewer :value="result[`${title}-${method}`]" :theme="baseStore.theme||'dark'" style="background: transparent;" copyable boxed sort :expand-depth="5"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tab === 'source_code'" class="mt-2 join join-vertical w-full">
            <div v-for="sc in sourceCode.filter(x => !x.isDirectory)" class="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="sourceCodeAccordion" :checked="false"/> 
              <div class="collapse-title font-medium">{{sc.path}}</div>
              <div class="collapse-content overflow-auto" v-html="sc.sourceCode"></div>
            </div>
          </div>
        </div>
        <div v-show="tab === 'verification'" class="text-center">
            <div v-if="Object.keys(verification).length == 0" >
               Haven't found verification
            </div>
            <button class="btn btn-primary mt-5" @click="verify" v-show="tab === 'verification'" :disabled="verification.error !== undefined">verify</button>
        </div>

        <!-- alert-info -->
        <div
          class="text-[#00cfe8] bg-[rgba(0,207,232,0.12)] rounded shadow mt-4 alert-info"
        >
          <div
            class="drop-shadow-md px-4 pt-2 pb-2"
            style="box-shadow: rgba(0, 207, 232, 0.4) 0px 6px 15px -7px"
          >
            <h2 class="text-base font-semibold">{{ $t('consensus.tips') }}</h2>
          </div>
          <div class="px-4 py-4">
            <ul style="list-style-type: disc" class="pl-8">
              <li>
                {{ $t('cosmwasm.tips_description_1') }}
              </li>
              <li>
                <a href="https://docs.welldonestudio.io/code/verification-api/" target="_blank">Link to Verification API Manual</a>
              </li>
            </ul>
          </div>
        </div>
    </div>
</template>