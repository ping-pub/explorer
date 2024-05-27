<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useFormatter } from '@/stores';
import TxsInBlocksChart from '@/components/charts/TxsInBlocksChart.vue';
import { useBlockModule } from "@/modules/[chain]/block/block";
import { PageRequest, type AuthAccount, type Pagination } from '@/types';
import { reactive, onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const tab = ref('blocks');

const base = useBaseStore()

const format = useFormatter();

const list = reactive(() => {
    return base.recents
})

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
    pageload(1)
    pageRequest.value.setPageSize(10)
    pageResponse.value = {
        total: base.latest?.block?.header.height
    }
});

function pageload(p: number) {
    pageRequest.value.setPage(p)
}

function handleScroll() {
    const container = document.querySelector('.blocksContainer') as HTMLDivElement;
    // Check if the scroll is at the bottom
    let isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight;
    if (isAtBottom) {
        base.updatePageSize(base.pageSize + 5)
    }
}
</script>
<template>
    <div>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'blocks' }" @click="tab = 'blocks'">{{
                $t('block.recent') }}</a>
            <RouterLink class="tab text-gray-400 uppercase"
                :to="`/${chain}/block/${Number(base.latest?.block?.header.height || 0) + 10000}`">{{ $t('block.future') }}
            </RouterLink>
        </div>

        <div v-show="tab === 'blocks'">
            <div class="blocksContainer" @scroll="handleScroll" style="height: 78vh;overflow: scroll;">
                <table class="table table-compact">
                    <thead>
                        <tr>
                            <td>{{ $t('block.block_header') }}</td>
                            <td>{{ $t('account.hash') }}</td>
                            <td>{{ $t('block.proposer') }}</td>
                            <td>{{ $t('account.no_of_transactions') }}</td>
                            <td>{{ $t('account.time') }}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in [...list()].reverse()">
                            <td>{{ item.block.header.height }}</td>
                            <td>
                                <RouterLink :to="`/${chain}/block/${item.block.header.height}`">{{ item.block_id.hash }}
                                </RouterLink>
                            </td>
                            <td>{{ format.validator(item.block?.header?.proposer_address) }}</td>
                            <td>{{ item.block?.data?.txs.length }}</td>
                            <td>{{ format.toDay(item.block?.header?.time) }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="pre-loading" v-if="base.fetchingBlocks">
                    <div class="effect-1 effects"></div>
                    <div class="effect-2 effects"></div>
                    <div class="effect-3 effects"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks',
        order: 2
      }
    }
  </route>
