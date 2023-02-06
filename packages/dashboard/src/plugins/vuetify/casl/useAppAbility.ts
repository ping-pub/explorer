import { useAbility } from '@casl/vue'
import type { AppAbility } from './AppAbility'

export const useAppAbility = () => useAbility<AppAbility>()
