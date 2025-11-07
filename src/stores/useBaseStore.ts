import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing';
import dayjs from 'dayjs';
import type { Block, TxLocal, Tx, TxResponse, Pagination } from '@/types';
import { hashTx } from '@/libs';
import { fromBase64 } from '@cosmjs/encoding';
import { useRouter } from 'vue-router';

export const useBaseStore = defineStore('baseStore', {
    state: () => {
        return {
            earlest: {} as Block,
            latest: {} as Block,
            recents: [] as Block[],
            theme: (window.localStorage.getItem('theme') || 'dark') as
                | 'light'
                | 'dark',
            connected: true,
            pageSize: 30,
            fetchingBlocks: true,
            allTxs: [] as TxLocal[],
            pagination: {} as Pagination,
            _lastFetchTime: 0,
            _blockCache: new Map<string, Block>(),
            _highestFetchedHeight: 0,
            _lowestFetchedHeight: Number.MAX_SAFE_INTEGER,
            _backgroundFetching: false
        };
    },
    getters: {
        blocktime(): number {
            if (this.earlest?.block?.header && this.latest?.block?.header) {
                if (
                    this.latest.block.header.height !==
                    this.earlest.block.header.height
                ) {
                    const diff = dayjs(this.latest.block.header.time).diff(
                        this.earlest.block.header.time
                    );
                    const blocks = Number(this.latest.block.header.height) - Number(this.earlest.block.header.height)
                    if (blocks > 0) {
                        return diff / blocks;
                    }
                }
            }
            return 15000;
        },
        blockchain() {
            return useBlockchain();
        },
        currentChainId(): string {
            return this.latest.block?.header.chain_id || '';
        },
        txsInRecents() {
            const txs = [] as {
                height: string;
                hash: string;
                tx: DecodedTxRaw;
            }[];
            this.recents.forEach((b) =>
                b.block?.data?.txs.forEach((tx: string) => {
                    if (tx) {
                        const raw = fromBase64(tx);
                        try {
                            txs.push({
                                height: b.block.header.height,
                                hash: hashTx(raw),
                                tx: decodeTxRaw(raw),
                            });
                        } catch (e) {
                            console.error(e);
                        }
                    }
                })
            );
            return txs.sort((a, b) => { return Number(b.height) - Number(a.height) });
        }
    },
    actions: {
        async initial() {
            this.fetchLatest()
        },
        async clearRecentBlocks() {
            this.recents = [];
        },
        async getAllTxs(chain = 'pocket-mainnet', filters?: {
            type?: string;
            status?: string;
            start_date?: string;
            end_date?: string;
            min_amount?: number;
            max_amount?: number;
            sort_by?: 'timestamp' | 'amount' | 'fee' | 'block_height' | 'type' | 'status';
            sort_order?: 'asc' | 'desc';
        }) {
            try {
                //fetch from the transaction service
                const { fetchTransactions } = await import('@/libs/transactions');
                const data = await fetchTransactions({
                    chain,
                    page: 1,
                    limit: this.pageSize,
                    ...filters
                });
                // Map ApiTransaction to TxLocal format
                this.allTxs = (data.data || []).map((tx: any): TxLocal => ({
                    messages: tx.tx_data?.body?.messages || [],
                    fee: tx.fee,
                    height: String(tx.block_height),
                    block_height: String(tx.block_height),
                    hash: tx.hash,
                    status: tx.status === 'success' ? 0 : 1,
                    timestamp: tx.timestamp,
                    type: tx.type
                }));
                return data
            } catch (e) {
                console.error("Error Fetching Transactions", e);
                return []
            }
        },
        async updatePageSize(pgsz: number) {
            // Only set fetching flag if we're actually going to load new blocks
            const newBlocksNeeded = pgsz > this.pageSize;
            if (newBlocksNeeded) {
                this.fetchingBlocks = true;
            }
            
            this.pageSize = pgsz;
            
            // Calculate the range of blocks we need to fetch
            const latestHeight = parseInt(this.latest.block?.header?.height || '0');
            if (latestHeight <= 0) {
                this.fetchingBlocks = false;
                return; // No blocks available yet
            }
            
            // Determine start and end heights for this fetch batch
            const endHeight = this._lowestFetchedHeight > latestHeight ? 
                latestHeight : 
                Math.max(1, this._lowestFetchedHeight - 1);
            const startHeight = Math.max(1, endHeight - 20); // Fetch in smaller batches
            
            if (startHeight >= endHeight || !newBlocksNeeded) {
                // No new blocks needed
                this.fetchingBlocks = false;
                return;
            }
            
            try {
                // Fetch blocks in a window
                const blocksToFetch = [];
                for (let height = endHeight; height >= startHeight; height--) {
                    // Skip already cached blocks
                    if (!this._blockCache.has(height.toString())) {
                        blocksToFetch.push(height);
                    }
                }
                
                // Fetch blocks in parallel batches of 5 for better performance
                const batchSize = 5;
                const newBlocks: Block[] = [];
                
                for (let i = 0; i < blocksToFetch.length; i += batchSize) {
                    const batch = blocksToFetch.slice(i, i + batchSize);
                    const promises = batch.map(height => 
                        this.blockchain.rpc?.getBaseBlockAt(height.toString())
                        .then(block => {
                            if (block) {
                                // Cache the block
                                this._blockCache.set(height.toString(), block);
                                return block;
                            }
                            return null;
                        })
                        .catch(e => {
                            console.error(`Error fetching block at height ${height}:`, e);
                            return null;
                        })
                    );
                    
                    const results = await Promise.all(promises);
                    newBlocks.push(...results.filter((block): block is Block => block !== null));
                    
                    // Update the lowest fetched height
                    if (batch.length > 0) {
                        this._lowestFetchedHeight = Math.min(this._lowestFetchedHeight, batch[batch.length - 1]);
                    }
                }
                
                // Get cached blocks for any heights we already had
                for (let height = endHeight; height >= startHeight; height--) {
                    const cachedBlock = this._blockCache.get(height.toString());
                    if (cachedBlock && !newBlocks.some(b => b.block_id?.hash === cachedBlock.block_id?.hash)) {
                        newBlocks.push(cachedBlock);
                    }
                }
                
                // Add new blocks to recents, maintaining height order
                if (newBlocks.length > 0) {
                    // Sort by height in descending order
                    const sortedBlocks = [...this.recents, ...newBlocks].sort((a, b) => {
                        return parseInt(b.block.header.height) - parseInt(a.block.header.height);
                    });
                    
                    // Remove duplicates (by hash)
                    const uniqueBlocks: Block[] = [];
                    const seenHashes = new Set<string>();
                    
                    for (const block of sortedBlocks) {
                        if (block && block.block_id && block.block_id.hash && !seenHashes.has(block.block_id.hash)) {
                            seenHashes.add(block.block_id.hash);
                            uniqueBlocks.push(block);
                        }
                    }
                    
                    this.recents = uniqueBlocks;
                }
                
                // Start background fetching for the next batch
                this._prefetchNextBatch(startHeight);
            } catch (e) {
                console.error("Error updating page size:", e);
            } finally {
                this.fetchingBlocks = false;
            }
        },
        async _prefetchNextBatch(lowestHeight: number) {
            // Don't start a new prefetch if one is already running
            if (this._backgroundFetching) return;
            
            this._backgroundFetching = true;
            
            try {
                const startHeight = Math.max(1, lowestHeight - 10);
                const endHeight = lowestHeight - 1;
                
                if (startHeight >= endHeight) {
                    this._backgroundFetching = false;
                    return;
                }
                
                const blocksToFetch = [];
                for (let height = endHeight; height >= startHeight; height--) {
                    if (!this._blockCache.has(height.toString())) {
                        blocksToFetch.push(height);
                    }
                }
                
                // Fetch with lower priority (one at a time)
                for (const height of blocksToFetch) {
                    const block = await this.blockchain.rpc?.getBaseBlockAt(height.toString())
                        .catch(e => {
                            console.error(`Error prefetching block at height ${height}:`, e);
                            return null;
                        });
                        
                    if (block) {
                        this._blockCache.set(height.toString(), block);
                        // Update lowest height
                        this._lowestFetchedHeight = Math.min(this._lowestFetchedHeight, height);
                    }
                    
                    // Small delay to avoid overwhelming the API
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (e) {
                console.error("Error in background prefetch:", e);
            } finally {
                this._backgroundFetching = false;
            }
        },
        async fetchTx(hash: string) {
            let tx = await this.blockchain.rpc.getTx(hash);
            return tx
        },
        async fetchLatest() {
            try {
                // Implement debouncing - don't fetch if last fetch was < 3 seconds ago
                const now = Date.now();
                const lastFetch = this._lastFetchTime || 0;
                if (now - lastFetch < 3000) {
                    return this.latest;
                }
                this._lastFetchTime = now;

                // Fetch latest block
                const latestBlock = await this.blockchain.rpc?.getBaseBlockLatest();
                this.connected = true;

                // Check if we already have this block to avoid re-processing
                if (this.latest?.block_id?.hash === latestBlock?.block_id?.hash) {
                    return this.latest;
                }
                
                this.latest = latestBlock;
                    
                return this.latest;
            } catch (e) {
                console.error('Error in fetchLatest:', e);
                this.connected = false;
                return this.latest;
            }
        },
        async fetchValidatorByHeight(height?: number, offset = 0) {
            return this.blockchain.rpc.getBaseValidatorsetAt(
                String(height),
                offset
            );
        },
        async fetchLatestValidators(offset = 0) {
            return this.blockchain.rpc.getBaseValidatorsetLatest(offset);
        },
        async fetchBlock(height?: number | string) {
            return this.blockchain.rpc.getBaseBlockAt(String(height));
        },
        async fetchAbciInfo() {
            return this.blockchain.rpc.getBaseNodeInfo();
        },
        // async fetchNodeInfo() {
        //     return this.blockchain.rpc.no()
        // }
    },
});
