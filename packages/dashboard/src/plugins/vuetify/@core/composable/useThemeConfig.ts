import { useTheme } from 'vuetify'
import { useLayouts } from '@layouts'
import { themeConfig } from '@themeConfig'

export const isDarkPreferred = usePreferredDark()

export const useThemeConfig = () => {
  const theme = computed({
    get() {
      return themeConfig.app.theme.value
    },
    set(value: typeof themeConfig.app.theme.value) {
      themeConfig.app.theme.value = value
      localStorage.setItem(`${themeConfig.app.title}-theme`, value.toString())

      // ℹ️ We will not reset semi dark value when turning off dark mode because some user think it as bug
      // if (value !== 'light')
      //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
      //   isVerticalNavSemiDark.value = false
    },
  })

  const isVerticalNavSemiDark = computed({
    get() {
      return themeConfig.verticalNav.isVerticalNavSemiDark.value
    },
    set(value: typeof themeConfig.verticalNav.isVerticalNavSemiDark.value) {
      themeConfig.verticalNav.isVerticalNavSemiDark.value = value
      localStorage.setItem(`${themeConfig.app.title}-isVerticalNavSemiDark`, value.toString())
    },
  })

  const syncVuetifyThemeWithTheme = () => {
    const vuetifyTheme = useTheme()

    watch([theme, isDarkPreferred], ([val, _]) => {
      vuetifyTheme.global.name.value = val === 'system'
        ? isDarkPreferred.value
          ? 'dark'
          : 'light'
        : val
    })
  }

  /*
    ℹ️ Set current theme's surface color in localStorage

    Why? Because when initial loader is shown (before vue is ready) we need to what's the current theme's surface color.
    We will use color stored in localStorage to set the initial loader's background color.

    With this we will be able to show correct background color for the initial loader even before vue identify the current theme.
  */
  const syncInitialLoaderTheme = () => {
    const vuetifyTheme = useTheme()

    watch(theme, val => {
      // ℹ️ We are not using theme.current.colors.surface because watcher is independent and when this watcher is ran `theme` computed is not updated
      localStorage.setItem(`${themeConfig.app.title}-initial-loader-bg`, vuetifyTheme.current.value.colors.surface)
      localStorage.setItem(`${themeConfig.app.title}-initial-loader-color`, vuetifyTheme.current.value.colors.primary)
    }, {
      immediate: true,
    })
  }

  const skin = computed({
    get() {
      return themeConfig.app.skin.value
    },
    set(value: typeof themeConfig.app.skin.value) {
      themeConfig.app.skin.value = value
      localStorage.setItem(`${themeConfig.app.title}-skin`, value)
    },
  })

  const appRouteTransition = computed({
    get() {
      return themeConfig.app.routeTransition.value
    },
    set(value: typeof themeConfig.app.routeTransition.value) {
      themeConfig.app.routeTransition.value = value
      localStorage.setItem(`${themeConfig.app.title}-transition`, value)
    },
  })

  // `@layouts` exports
  const {
    navbarType,
    isNavbarBlurEnabled,
    footerType,
    isVerticalNavCollapsed,
    appContentWidth,
    appContentLayoutNav,
    horizontalNavType,
    isLessThanOverlayNavBreakpoint,
    isAppRtl,
    switchToVerticalNavOnLtOverlayNavBreakpoint,
  } = useLayouts()

  // const syncRtlWithRtlLang = (rtlLangs: string[], rtlDefaultLocale: string, ltrDefaultLocale: string) => {
  // const { locale } = useI18n({ useScope: 'global' })

  // watch(isAppRtl, val => {
  //   if (val)
  //     locale.value = rtlDefaultLocale
  //   else locale.value = ltrDefaultLocale
  // })
  // watch(locale, val => {
  //   if (rtlLangs.includes(val))
  //     isAppRtl.value = true
  //   else isAppRtl.value = false
  // })

  // watch(
  //   [isAppRtl, locale],
  //   ([valIsAppRTL, valLocale], [oldValIsAppRtl, oldValLocale]) => {
  //     const isRtlUpdated = valIsAppRTL !== oldValIsAppRtl

  //     if (isRtlUpdated) {
  //       if (valIsAppRTL)
  //         locale.value = rtlDefaultLocale
  //       else locale.value = ltrDefaultLocale
  //     }
  //     else {
  //       if (rtlLangs.includes(valLocale))
  //         isAppRtl.value = true
  //       else isAppRtl.value = false
  //     }
  //   },
  // )
  // }

  return {
    theme,
    isVerticalNavSemiDark,
    syncVuetifyThemeWithTheme,
    syncInitialLoaderTheme,
    skin,
    appRouteTransition,

    // @layouts exports
    navbarType,
    isNavbarBlurEnabled,
    footerType,
    isVerticalNavCollapsed,
    appContentWidth,
    appContentLayoutNav,
    horizontalNavType,
    isLessThanOverlayNavBreakpoint,
    isAppRtl,
    switchToVerticalNavOnLtOverlayNavBreakpoint,

    // syncRtlWithRtlLang,
  }
}
