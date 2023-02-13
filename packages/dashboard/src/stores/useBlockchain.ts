import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getLogo, useDashboard } from "./useDashboard";


export const useBlockchain = defineStore("blockchain", () => {
  const dbstore = useDashboard()

  const rest = ref('')
  const status = ref({} as Record<string, string>)

  const current = computed(()=>{
    return dbstore.getCurrentChain()
  });
  const logo = computed(() => {
    return getLogo(current.value?.logo_URIs)
  })
  const name = computed(() => {
    return current.value.chain_name
  })
  const availableEndpoint = computed(() => {
    const all = current.value?.apis?.rest
    if(all) {
      if(!rest.value || all.findIndex(x => x.address === rest.value) < 0) {        
        const rn = Math.random()
        rest.value = all[Math.floor(rn * all.length)].address
      }
    }
    
    return rest.value
  })

  function setRestEndpoint(endpoint: string) {
    rest.value = endpoint
  }

  return { 
    // states
    availableEndpoint,
    // getters
    name, current, logo,
    // actions
    setRestEndpoint
  };
});
