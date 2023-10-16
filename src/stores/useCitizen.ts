import { defineStore } from 'pinia';

export const useCitizen = defineStore('citizen-block-test', {
  state: () => {
    return {
    blocks: [],
    citizen:[],
    quests:[],
    quest:[],
    blockchain:[],
    nftCore:[]
  }},
  getters:{
    getHashLower50():any {
      return this.blocks.filter((item:any)=>item.level >  50);
    },
  },
  actions: {
    async fetchListGetNftCore(){
      try {
        const response = await fetch('http://localhost:3006/nft-core');
        const data = await response.json();
        this.nftCore = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    },
    async fetchQuests(){
      try {
        const response = await fetch('http://localhost:3005/quests');
        const data = await response.json();
        this.quests = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    },
    async fetchBlocks() {
      try {
        const response = await fetch('http://localhost:3000/citizen');
        const data = await response.json();
        this.blocks = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    },
    async fetchCitizen(id:number){
      try {
        const response = await fetch(`http://localhost:3000/citizen/${id}`);
        const data = await response.json();
        this.citizen = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    },
    async fetchQuest(id:number){
      try {
        const response = await fetch(`http://localhost:3005/quests/${id}`);
        const data = await response.json();
        this.quest = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    },
    async fetchQuestBlockChain(id:number){
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        const data = await response.json();
        this.blockchain = data;
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    }
  },
});
