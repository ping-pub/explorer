<script lang="ts" setup>
import AdBanner from '@/components/ad/AdBanner.vue';
import { get } from '@/libs';
import { useBlockchain, useFormatter, useGovStore } from '@/stores';
import { ref, onMounted, computed } from 'vue';

const chainStore = useBlockchain();
const format = useFormatter();
interface FaucetResponse {
    status: string;
    result: any;
    message: string;
}

const address = ref('');
const faucet = ref('');
const balances = ref([]);
const faucetModal = ref(false);
const ret = ref({} as FaucetResponse); 
const configChecker = ref('');

const checklist = computed(() => {
    const endpoint = chainStore.current?.endpoints?.rest
    const bs = balances.value.length > 0 && balances.value.findIndex((v:any) => v.amount <= 10) === -1;
    return [
        { title: 'Rest Endpoint', status: endpoint && endpoint[0].address !== '' },
        { title: 'Faucet Configured', status: chainStore.current?.faucet !== undefined },
        { title: 'Faucet Account', status: faucet.value !== ''},
        { title: 'Faucet Balance', status: bs},
    ];
});

const notReady = computed(() => {
    for (const it of checklist.value) {
        if (!it.status) return true;
    }
    return false;
});

const validAddress = computed(() => {
    if (!address.value) return true;
    return address.value.startsWith(chainStore.current?.bech32Prefix || '1');
});

const faucetUrl = computed(() => {
    return `https://faucet.ping.pub/${chainStore.current?.chainName}`;
    // return `http://localhost:3000/${chainStore.current?.chainName}`;
});


function claim() {
    
    ret.value = {} as FaucetResponse;
    const prefix = chainStore.current?.bech32Prefix || 'cosmos';
    if (!address.value ) return;
    faucetModal.value = true;
    // @ts-ignore
    get(`${faucetUrl.value}/send/${address.value}`).then( (res: FaucetResponse) => {
        console.log(res);
        ret.value = res;
    });
}

function balance() {
    get(`${faucetUrl.value}/balance`).then(res => {
        if(res.status === 'error') {
            configChecker.value = res.message;
            return;
        }
        balances.value = res.result?.balance;
        faucet.value = res.result?.address;
    });
}

onMounted(() => {
    if (chainStore.current && chainStore.current.faucet) {
        balance();
    }
});


</script>
<template>
    <div>
        <div class="flex flex-col items-center justify-center mb-6 mt-14 gap-4">
            <img v-if="chainStore.current?.logo" :src="`${chainStore.current?.logo}`" class="w-16 rounded-md" />
            <div v-else class="w-16 rounded-full">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150.000000 132.000000"
                    preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)" fill="#666CFF" class=""
                        stroke="none">
                        <path d="M500 1310 l-125 -5 -182 -315 c-100 -173 -182 -321 -182 -329 -1 -7
            81 -159 181 -337 l183 -324 372 0 371 0 186 325 c102 179 186 330 186 337 0 7
            -82 157 -182 335 l-183 323 -250 -2 c-137 -1 -306 -5 -375 -8z m588 -454 c61
            -106 112 -197 112 -201 0 -4 -50 -95 -111 -201 l-112 -194 -231 0 -231 0 -105
            181 c-58 100 -109 190 -114 200 -6 14 17 63 104 213 l112 196 232 0 231 0 113
            -194z" />
                        <path d="M591 1001 l-54 -6 -87 -150 -88 -150 176 -3 c97 -1 181 -1 187 2 9 3
            165 267 183 308 4 9 -233 7 -317 -1z" />
                        <path d="M872 824 l-90 -159 36 -66 c113 -201 147 -258 153 -251 8 8 179 302
            179 307 0 2 -37 68 -83 147 -46 78 -88 151 -94 162 -9 16 -24 -5 -101 -140z" />
                        <path d="M360 625 c0 -7 148 -263 172 -297 l19 -28 186 0 c101 0 183 3 181 8
            -1 4 -43 78 -93 165 l-90 157 -187 0 c-104 0 -188 -2 -188 -5z" />
                    </g>
                </svg>
            </div>
            <h1 class="text-primary text-3xl md:!text-6xl font-bold capitalize">
                {{ chainStore.chainName }} Faucet
            </h1>
        </div>
        <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
            <h2 class="card-title">Get Tokens</h2>
            <input type="text" v-model="address" class="mt-4 mb-4 w-full border border-gray-300 rounded-md p-2"
                :class="{'input-error' : !validAddress}"
                :disabled="notReady" placeholder="Enter your address" />
            <button class="btn btn-primary w-full bg-primary text-white" :disabled="notReady" @click="claim()">Get
                Tokens</button>
        </div>

        <AdBanner id="home-banner-ad" unit="banner" />

        <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
            <h2 class="card-title">Enable Faucet</h2>
            <div class="mt-4">
                <span class="text-base"> 1. Submit chain configuation</span>
                <div class="mockup-code bg-base-200 my-2 gap-4">
                    <div v-for="it in checklist">
                        <pre><code class="text-gray-800 dark:invert">{{ it.title }}: </code>{{ it.status ? '✅' : '❌' }} </pre>
                    </div>

                    <pre class=" text-xs text-red-500">{{ configChecker }}</pre>
                    <pre></pre>
                    <a class=" btn-ghost text-white rounded-md p-2 ml-4"
                        href="https://github.com/ping-pub/ping.pub/blob/main/faucet.md">Update</a>
                </div>

                <span class="text-base"> 2. Fund the faucet account</span>
                <div class="mockup-code bg-base-200 my-2">
                    <pre data-prefix=">"><code class=" text-gray-800 dark:invert"> Faucet Address: {{ faucet }} </code></pre>
                    <pre
                        data-prefix=">"><code class="text-gray-800 dark:invert"> Balances: {{ format.formatTokens(balances) }} </code></pre>
                </div>
            </div>
        </div>
        <input type="checkbox" v-model="faucetModal" id="my_modal_6" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box">
                <div v-if="ret.status === 'error'">
                    <h3 class="font-bold text-red-500"> Error </h3>
                    <div>{{ ret.message }}</div>
                </div>
                <div v-else-if="ret.status === 'ok'">
                    <h3 class="font-bold text-green-500"> Token Sent! </h3>
                    <div class=" text-center mt-4"><RouterLink :to="`/${chainStore.chainName}/tx/${ret.result.txhash}`">View Transaction</RouterLink></div>
                </div>
                <h3 v-else class="font-bold text-lg"> Processing <span class="loading loading-bars loading-sm"></span> </h3>
 
                <div class="modal-action">
                    <label for="my_modal_6"  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                </div>
                <p class="py-2">
                <div>
                    <AdBanner id="popup-ad" unit="popup" />
                </div>
                </p>
            </div>
        </div>
    </div>
</template>
