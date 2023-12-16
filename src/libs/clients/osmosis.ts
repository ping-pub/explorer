import type{ RequestRegistry } from '@/libs/registry'
// import dayjs from 'dayjs'

// which registry is store
export const store = 'name' // name or version
// Blockchain Name
export const name = 'osmosis'

// osmosis custom request
export const requests: Partial<RequestRegistry> = {
    mint_inflation: { 
        url: `https://public-osmosis-api.numia.xyz/apr?start_date=${new Date(new Date().getTime() - 186400*1000).toISOString().split('T')[0]}&end_date=${new Date().toISOString().split('T')[0]}`, 
        adapter: (data: any) => {
            const [first] = data
            return {inflation: String(Number(first?.apr|| "0")/100.0)}
        } 
    },
}
