<script setup lang="ts">
import { useBlockchain, useFormatter, useMintStore, useStakingStore } from '@/stores';
import { onMounted, computed, ref } from 'vue';
import ValidatorCommissionRate from '@/components/ValidatorCommissionRate.vue'
import { consensusPubkeyToHexAddress, operatorAddressToAccount, pubKeyToValcons, valoperToPrefix } from '@/libs';
import type { Coin, Delegation, PaginatedTxs, Validator } from '@/types';

const props = defineProps(['validator', 'chain'])

const staking = useStakingStore()
const blockchain = useBlockchain()
const format = useFormatter()

const validator: string = props.validator

const v = ref({} as Validator)
const cache = JSON.parse(localStorage.getItem('avatars')||'{}')
const avatars = ref( cache || {} )
const identity = ref("")
const rewards = ref([] as Coin[]|undefined)
const addresses = ref({} as {
    account: string
    operAddress: string
    hex: string
    valCons: string,
})
const selfBonded = ref({} as Delegation)

addresses.value.account = operatorAddressToAccount(validator)
// load self bond
staking.fetchValidatorDelegation(validator, addresses.value.account).then(x => {
    if(x) {
        selfBonded.value = x.delegation_response
    }
})

const txs = ref({} as PaginatedTxs)

blockchain.rpc.getTxsBySender(addresses.value.account).then(x => {
    console.log("txs", x)
    txs.value = x
})

const apr = computed(()=> {
    const rate = v.value.commission?.commission_rates.rate || 0
    const inflation = useMintStore().inflation
    if(Number(inflation)) {
        return format.percent((1 - Number(rate)) * Number(inflation))
    }
    return "-"
})

const selfRate = computed(()=> {
    if(selfBonded.value.balance?.amount) {
        return format.calculatePercent(selfBonded.value.balance.amount, v.value.tokens)
    }
    return "-"
})

onMounted(()=> {
    if(validator) {
        staking.fetchValidator(validator).then(res => {
            v.value = res.validator
            identity.value = res.validator?.description?.identity || ''
            if(identity.value && !avatars.value[identity.value]) {
                console.log(identity.value, avatars)
                staking.keybase(identity.value).then(d => {
                if (Array.isArray(d.them) && d.them.length > 0) {
                    const uri = String(d.them[0]?.pictures?.primary?.url).replace("https://s3.amazonaws.com/keybase_processed_uploads/", "")
                    if(uri) {
                      avatars.value[identity.value] = uri
                      localStorage.setItem('avatars', JSON.stringify(avatars.value))
                    }
                }
            })
            }
            const prefix = valoperToPrefix(v.value.operator_address) || '<Invalid>'            
            addresses.value.hex = consensusPubkeyToHexAddress(v.value.consensus_pubkey)
            addresses.value.valCons = pubKeyToValcons(v.value.consensus_pubkey, prefix)
        })
        blockchain.rpc.getDistributionValidatorOutstandingRewards(validator).then(res => {
            rewards.value = res.rewards?.rewards
        })
    }
    
})

</script>
<template>
    <div>
    <VCard class="card-box">
        <VCardItem>
            <VRow>
                <VCol cols="12" md="6">
                    <div class="d-flex pl-2">
                        <VAvatar icon="mdi-help-circle-outline" :image="avatars[identity]" size="90" rounded variant="outlined" color="secondary"/>
                        <div class="mx-2">
                            <h4>{{ v.description?.moniker }}</h4>
                            <div class="text-sm mb-2">{{ v.description?.identity || '-'}}</div>
                            <VBtn>Delegate</VBtn>
                        </div>
                    </div>
                    <VSpacer/>
                    <VCardText>
                        <p class="text-xs">
                            About Us
                        </p>
                        <VList class="card-list">
                            <VListItem prepend-icon="mdi-web">
                                <span>Website: </span><span> {{ v.description?.website || '-' }}</span>
                            </VListItem>
                            <VListItem prepend-icon="mdi-phone">
                                <span>Contact: </span><span> {{ v.description?.security_contact }}</span>
                            </VListItem>
                        </VList>

                        <p class="text-xs mt-3">
                           Validator Status
                        </p>
                        <VList class="card-list">
                            <VListItem prepend-icon="mdi-check">
                                <span>Status: </span><span> {{ v.status }}</span>
                            </VListItem>
                            <VListItem prepend-icon="mdi-lock">
                                <span>Jailed: </span><span> {{ v.jailed }}</span>
                            </VListItem>
                        </VList>
                    </VCardText>
                    
                </VCol>
                <VCol cols="12" md="6">
                    <div class="d-flex flex-column py-3 justify-space-between"> 
                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-coin"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ format.formatToken2({amount: v.tokens, denom: staking.params.bond_denom}) }}</h4>
                                <span class="text-sm">Bonded Tokens</span>
                            </div>
                        </div>
                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-percent"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ format.formatToken(selfBonded.balance) }} ({{ selfRate }})</h4>
                                <span class="text-sm">Self Bonded</span>
                            </div>
                        </div>

                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-flag"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ v.minSelfDelegation }} {{ staking.params.bond_denom }}</h4>
                                <span class="text-sm">Min Self Delegation:</span>
                            </div>
                        </div>
                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-coin"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ apr }}</h4>
                                <span class="text-sm">Annual Profit</span>
                            </div>
                        </div>

                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-pound"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ v.unbonding_height }}</h4>
                                <span class="text-sm">Unbonding Height</span>
                            </div>
                        </div>

                        <div class="d-flex">
                            <VAvatar color="secondary" rounded variant="outlined" icon="mdi-clock"></VAvatar> 
                            <div class="ml-3 d-flex flex-column justify-center">
                                <h4>{{ format.toDay(v.unbonding_time, 'from') }}</h4>
                                <span class="text-sm">Unbonding Time</span>
                            </div>
                        </div>
                    </div>
                </VCol>
            </VRow>
            <VDivider />
            <VCardText>{{ v.description?.details }}</VCardText>
        </VCardItem>
    </VCard>

    <VRow class="mt-3">
        <VCol md="4" sm="12">
            <ValidatorCommissionRate :commission="v.commission"></ValidatorCommissionRate>
        </VCol>
        <VCol md="4" sm="12">
            <VCard title="Outstanding Rewards" class="h-100">
                <VList>
                    <VListItem v-for="(i, k) in rewards" :key="`reward-${k}`">
                        <VAlertTitle>{{ format.formatToken2(i) }}</VAlertTitle>
                    </VListItem>
                </VList>
            </VCard>
        </VCol>
        <VCol md="4" sm="12">
            <VCard title="Addresses" class="h-100">
                <VList class="pt-0">
                    <VListItem>
                        <VListItemTitle>Account</VListItemTitle>
                        <VListItemSubtitle class="text-caption">{{ addresses.account }}</VListItemSubtitle>
                    </VListItem>
                    <VListItem>
                        <VListItemTitle>Operator Address</VListItemTitle>
                        <VListItemSubtitle class="text-caption">{{ v.operator_address }}</VListItemSubtitle>
                    </VListItem>
                    <VListItem>
                        <VListItemTitle>Hex Address</VListItemTitle>
                        <VListItemSubtitle class="text-caption">{{ addresses.hex }}</VListItemSubtitle>
                    </VListItem>
                    <VListItem>
                        <VListItemTitle>Signer Address</VListItemTitle>
                        <VListItemSubtitle class="text-caption">{{ addresses.valCons }}</VListItemSubtitle>
                    </VListItem>
                </VList>
            </VCard>
        </VCol>
    </VRow>
    <VCard title="Transactions" class="mt-5">
        <VCardItem class="pt-0">
            <VTable>
            <thead>
                <th class="text-left pl-4">Height</th>
                <th class="text-left pl-4">Hash</th>
                <th class="text-left pl-4" width="40%">Messages</th>
                <th class="text-left pl-4">Time</th>
            </thead>
            <tbody>
                <tr v-for="(item, i) in txs.tx_responses">
                    <td>{{ item.height }}</td>
                    <td class="text-truncate" style="max-width: 200px;">{{ item.txhash }}</td>
                    <td>{{ format.messages(item.tx.body.messages) }}</td>
                    <td width="150">{{ format.toDay(item.timestamp,'from') }}</td>
                </tr>
            </tbody>
            </VTable>
        </VCardItem>
    </VCard>
    </div>
</template>
<style>
.card-list {
    --v-card-list-gap: 10px;
}
</style>
