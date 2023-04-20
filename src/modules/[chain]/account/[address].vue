<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import 'vue-json-pretty/lib/styles.css';
import type { AuthAccount, Delegation, TxResponse, DelegatorRewards } from '@/types';
import type { Coin } from '@cosmjs/amino';

const props = defineProps(['address', 'chain'])

const blockchain = useBlockchain()
const format = useFormatter()
const account = ref({} as AuthAccount)
const txs = ref({} as TxResponse[])
const delegations = ref([] as Delegation[])
const rewards = ref({} as DelegatorRewards)
const balances = ref([] as Coin[])
const totalAmount = computed(()=> {
    let total = 0;
    delegations.value?.forEach(x => {
        total += Number(x.balance.amount)
    })
    rewards.value?.total?.forEach(x => {
        total += Number(x.amount)
    })
    balances.value?.forEach(x => {
        total += Number(x.amount)
    })
    return total
})


function loadAccount(address: string) {
    blockchain.rpc.getAuthAccount(address).then(x => {
        account.value = x.account
    })
    blockchain.rpc.getTxsBySender(address).then(x => {
        txs.value = x.tx_responses
    })
    blockchain.rpc.getDistributionDelegatorRewards(address).then(x => {
        rewards.value = x
    })
    blockchain.rpc.getStakingDelegations(address).then(x => {
        delegations.value = x.delegation_responses
    })
    blockchain.rpc.getBankBalances(address).then(x => {
        balances.value = x.balances
    })
}
loadAccount(props.address)
</script>
<template>
    <div v-if="account">
        <VCard>
            <VList>
                <VListItem>
                <template #prepend>
                    <VAvatar
                    rounded
                    variant="tonal"
                    size="45"
                    color="primary"
                    >
                        <VIcon icon="mdi-qrcode" />
                    </VAvatar>
                </template>

                <VListItemTitle class="text-sm font-weight-semibold">
                    Address:
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                    {{ address }}
                </VListItemSubtitle>
                </VListItem>
            </VList>
        </VCard>

        <VCard class="mt-5">
            <VCardTitle>Assets</VCardTitle>
            <VCardItem>
            <VRow>
                <VCol cols="12" md="4">
                    xx
                </VCol>
                <VCol cols="12" md="8">
                    <VList class="card-list">
                        <VListItem v-for="v in balances">
                        <template #prepend>
                            <VAvatar
                            rounded
                            variant="tonal"
                            size="45"
                            color="success"
                            >
                                <VIcon icon="mdi-card" />
                            </VAvatar>
                        </template>
                        <VListItemTitle class="text-sm font-weight-semibold">
                            {{ format.formatToken(v) }}
                        </VListItemTitle>
                        <VListItemSubtitle class="text-xs">
                            ≈${{ 0 }}
                        </VListItemSubtitle>
                        <template #append>
                            <VChip color="primary">{{ format.calculatePercent(v.amount, totalAmount) }}</VChip>
                        </template>
                        </VListItem>
                        <VListItem v-for="v in delegations">
                        <template #prepend>
                            <VAvatar
                            rounded
                            variant="tonal"
                            size="45"
                            color="info"
                            >
                                <VIcon icon="mdi-lock" />
                            </VAvatar>
                        </template>

                        <VListItemTitle class="text-sm font-weight-semibold">
                            {{ format.formatToken(v.balance) }}
                        </VListItemTitle>
                        <VListItemSubtitle class="text-xs">
                            ≈${{ 0 }}
                        </VListItemSubtitle>
                        <template #append>
                            <VChip color="primary">{{ format.calculatePercent(v.balance.amount, totalAmount) }}</VChip>
                        </template>
                        </VListItem>
                        <VListItem v-for="v in rewards.total">
                        <template #prepend>
                            <VAvatar
                            rounded
                            variant="tonal"
                            size="45"
                            color="warning"
                            >
                                <VIcon icon="mdi-up" />
                            </VAvatar>
                        </template>

                        <VListItemTitle class="text-sm font-weight-semibold">
                            {{ format.formatToken(v) }}
                        </VListItemTitle>
                        <VListItemSubtitle class="text-xs">
                            ≈${{ 0 }}
                        </VListItemSubtitle>
                        <template #append>
                            <VChip color="primary">{{ format.calculatePercent(v.amount, totalAmount) }}</VChip>
                        </template>
                        </VListItem>
                    </VList>
                    <VDivider class="my-2"></VDivider>
                    {{ totalAmount }}
                </VCol>
            </VRow>
            </VCardItem>
        </VCard>

        <VCard class="my-5">
            <VCardItem>
                <VCardTitle>Delegations</VCardTitle>
                <VTable>
                    <thead>
                        <tr><th>Validator</th><th>Delegation</th><th>Rewards</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in delegations">
                            <td>{{ format.validatorFromBech32(v.delegation.validator_address) }} </td>
                            <td>{{ format.formatToken(v.balance, true, "0,0.[00]") }} </td>
                            <td>{{ format.formatTokens(rewards?.rewards?.find(x => x.validator_address ===v.delegation.validator_address)?.reward) }} </td>
                            <td>
                                action
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </VCardItem>
        </VCard>
        <VCard class="my-5">
            <VCardItem>
                <VCardTitle>Transactions</VCardTitle>
                <VTable>
                    <thead>
                        <tr><th>Height</th><th>Hash</th><th>Messages</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in txs">
                            <td>{{ v.height }} </td>
                            <td class="text-truncate" style="max-width: 200px;">{{ v.txhash }} </td>
                            <td>
                                {{ format.messages(v.tx.body.messages) }}
                                <VIcon v-if="v.code === 0" icon="mdi-check" color="success"></VIcon>
                                <VIcon v-else icon="mdi-multiply" color="error"></VIcon> </td>
                            <td>{{ format.toDay(v.timestamp, "from") }}</td>
                        </tr>
                    </tbody>
                </VTable>
            </VCardItem>
        </VCard>
        <VCard>
            <VCardItem>
                <VCardTitle>Account</VCardTitle>
                <DynamicComponent :value="account"/>
            </VCardItem>
        </VCard>
    </div>
    <div v-else>
        Account does not exists on chain
    </div>
</template>
<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 5px;
}
</style>