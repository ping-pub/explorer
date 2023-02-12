import { breakpointsVuetify } from '@vueuse/core'

import { VAvatar } from 'vuetify/components'

// ❗ Logo SVG must be imported with ?raw suffix
// import logo from '@/assets/logo.svg?raw'

import { defineThemeConfig } from '@/plugins/vuetify/@core'
import { RouteTransitions, Skins } from '@/plugins/vuetify/@core/enums'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: 'Ping.pub',

    // ❗ if you have SVG logo and want it to adapt according to theme color, you have to apply color as `color: rgb(var(--v-global-theme-primary))`
    // logo: h('div', { innerHTML: logo, style: 'line-height:0; color: rgb(var(--v-global-theme-primary))' }),
    logo: h('img', {src: '/logo.svg', width: 50, height: 50}),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav: AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16, // 16 for scrollbar. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
    enableI18n: false,
    theme: 'system',
    isRtl: false,
    skin: Skins.Default,
    routeTransition: RouteTransitions.Fade,
    iconRenderer: VAvatar,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'mdi-circle' },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
  },
  icons: {
    chevronDown: { icon: 'mdi-chevron-down' },
    chevronRight: { icon: 'mdi-chevron-right' },
    close: { icon: 'mdi-close' },
    verticalNavPinned: { icon: 'custom-vertical-nav-header-arrow', size: 22 },
    verticalNavUnPinned: { icon: 'custom-vertical-nav-header-arrow', size: 22 },
    sectionTitlePlaceholder: { icon: 'mdi-minus' },
  },
})
