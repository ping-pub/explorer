<script lang="ts" setup>
import { computed, ref, reactive, onMounted, nextTick } from 'vue';
import { useBaseStore, useFormatter } from '@/stores';
import TxsInBlocksChart from '@/components/charts/TxsInBlocksChart.vue';
import { useBlockModule } from "@/modules/[chain]/block/block";
import { PageRequest, type AuthAccount, type Pagination, type Block } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const tab = ref('blocks');
const base = useBaseStore();
const format = useFormatter();

// Add virtualization-related refs with proper typing
const visibleBlocks = ref<{ item: Block; index: number; style: { transform: string } }[]>([]);
const blockContainer = ref<HTMLDivElement | null>(null);
const itemHeight = 46; // Height of a table row in pixels
const bufferSize = 5; // Number of additional items to render above and below the visible area

const list = computed(() => {
    return base.recents;
});

const pageRequest = ref(new PageRequest());
const pageResponse = ref({} as Pagination);

onMounted(() => {
    pageload(1);
    pageRequest.value.setPageSize(10);
    pageResponse.value = {
        total: base.latest?.block?.header.height
    };
    
    // Initialize virtual scrolling after mounting
    initVirtualScroll();
});

function pageload(p: number) {
    pageRequest.value.setPage(p);
}

function handleScroll() {
    updateVisibleBlocks();
    
    // Check if we're near the bottom to load more blocks
    const container = blockContainer.value;
    if (!container) return;
    
    const isAtBottom = container.scrollTop + container.clientHeight + (itemHeight * 10) >= container.scrollHeight;
    if (isAtBottom && parseInt(base.recents[0]?.block?.header?.height || "0") > 1) {
        if (!base.fetchingBlocks) {
            base.updatePageSize(base.pageSize + 10);
        }
    }
}

// Initialize virtual scrolling
function initVirtualScroll() {
    nextTick(() => {
        if (blockContainer.value) {
            updateVisibleBlocks();
            blockContainer.value.addEventListener('scroll', handleScroll);
        }
    });
}

// Update which blocks are visible based on scroll position
function updateVisibleBlocks() {
    if (!blockContainer.value || list.value.length === 0) return;
    
    const container = blockContainer.value;
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    
    // Calculate which items should be visible
    const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize;
    const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight) + bufferSize;
    
    const start = Math.max(0, startIndex);
    const end = Math.min(list.value.length, endIndex);
    
    visibleBlocks.value = list.value.slice(start, end).map((item, index) => ({
        item,
        index: start + index,
        style: { transform: `translateY(${(start + index) * itemHeight}px)` }
    }));
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

        <div v-show="tab === 'blocks'" 
            class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-info overflow-x-auto blocksContainer" 
            ref="blockContainer"
            style="height: 78vh; overflow: auto;">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                    <Icon icon="mdi:cube-outline" class="text-2xl text-info mr-2" />
                    <div class="text-lg font-semibold text-main">{{ $t('block.recent') }} {{ $t('block.block_header') }}</div>
                </div>
            </div>
            
            <div class="bg-base-200 rounded-md overflow-auto">
                <table class="table table-compact w-full">
                    <thead class="bg-base-300 sticky top-0">
                        <tr>
                            <th class="bg-base-300">{{ $t('block.block_header') }}</th>
                            <th class="bg-base-300">{{ $t('account.hash') }}</th>
                            <th class="bg-base-300">{{ $t('block.proposer') }}</th>
                            <th class="bg-base-300">{{ $t('account.no_of_transactions') }}</th>
                            <th class="bg-base-300">{{ $t('account.time') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Using virtual list rendering for better performance -->
                        <tr v-for="({ item, style }, i) in visibleBlocks" 
                            :key="i"
                            class="hover:bg-base-300 transition-colors duration-200">
                            <td class="font-medium">{{ item.block.header.height }}</td>
                            <td class="truncate text-info" style="max-width: 18rem; overflow:hidden;">
                                <RouterLink class="truncate hover:underline" :title="item.block_id.hash"
                                    :to="`/${chain}/block/${item.block.header.height}`">{{ item.block_id.hash }}
                                </RouterLink>
                            </td>
                            <td>{{ format.validator(item.block?.header?.proposer_address) }}</td>
                            <td>{{ item.block?.data?.txs.length }}</td>
                            <td>{{ format.toDay(item.block?.header?.time) }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex justify-center items-center py-8" v-if="base.fetchingBlocks">
                    <div class="loading loading-spinner loading-lg text-info"></div>
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
