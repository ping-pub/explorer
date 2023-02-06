import type { RouteLocationNormalized } from "vue-router";
import ability from "@/plugins/vuetify/casl/ability";
import type { NavGroup } from "@layouts/types";

/**
 * Returns ability result if ACL is configured or else just return true
 * We should allow passing string | undefined to can because for admin ability we omit defining action & subject
 *
 * Useful if you don't know if ACL is configured or not
 * Used in @core files to handle absence of ACL without errors
 *
 * @param {String} action CASL Actions // https://casl.js.org/v4/en/guide/intro#basics
 * @param {String} subject CASL Subject // https://casl.js.org/v4/en/guide/intro#basics
 */
export const can = (
  action: string | undefined,
  subject: string | undefined
) => {
  const vm = getCurrentInstance();

  if (!vm) return false;

  const localCan = vm.proxy && "$can" in vm.proxy;

  // @ts-expect-error We will get TS error in below line because we aren't using $can in component instance
  return localCan ? vm.proxy?.$can(action, subject) : true;
};

/**
 * Check if user can view item based on it's ability
 * Based on item's action and subject & Hide group if all of it's children are hidden
 * @param {Object} item navigation object item
 */
export const canViewNavMenuGroup = (item: NavGroup) => {
  const hasAnyVisibleChild = item.children.some((i) =>
    can(i.action, i.subject)
  );

  // If subject and action is defined in item => Return based on children visibility (Hide group if no child is visible)
  // Else check for ability using provided subject and action along with checking if has any visible child
  if (!(item.action && item.subject)) return hasAnyVisibleChild;

  return can(item.action, item.subject) && hasAnyVisibleChild;
};

export const canNavigate = (to: RouteLocationNormalized) => {
  // @ts-expect-error We should allow passing string | undefined to can because for admin ability we omit defining action & subject
  return to.matched.some((route) =>
    ability.can(route.meta.action, route.meta.subject)
  );
};
