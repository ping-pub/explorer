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
            pageSize: 50,
            fetchingBlocks: true,
            allTxs: [] as TxLocal[],
            pagination: {} as Pagination,
            _lastFetchTime: 0
        };
    },
    getters: {
        blocktime(): number {
            if (this.earlest && this.latest) {
                if (
                    this.latest.block?.header?.height !==
                    this.earlest.block?.header?.height
                ) {
                    const diff = dayjs(this.latest.block?.header?.time).diff(
                        this.earlest.block?.header?.time
                    );
                    const blocks = Number(this.latest.block.header.height) - Number(this.earlest.block.header.height)
                    return diff / (blocks);
                }
            }
            return 6000;
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
        async getAllTxs(startingBlock = '', numOfBlocks = 0) {
            try {
                let res = await fetch("/api/v1/transactions?page=1&limit=" + this.pageSize).catch(err => console.error("Error Fetching Transactions"));
                const resJson = await res?.json();
                this.allTxs = resJson?.data || []
                return res
            } catch (e) {
                return []
            }
        },
        async appendTxsByPage(page: number = 2, limit: number = 10) {
            let res = await fetch(`/api/v1/transactions?page=${page}&limit=${limit}`);
            const resJson = await res.json();
            var temp: TxLocal[] = [];
            const nameSet: any = {};
            [...this.allTxs, ...resJson.data].forEach(item => {
                if (!nameSet[item.hash]) {
                    nameSet[item.hash] = true;
                    temp.push(item);
                }
            });
            this.allTxs = temp
            return res
        },
        async updatePageSize(pgsz: number) {
            this.fetchingBlocks = true
            this.pageSize = pgsz;
            let promises = [];
            for (let i = this.pageSize; i >= 0; i--) {
                promises.push(this.blockchain.rpc?.getBaseBlockAt(`${parseInt(this.latest.block.header.height) - i}`))
            }
            let res = await Promise.all(promises).catch(e => {
                console.error(e)
                return []
            })
            this.recents = [...res]
            if (
                this.recents.findIndex(
                    (x) => x?.block_id?.hash === this.latest?.block_id?.hash
                ) === -1
            ) {
                this.recents.push(this.latest)
            }
            this.fetchingBlocks = false
            // this.fetchLatest();
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

                if (
                    !this.earlest ||
                    this.earlest?.block?.header?.chain_id !=
                    this.latest?.block?.header?.chain_id
                ) {
                    // Reset earlest and recents
                    this.earlest = this.latest;
                    this.recents = [];
                }

                // Fetch initial blocks only if recents is empty
                if (this.recents.length === 0) {
                    this.fetchingBlocks = true;
                    
                    // Use Promise.all for parallel fetching instead of sequential
                    const fetchPromises = [];
                    const batchSize = 10; // Process in smaller batches for better UX
                    
                    for (let i = 1; i <= Math.min(this.pageSize, 50); i++) {
                        fetchPromises.push(this.blockchain.rpc?.getBaseBlockAt(
                            `${parseInt(this.latest.block.header.height) - i}`
                        ).catch(e => {
                            console.error(e);
                            return null;
                        }));
                        
                        // Process in batches to avoid overwhelming the API
                        if (fetchPromises.length === batchSize || i === Math.min(this.pageSize, 50)) {
                            const blocks = await Promise.all(fetchPromises);
                            blocks.forEach(block => {
                                if (block) {
                                    this.recents.unshift(block);
                                }
                            });
                            fetchPromises.length = 0;
                        }
                    }
                    
                    this.fetchingBlocks = false;
                }

                // Check if the latest block exists in recents
                if (
                    this.recents.findIndex(
                        (x) => x?.block_id?.hash === this.latest?.block_id?.hash
                    ) === -1
                ) {
                    this.recents.push(this.latest);
                    
                    // Lazy load transactions for the latest block to improve initial rendering performance
                    setTimeout(async () => {
                        let transactions: TxLocal[] = [];
                        const txPromises = [];
                        
                        // Process transactions in parallel rather than sequentially
                        for (var tx of this.latest.block.data.txs) {
                            const txHash = hashTx(fromBase64(tx));
                            
                            // Skip if we already have this transaction
                            if (this.allTxs.some(existingTx => existingTx.hash === txHash)) {
                                continue;
                            }
                            
                            txPromises.push(this.fetchTx(txHash).then(txRes => {
                                if (!txRes) return null;
                                
                                // First decode the raw transaction
                                const decodedTx = decodeTxRaw(fromBase64(tx));
                                
                                // Create a transaction object that matches the TxLocal type
                                const transaction = {
                                    status: txRes.tx_response.code,
                                    timestamp: txRes.tx_response.timestamp,
                                    // Handle the messages - ensuring they have the required @type property
                                    messages: decodedTx.body.messages.map(msg => {
                                        // The Any type in Cosmos typically has a typeUrl property we can use for @type
                                        const msgAny = msg as any;
                                        return {
                                            ...msgAny.value,
                                            "@type": msgAny.typeUrl || ""
                                        };
                                    }),
                                    fee: decodedTx.authInfo.fee,
                                    hash: txHash,
                                    height: this.latest.block.header.height
                                };
                                
                                return transaction as unknown as TxLocal;
                            }).catch(e => {
                                console.error('Failed to fetch tx:', e);
                                return null;
                            }));
                        }
                        
                        const results = await Promise.all(txPromises);
                        transactions = results.filter(tx => tx !== null) as TxLocal[];
                        
                        if (transactions.length > 0) {
                            this.allTxs = [...transactions, ...this.allTxs.slice(0, 100)]; // Limit stored transactions
                        }
                    }, 100);
                }
                
                // Limit the recents array size to prevent memory growth
                if (this.recents.length > this.pageSize) {
                    this.recents = this.recents.slice(0, this.pageSize);
                }
                    
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
