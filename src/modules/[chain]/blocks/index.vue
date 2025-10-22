<script lang="ts" setup>
import { computed, ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useBaseStore, useFormatter } from '@/stores';
import TxsInBlocksChart from '@/components/charts/TxsInBlocksChart.vue';
import { useBlockModule } from "@/modules/[chain]/blocks/block";
import { PageRequest, type AuthAccount, type Pagination, type Block } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';
import { watch } from 'vue';
import { formatDate } from '@vueuse/core';

const props = defineProps(['chain']);

const tab = ref('blocks');
const base = useBaseStore();
const format = useFormatter();

// Add virtualization-related refs with proper typing
const visibleBlocks = ref<{ item: Block; index: number; style?: { transform: string } }[]>([]);
const blockContainer = ref<HTMLDivElement | null>(null);
const itemHeight = 46; // Height of a table row in pixels
const bufferSize = 10; // Number of additional items to render above and below the visible area
const ticking = ref(false); // For requestAnimationFrame throttling
const scrollTimeout = ref<NodeJS.Timeout | null>(null); // For debouncing
const loadMoreThreshold = 500; // px from bottom to trigger loading more

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

onBeforeUnmount(() => {
    // Clean up event listeners and timeouts
    if (blockContainer.value) {
        blockContainer.value.removeEventListener('scroll', handleScroll);
    }
    
    if (scrollTimeout.value !== null) {
        clearTimeout(scrollTimeout.value);
    }
});

function pageload(p: number) {
    pageRequest.value.setPage(p);
}

function handleScroll() {
    // Use requestAnimationFrame to throttle scroll event
    if (!ticking.value) {
        ticking.value = true;
        requestAnimationFrame(() => {
            updateVisibleBlocks();
            
            // Check if we're near the bottom to load more blocks
            const container = blockContainer.value;
            if (!container) return;
            
            const isNearBottom = container.scrollTop + container.clientHeight + loadMoreThreshold >= container.scrollHeight;
            if (isNearBottom && parseInt(list.value[0]?.block?.header?.height || "0") > 1) {
                // Debounce loading more blocks to avoid multiple requests
                if (scrollTimeout.value !== null) {
                    clearTimeout(scrollTimeout.value);
                }
                
                scrollTimeout.value = setTimeout(() => {
                    if (!base.fetchingBlocks) {
                        base.updatePageSize(base.pageSize + 20);
                    }
                    scrollTimeout.value = null;
                }, 200);
            }
            
            ticking.value = false;
        });
    }
}

// Initialize virtual scrolling
function initVirtualScroll() {
    nextTick(() => {
        if (blockContainer.value) {
            updateVisibleBlocks();
            blockContainer.value.addEventListener('scroll', handleScroll, { passive: true });
        }
    });
}

// Update which blocks are visible based on scroll position - optimized version
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
    
    // Only update if the visible range has changed significantly (at least 3 items different)
    // This prevents excessive re-renders while still keeping the UI responsive
    if (visibleBlocks.value.length === 0 || 
        Math.abs(visibleBlocks.value[0].index - start) >= 3 || 
        Math.abs(visibleBlocks.value[visibleBlocks.value.length - 1].index - (end - 1)) >= 3) {
        
        visibleBlocks.value = list.value.slice(start, end).map((item, index) => ({
            item,
            index: start + index
        }));
    }
}

// Watch for changes in the list
watch(() => list.value.length, () => {
    updateVisibleBlocks();
});
</script>

<template>
    <div>
        <p class="flex items-center justify-start bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff;]">Blocks</p>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'blocks' }" @click="tab = 'blocks'">{{ $t('block.recent') }}</a>
            <RouterLink class="tab text-gray-400 uppercase"
                :to="`/${chain}/blocks/${Number(base.latest?.block?.header.height || 0) + 10000}`">{{ $t('block.future') }}
            </RouterLink>
        </div>

        <div v-show="tab === 'blocks'" 
            class="dark:bg-base-100 bg-base-200 px-0.5 pt-0.5 pb-0.5 rounded-xl border dark:border-base-100 overflow-x-auto blocksContainer" 
            ref="blockContainer"
            style="height: 78vh; overflow: auto;">
            
            <div class="bg-base-200 rounded-xl overflow-auto">
                <table class="table table-compact w-full">
                    <thead class="sticky top-0 z-10">
                        <tr class="border-none">
                            <th class="bg-white dark:bg-base-200">{{ $t('block.block_header') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('account.hash') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('block.proposer') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('account.no_of_transactions') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('account.time') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('block.relay') }}</th>
                            <th class="bg-white dark:bg-base-200">{{ $t('block.size') }}</th>
                        </tr>
                    </thead>
                    <tbody class="dark:bg-base-200 bg-white relative">
                        <!-- Add spacer at the top to push the visible items to the correct scroll position -->
                        <tr v-if="visibleBlocks.length > 0" class="h-0 m-0 p-0 border-none">
                            <td :style="{ height: `${visibleBlocks[0].index * itemHeight}px`, padding: 0 }" colspan="5"></td>
                        </tr>
                        
                        <!-- Render visible blocks normally without absolute positioning -->
                        <tr v-for="({ item }, i) in visibleBlocks"
                            :key="i"
                            class="transition-colors duration-200 border-none">
                            <td class="font-medium dark:text-warning text-[#09279F;]">{{ item.block.header.height }}</td>
                            <td class="truncate dark:text-warning text-[#09279F;]" style="max-width: 18rem; overflow:hidden;">
                                <RouterLink class="truncate hover:underline" :title="item.block_id.hash"
                                    :to="`/${chain}/blocks/${item.block.header.height}`">{{ item.block_id.hash }}
                                </RouterLink>
                            </td>
                            <td>{{ format.validator(item.block?.header?.proposer_address) }}</td>
                            <td>{{ item.block?.data?.txs.length }}</td>
                            <td>{{ format.toDay(item.block?.header?.time, 'from') }}</td>
                            <td>{{ item.block?.header?.extensions?.[0]?.relay_count || 0 }}</td>
                            <td>{{ item.block?.data?.txs?.length ? item.block.data.txs.join(', ').length : 0 }} bytes</td>
                        </tr>
                        
                        <!-- Add spacer at the bottom to maintain scroll height -->
                        <tr v-if="visibleBlocks.length > 0" class="h-0 m-0 p-0 border-none">
                            <td :style="{ 
                                height: `${(Math.max(0, list.length - (visibleBlocks[visibleBlocks.length-1].index + 1)) > 0 ? 0 : Math.max(0, list.length - (visibleBlocks[visibleBlocks.length-1].index + 1)) * itemHeight)}px`, 
                                padding: 0 
                             }" colspan="5"></td>
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

<style scoped>
.table tr.h-0 {
    display: table-row;
    line-height: 0;
    height: 0;
}
.table tr.h-0 td {
    padding: 0;
    border: none;
}
</style>
