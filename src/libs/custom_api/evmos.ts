import { DEFAULT, type RequestRegistry } from '@/libs'
export const CUSTOM: Partial<RequestRegistry> = {
    mint_inflation: { url: '/evmos/inflation/v1/inflation_rate', adapter: data => ({inflation: Number(data.inflation_rate || 0)/ 100}) },
}
