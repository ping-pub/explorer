import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing';
import dayjs from 'dayjs';
import type { Block, TxLocal } from '@/types';
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
            fetchingBlocks: false,
            allTxs: [] as TxLocal[]
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
            let res = await fetch("/api/v1/transactions?page=1&limit="+this.pageSize);
            const resJson = await res.json();
            this.allTxs = resJson.data
            return res
        },
        async appendTxsByPage(page:number = 2, limit:number = 10){
            let res = await fetch(`/api/v1/transactions?page=${page}&limit=${limit}`);
            const resJson = await res.json();
            this.allTxs = [...this.allTxs, ...resJson.data]
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
            this.recents.push(this.latest)
            this.fetchingBlocks = false
            // this.fetchLatest();
        },
        async fetchLatest() {
            try {
                this.latest = await this.blockchain.rpc?.getBaseBlockLatest();
                this.connected = true
            } catch (e) {
                this.connected = false
            }
            if (
                !this.earlest ||
                this.earlest?.block?.header?.chain_id !=
                this.latest?.block?.header?.chain_id
            ) {
                //reset earlest and recents
                this.earlest = this.latest;
                this.recents = [];
            }
            if (this.recents.length == 0) {
                let promises = [];
                for (let i = this.pageSize; i > 0; i--) {
                    promises.push(this.blockchain.rpc?.getBaseBlockAt(`${parseInt(this.latest.block.header.height) - i}`))
                }
                let res = await Promise.all(promises).catch(e => {
                    console.error(e)
                    return []
                })
                this.recents = [...res]
            }

            //check if the block exists in recents
            if (
                this.recents.findIndex(
                    (x) => x?.block_id?.hash === this.latest?.block_id?.hash
                ) === -1
            ) {
                this.recents.push(this.latest);
            }
            return this.latest;
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
