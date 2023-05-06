<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { fromHex, toBase64 } from '@cosmjs/encoding';
import {
  useFormatter,
  useStakingStore,
  useBaseStore,
  useBlockchain,
} from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import type { Block, Commit } from '@/types';
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';
import type { SigningInfo } from '@/types/slashing';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const baseStore = useBaseStore();
const chainStore = useBlockchain();
const latest = ref({} as Block);
const commits = ref([] as Commit[]);
const keyword = ref('');
const live = ref(true);

// storage local favorite validator ids
const local = ref(
  JSON.parse(localStorage.getItem('uptime-validators') || '{}') as Record<
    string,
    string[]
  >
);
const selected = ref(local.value[chainStore.chainName] as string[]); // favorite validators on selected blockchain

const signingInfo = ref({} as Record<string, SigningInfo>);

// filter validators by keywords
const validators = computed(() => {
  if (keyword)
    return stakingStore.validators.filter(
      (x) => x.description.moniker.indexOf(keyword.value) > -1
    );
  return stakingStore.validators;
});

onMounted(() => {
  live.value = true;
  baseStore.fetchLatest().then((block) => {
    latest.value = block;
    commits.value.unshift(block.block.last_commit);
    const height = Number(block.block.header?.height || 0);
    if (height > 0) {
      // constructs sequence for loading blocks
      let promise = Promise.resolve();
      for (let i = height - 1; i > height - 50; i -= 1) {
        if (i > height - 48) {
          promise = promise.then(
            () =>
              new Promise((resolve, reject) => {
                if (live.value) {
                  // continue only if the page is living
                  baseStore.fetchBlock(i).then((x) => {
                    commits.value.unshift(x.block.last_commit);
                    resolve();
                  });
                }
              })
          );
        }
      }
    }
  });

  chainStore.rpc.getSlashingSigningInfos().then((x) => {
    x.info?.forEach((i) => {
      signingInfo.value[valconsToBase64(i.address)] = i;
    });
  });
});

onUnmounted(() => {
  live.value = false;
});

watchEffect(() => {
  local.value[chainStore.chainName] = selected.value;
  localStorage.setItem('uptime-validators', JSON.stringify(local.value));
});
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="4">
        <VCard class="h-full self-center d-flex p-4">
          <div class="self-center">
            Current Height: {{ latest.block?.header?.height }}
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="8" class="">
        <VTextField
          v-model="keyword"
          label="Keywords to filter validators"
          variant="outlined"
        >
          <template v-slot:append>
            <VBtn
              ><VIcon icon="mdi-star" /><span class="d-none d-md-block"
                >Favorite</span
              ></VBtn
            >
          </template>
        </VTextField>
      </VCol>
    </VRow>

    <VRow>
      <VCol v-for="(v, i) in validators" cols="12" md="3" xl="2" class="py-0">
        <div class="d-flex justify-between">
          <VCheckbox
            v-model="selected"
            color="warning"
            :value="v.operator_address"
          >
            <template v-slot:label>
              <span class="text-truncate"
                >{{ i + 1 }}. {{ v.description.moniker }}</span
              >
            </template>
          </VCheckbox>
          <VChip
            v-if="
              Number(
                signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
                  ?.missed_blocks_counter || 0
              ) > 0
            "
            size="small"
            class="mt-1"
            label
            color="error"
            >{{
              signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
                ?.missed_blocks_counter
            }}</VChip
          >
          <VChip v-else size="small" class="mt-1" label color="success">{{
            signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
              ?.missed_blocks_counter
          }}</VChip>
        </div>
        <UptimeBar
          :blocks="commits"
          :validator="
            toBase64(fromHex(consensusPubkeyToHexAddress(v.consensus_pubkey)))
          "
        />
      </VCol>
    </VRow>
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'uptime'
    }
  }
</route>

<style lang="scss">
.v-field--variant-outlined .v-field__outline__notch {
  border-width: 0 !important;
}
</style>
