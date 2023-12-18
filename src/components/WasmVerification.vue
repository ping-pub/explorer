<script setup lang="ts">
import { get, post } from "@/libs/http"
import { useBaseStore } from "@/stores";
import { computed, onMounted, ref } from "vue";

import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';

interface Verification {
  chainId?: string;
  account?: string;
  codeId?: string;
  contract?: string;
  txHash?: string;
  error?: string;
}

const props = defineProps({
  contract: { type: String },
});

const baseurl = "https://prod.compiler.welldonestudio.io"

const verification = ref<Verification>({});

onMounted(() => {

  const base = useBaseStore()
  const chainId = base.latest?.block?.header?.chain_id || "neutron-1"
  // console.log("mounted", `${baseurl}/deploy-histories/neutron?contract=${props.contract}`, chainId.value)
  const url = `${baseurl}/deploy-histories/${chainId}?contract=${props.contract}`
  console.log("url:", url)
  get(url).then((x) => {
    console.log("verification:", x)
    verification.value = x
  }).catch(e => {
    console.error(e)
  })
})

function verify() {

    const base = useBaseStore()
    const id =  base.latest?.block?.header?.chain_id || "unknown"
    const data = {"contractAddress": props.contract, "chainId": id}

    post(`${baseurl}/verification/neutron`, data).then((x)=> {
        if(x.result) verification.value = x.result
    })
}

</script>
<template>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div class="flex justify-between">
            <span><h2 class="card-title truncate w-full mt-4 text-left">Verification</h2></span>
            <span class="avatar tooltip tooltip-left" data-tip="Powered By WELLDONE Studio">
                <div class="w-8 rounded">
                    <img src="../assets/images/welldone-logo.svg"  alt="Powered By WELLDONE Studio"/>
                </div>
            </span>
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
        <div><DynamicComponent :value="verification"/></div>
        <div class="text-center">
            <div v-if="Object.keys(verification).length == 0" >
                <Icon icon="mdi:emoticon-sad-outline"></Icon>Haven't found verification
            </div>
            <button class="btn btn-primary mt-5" @click="verify" :disabled="verification.error !== undefined">verify</button>
        </div>
    </div>
</template>