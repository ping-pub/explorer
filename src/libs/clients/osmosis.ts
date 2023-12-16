import type{ RequestRegistry } from '@/libs/registry'
// import dayjs from 'dayjs'

// which registry is store
export const store = 'name' // name or version
// Blockchain Name
export const name = 'osmosis'

// osmosis custom request
export const requests: Partial<RequestRegistry> = {
    mint_inflation: { url: 'https://public-osmosis-api.numia.xyz/apr?start_date=2023-11-27&end_date=2023-11-30', adapter: (data: any) => ({inflation: (Number(data.inflation_rate || 0)/ 100 ).toFixed(2)}) },
}
