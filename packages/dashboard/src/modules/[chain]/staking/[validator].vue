<script setup lang="ts">
import { useStakingStore } from '@/stores';
import type { QueryValidatorResponseSDKType } from '@ping-pub/codegen/src/cosmos/staking/v1beta1/query';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const staking = useStakingStore()
const { validator } = route.params
const v = ref({} as QueryValidatorResponseSDKType)
const cache = JSON.parse(localStorage.getItem('avatars')||'{}')
const avatars = ref( cache || {} )
const identity = ref("")

onMounted(()=> {
    if(validator) {
        staking.fetchValidator(validator.toString()).then(res => {
            v.value = res.validator
            identity.value = res.validator?.description?.identity
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
        })
    }
    
})

</script>
<template>
    <VCard class="card-box">
        <VCardItem>
            <VRow>
                <VCol cols="12" md="6">
                    <VAvatar icon="mdi-help-circle-outline" :image="avatars[identity]" size="80" rounded variant="outlined" color="secondary"/>
                    <VList>
                        <VListItem>
                            <VListItemTitle>{{ v.description?.moniker }}</VListItemTitle>
                            <VListItemSubtitle> {{ v.description?.website || v.description?.identity || '-'}}</VListItemsubtitle>
                        </VListItem>
                    </VList>
                </VCol>
                <VCol cols="12" md="6">2</VCol>
            </VRow>
        </VCardItem>
    </VCard>
</template>