import { defineStore } from 'pinia';

export const useBlock = defineStore('block', {
  state: () => {
    return {
      detailBlock: [],
      fromToBlock: [],
      firstRenderBlock: [],
      isLoading: false,
      isLoadingTable: false,
      isLoadingValidator: false,
      validator: [],
      bankByBalance: [],
      isLoadingbankByBalance: false,
      denomHolders: [],
      isLoadingDenomHolders: false,
      totalSupply: [],
      isLoadingTotalSupply: false,
      totalSupplyDenom: [],
      isLoadingTotalSupplyDenom: false,
        denomAddress:[],
        isLoadingDenomAddress:false,
        chartMock:[],
      firstRenderTx:[],
      isLoadingTx:false,
      detailTx:[]
    }
  },
  actions: {
    async fetchDetailBlock(id: string | number) {
      this.isLoading = true;
      try {
        const response = await fetch(`https://api-chain.onechain.game/block?height=${id}`);
        if (response.status === 200) {
          const data = await response.json();
          this.detailBlock = data.result.block.header;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoading = false;
      }
    },
 

    async fetchChartMock() {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=14`);
        if (response.status === 200) {
          const data = await response.json();
          this.chartMock = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } 
    },
    async fetchDenomAddress(address:string,denom:string) {
      this.isLoadingDenomAddress = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`);
        if (response.status === 200) {
          const data = await response.json();
          this.denomAddress = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingDenomAddress = false;
      }
    },
    async fetchTotalSupply() {
      this.isLoadingTotalSupply = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/supply`);
        if (response.status === 200) {
          const data = await response.json();
          this.totalSupply = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingTotalSupply = false;
      }
    },
    async fetchTotalSupplyDenom(denom:string) {
      this.isLoadingTotalSupplyDenom = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`);
        if (response.status === 200) {
          const data = await response.json();
          this.totalSupplyDenom = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingTotalSupplyDenom = false;
      }
    },
    async fetchDenomHolders(denom: string) {
      this.isLoadingDenomHolders = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/denom_owners/${denom}`);
        if (response.status === 200) {
          const data = await response.json();
          this.denomHolders = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingDenomHolders = false;
      }
    },
    async fetchValidator(currentPage: number, pageSize: number) {
      this.isLoadingValidator = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/staking/v1beta1/validators?pagination.offset=0&pagination.limit=${pageSize}`);
        if (response.status === 200) {
          const data = await response.json();
          this.validator = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingValidator = false;
      }
    },
    async fetchBankBalance(address: string) {
      this.isLoadingbankByBalance = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/balances/${address}`);
        if (response.status === 200) {
          const data = await response.json();
          this.bankByBalance = data;
        } else {
          this.bankByBalance = [];

          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingbankByBalance = false;
      }
    },
    async fetchBankBalanceByDenom(address: string, denom: string) {
      this.isLoadingbankByBalance = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`);
        if (response.status === 200) {
          const data = await response.json();
          this.bankByBalance = data;
        } else {
          this.bankByBalance = [];

          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingbankByBalance = false;
      }
    },
    async fetchDetailBlockByHash(hash: string) {
      this.isLoading = true;
      try {
        const response = await fetch(`https://api-chain.onechain.game/block_by_hash?hash=${hash}`);
        if (response.status === 200) {
          const data = await response.json();
          this.detailBlock = data.result.block.header;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDetailTransactionByHash(hash: string) {
      this.isLoadingTx = true;
      try {
        const response = await fetch(`https://docs-api.onechain.game/cosmos/tx/v1beta1/txs/${hash}`);
        if (response.status === 200) {
          const data = await response.json();
          this.detailTx = data;
        } else {
          console.error('Error fetching detailBlock:', response.status);
        }
      } catch (error) {
        console.error('Error fetching detailBlock:', error);
      } finally {
        this.isLoadingTx = false;
      }
    },
    async fetchBetweenBlock(from: number, to: string | number) {
      this.isLoading = true;

      try {
        const response = await fetch(`https://api-chain.onechain.game/blockchain?minHeight=${from}&maxHeight=${to}`);
        if (response.status === 200) {
          const data = await response.json();
          this.fromToBlock = data.result.block_metas;
        } else {
          console.error('Error fetching fromToList:', response.status);
        }
      } catch (error) {
        console.error('Error fetching fromToList:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetch20FirstBlock() {
      this.isLoadingTable = true;

      try {
        const response = await fetch(`https://api-chain.onechain.game/blockchain`, {
          cache: 'no-store'
        });
        if (response.status === 200) {
          const data = await response.json();
          this.firstRenderBlock = data.result.block_metas;
        } else {
          console.error('Error fetching fromToList:', response.status);
        }
      } catch (error) {
        console.error('Error fetching fromToList:', error);
      } finally {
        this.isLoadingTable = false;
      }
    },
    async fetch10FirstTx() {
      this.isLoadingTx = true;

      try {
        const response = await fetch(`https://api-chain.onechain.game/tx_search?query=%22tx.height%3E0%22&order_by=%22desc%22&page=1&per_page=10`, {
          cache: 'no-store'
        });
        if (response.status === 200) {
          const data = await response.json();
          this.firstRenderTx= data;
        } else {
          console.error('Error fetching fromToList:', response.status);
        }
      } catch (error) {
        console.error('Error fetching fromToList:', error);
      } finally {
        this.isLoadingTx = false;
      }
    }
  },
});
