import { ref, computed } from "vue";
import { defineStore } from "pinia";

const route = useRoute()
console.log('route', route)

export const useBlockchain = defineStore("blockchain", () => {
  const current = ref('');


  return { current };
});
