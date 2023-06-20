import type{ RequestRegistry } from '@/libs/registry'

// which registry is store
export const store = 'name' // name or version
// Blockchain Name
export const name = 'evmos'
export const requests: Partial<RequestRegistry> = {
    mint_inflation: { url: '/evmos/inflation/v1/inflation_rate', adapter: (data: any) => ({inflation: (Number(data.inflation_rate || 0)/ 100 ).toFixed(2)}) },
}
