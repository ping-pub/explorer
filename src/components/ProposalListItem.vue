<script lang="ts" setup>
import MdEditor from 'md-editor-v3';
import { useBlockchain, useFormatter, useStakingStore } from '@/stores';
import type { GovProposal, PaginatedProposals } from '@/types';
import ProposalProcess from './ProposalProcess.vue';
import type { PropType } from 'vue';

const props = defineProps({
  proposals: { type: Object as PropType<PaginatedProposals>},
})
// const list = computed(()=> proposl)
const format = useFormatter()
const staking = useStakingStore()
const chain = useBlockchain()
function showType(v: string){
    if(v) {
        return v.substring(v.lastIndexOf('.')+1)
    }
    return v 
}
</script>
<template>
    <VExpansionPanels variant="accordion">
            <VExpansionPanel v-for="(x, i) in proposals?.proposals">
              <VExpansionPanelTitle disable-icon-rotate>
                    <VChip label color="primary" class="mr-2">{{x.proposal_id}}</VChip>
                    <div class="w-100"><VChip label>{{ showType(x.content['@type']) }}</VChip> {{ x.content?.title }}
                      <div class="d-flex mt-1">
                        <small class="text-secondary me-auto"> {{ format.toDay(x.voting_end_time, 'from') }}</small>      
                        <ProposalProcess style="width:300px;" :pool="staking.pool" :tally="x.final_tally_result"></ProposalProcess> 
                        <span></span>
                      </div>              
                    </div>
                <template #actions>    
                  <VIcon
                    v-if="x.status === 'PROPOSAL_STATUS_PASSED'"
                    icon="mdi-check"
                    color="success"
                    class="ml-2"
                  />
                  <VIcon
                    v-if="x.status === 'PROPOSAL_STATUS_REJECTED'"
                    icon="mdi-multiply"
                    color="error"
                    class="ml-2"
                  />
                </template>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VCard class="card-box">         
                  <VCardText>
                    <MdEditor :model-value="format.multiLine(x.content?.description)" previewOnly></MdEditor> 
                  </VCardText>
                  <div class="text-center w-100 my-2">
                    <VBtn :to="`/${chain.chainName}/gov/${x.proposal_id}`" color="primary" variant="flat" size="small">Detail</VBtn> 
                    <VBtn color="primary" variant="flat" class="ml-2" size="small">Vote</VBtn> 
                  </div>
                </VCard>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>    
</template>