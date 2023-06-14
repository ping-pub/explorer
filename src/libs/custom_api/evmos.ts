import type{ RequestRegistry } from '@/libs/registry'
import { DEFAULT } from '@/libs'
export const CUSTOM: Partial<RequestRegistry> = {
    mint_inflation: { url: '/evmos/inflation/v1/inflation_rate', adapter: (data: any) => ({inflation: (Number(data.inflation_rate || 0)/ 100 ).toFixed(2)}) },
}
