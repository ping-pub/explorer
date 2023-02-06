import type { InjectionKey, Plugin, Ref } from 'vue'
import { useDynamicVhCssProperty } from './composable/useDynamicVhCssProperty'
import { config } from './config'
import { ContentWidth } from './enums'
import type { UserConfig } from './types'
import { useLayouts } from '@layouts'

const { _setAppDir } = useLayouts()

// 🔌 Plugin
export const createLayouts = (userConfig: UserConfig): Plugin => {
  const localStorageIsRtl = localStorage.getItem(`${userConfig.app.title}-isRtl`)
  const localStorageIsVerticalNavCollapsed = localStorage.getItem(`${userConfig.app.title}-isVerticalNavCollapsed`)

  const localStorageContentWidth = (() => {
    const storageValue = localStorage.getItem(`${userConfig.app.title}-contentWidth`)

    return Object.values(ContentWidth).find(v => v === storageValue)
  })()

  const localStorageNavbarBlur = localStorage.getItem(`${userConfig.app.title}-navbarBlur`)

  config.app.title = userConfig.app.title
  config.app.logo = userConfig.app.logo
  config.app.contentWidth.value = localStorageContentWidth || userConfig.app.contentWidth
  config.app.contentLayoutNav.value = userConfig.app.contentLayoutNav
  config.app.overlayNavFromBreakpoint = userConfig.app.overlayNavFromBreakpoint
  config.app.enableI18n = userConfig.app.enableI18n
  config.app.isRtl.value = localStorageIsRtl ? JSON.parse(localStorageIsRtl) : userConfig.app.isRtl
  config.app.iconRenderer = userConfig.app.iconRenderer

  config.navbar.type.value = userConfig.navbar.type
  config.navbar.navbarBlur.value = localStorageNavbarBlur ? JSON.parse(localStorageNavbarBlur) : userConfig.navbar.navbarBlur

  config.footer.type.value = userConfig.footer.type

  config.verticalNav.isVerticalNavCollapsed.value
    = localStorageIsVerticalNavCollapsed
      ? JSON.parse(localStorageIsVerticalNavCollapsed)
      : userConfig.verticalNav.isVerticalNavCollapsed

  config.verticalNav.defaultNavItemIconProps = userConfig.verticalNav.defaultNavItemIconProps

  config.horizontalNav.type.value = userConfig.horizontalNav.type

  config.icons.chevronDown = userConfig.icons.chevronDown
  config.icons.chevronRight = userConfig.icons.chevronRight
  config.icons.close = userConfig.icons.close
  config.icons.verticalNavPinned = userConfig.icons.verticalNavPinned
  config.icons.verticalNavUnPinned = userConfig.icons.verticalNavUnPinned
  config.icons.sectionTitlePlaceholder = userConfig.icons.sectionTitlePlaceholder

  return (): void => {
    useDynamicVhCssProperty()

    _setAppDir(config.app.isRtl.value ? 'rtl' : 'ltr')
  }
}

export const injectionKeyIsVerticalNavHovered: InjectionKey<Ref<boolean>> = Symbol('isVerticalNavHovered')

export * from './components'
export { useLayouts } from './composable/useLayouts'
