import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getLogo, useDashboard } from "./useDashboard";
import { useTheme } from 'vuetify'
import { osmosis,  } from 'osmojs';
import { LCDClient } from '@osmonauts/lcd'

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

  const primaryColor = computed(() => {
    const colors = ['#fff', '#fea', '#123', '#68f', '#aca', 'bbe', '#666CFF']
    const color = colors[Math.floor(Math.random() * colors.length)]

    const vuetifyTheme = useTheme()
    const currentThemeName = vuetifyTheme.name.value
    vuetifyTheme.themes.value[currentThemeName].colors.primary = color
    return color
  })
  const availableEndpoint = computed(() => {
    const all = current.value?.apis?.rest
    if(all) {
      if(!rest.value || all.findIndex(x => x.address === rest.value) < 0) {        
        const rn = Math.random()
        const endpoint = all[Math.floor(rn * all.length)]
        rest.value = endpoint?.address || ''
      }
    }
    
    return rest.value
  })

  const restClient = computed(()=> {
    console.log(availableEndpoint, 'endpoint')
    return new LCDClient({restEndpoint: availableEndpoint})
  })

  function setRestEndpoint(endpoint: string) {
    rest.value = endpoint
  }

  return { 
    // states
    availableEndpoint,
    // getters
    name, current, logo, primaryColor, restClient, 
    // actions
    setRestEndpoint
  };
});
