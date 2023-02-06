import type { AbilityClass } from '@casl/ability'
import { Ability } from '@casl/ability'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

export type Subjects = 'Auth' | 'Admin' | 'AclDemo' | 'all'

export type AppAbility = Ability<[Actions, Subjects]>

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppAbility = Ability as AbilityClass<AppAbility>

export interface UserAbility {
  action: Actions
  subject: Subjects
}
