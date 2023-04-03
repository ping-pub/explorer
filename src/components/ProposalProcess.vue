<script lang="ts" setup>
import { useFormatter } from '@/stores';
import { computed } from '@vue/reactivity';
import { ref, type PropType } from 'vue';


const props = defineProps({
  tally: { type: Object as PropType<{
    yes: string,
    no: string,
    noWithVeto: string,
    abstain: string
  }>},
  pool: {
    type: Object as PropType<{
        notBondedTokens: string;
        bondedTokens: string;
    }>,
  },
})
const format = useFormatter()
const yes = computed(() => (format.calculatePercent(props.tally?.yes, props.pool?.bondedTokens)))
const no = computed(() => ref(format.calculatePercent(props.tally?.no, props.pool?.bondedTokens)))
const abstain = computed(() => (format.calculatePercent(props.tally?.abstain, props.pool?.bondedTokens)))
const veto = computed(() => (format.calculatePercent(props.tally?.noWithVeto, props.pool?.bondedTokens)))


console.log(yes.value, no.value, abstain.value, veto.value)
</script>
<template>
<div class="progress">
  <div class="progress-bar bg-success" :style="`width: ${yes}`"></div>
  <div class="progress-bar bg-error" :style="`width: ${no}`"></div>
  <div class="progress-bar " :style="`width: ${veto}; background-color: #B71C1C;`"></div>
  <div class="progress-bar bg-secondary" :style="`width: ${abstain}`"></div>
</div>
</template>
<style scoped>
.progress {
    height: 0.8rem;
    overflow: hidden;
    background-color: rgba(128, 128, 128, 0.178);
}
.progress-bar {
    display: inline-block;
    height: 100%;
}
.progress :first-child {
    border-radius: 0px !important;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
}
.progress :last-child {
    border-radius: 0px !important;
}
</style>