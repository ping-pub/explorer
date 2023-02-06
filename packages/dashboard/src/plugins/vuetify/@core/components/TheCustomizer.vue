<script setup lang="tsx">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { staticPrimaryColor } from '@/plugins/vuetify/theme'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { RouteTransitions, Skins } from '@core/enums'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'
import { themeConfig } from '@themeConfig'

// import { useTheme } from 'vuetify'

const isNavDrawerOpen = ref(false)

const {
  theme,
  skin,
  appRouteTransition,
  navbarType,
  footerType,
  isVerticalNavCollapsed,
  isVerticalNavSemiDark,
  appContentWidth,
  appContentLayoutNav,
  isAppRtl,
  isNavbarBlurEnabled,
  isLessThanOverlayNavBreakpoint,
} = useThemeConfig()

// 👉 Primary Color
const vuetifyTheme = useTheme()

// const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value)

const initialThemeColors = JSON.parse(JSON.stringify(vuetifyTheme.current.value.colors))
const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error']

// ℹ️ It will set primary color for current theme only
const setPrimaryColor = (color: string) => {
  const currentThemeName = vuetifyTheme.name.value

  vuetifyTheme.themes.value[currentThemeName].colors.primary = color

  // ℹ️ We need to store this color value in localStorage so vuetify plugin can pick on next reload
  localStorage.setItem(`${themeConfig.app.title}-${currentThemeName}ThemePrimaryColor`, color)

  // ℹ️ Update initial loader color
  localStorage.setItem(`${themeConfig.app.title}-initial-loader-color`, color)
}

/*
  ℹ️ This will return static color for first indexed color
  If we don't make first (primary) color as static then when another color is selected then we will have two theme colors with same hex codes and it will show two check marks
*/
const getBoxColor = (color: string, index: number) => index ? color : staticPrimaryColor

const { width: windowWidth } = useWindowSize()

const headerValues = computed(() => {
  const entries = Object.entries(NavbarType)

  if (appContentLayoutNav.value === AppContentLayoutNav.Horizontal)
    return entries.filter(([_, val]) => val !== NavbarType.Hidden)

  return entries
})
</script>

<template>
  <template v-if="!isLessThanOverlayNavBreakpoint(windowWidth)">
    <VBtn
      icon
      size="small"
      class="app-customizer-toggler rounded-s rounded-0"
      style="z-index: 1001;"
      @click="isNavDrawerOpen = true"
    >
      <VIcon icon="mdi-cog" />
    </VBtn>

    <VNavigationDrawer
      v-model="isNavDrawerOpen"
      temporary
      location="end"
      width="400"
      :scrim="false"
      class="app-customizer"
    >
      <!-- 👉 Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">
            THEME CUSTOMIZER
          </h6>
          <span class="text-body-1">Customize & Preview in Real Time</span>
        </div>
        <IconBtn @click="isNavDrawerOpen = false">
          <VIcon
            icon="mdi-close"
            size="20"
          />
        </IconBtn>
      </div>

      <VDivider />

      <PerfectScrollbar
        tag="ul"
        :options="{ wheelPropagation: false }"
      >
        <!-- SECTION Theming -->
        <CustomizerSection
          title="THEMING"
          :divider="false"
        >
          <!-- 👉 Skin -->
          <h6 class="text-base font-weight-regular">
            Skins
          </h6>
          <VRadioGroup
            v-model="skin"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(Skins)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>

          <!-- 👉 Theme -->
          <h6 class="mt-3 text-base font-weight-regular">
            Theme
          </h6>
          <VRadioGroup
            v-model="theme"
            inline
          >
            <VRadio
              v-for="themeOption in ['system', 'light', 'dark']"
              :key="themeOption"
              :label="themeOption"
              :value="themeOption"
              class="text-capitalize"
            />
          </VRadioGroup>

          <!-- 👉 Primary color -->
          <h6 class="mt-3 text-base font-weight-regular">
            Primary Color
          </h6>
          <div class="d-flex gap-x-4 mt-2">
            <div
              v-for="(color, index) in colors"
              :key="color"
              style="width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; transition: all 0.25s ease;"
              :style="{ backgroundColor: getBoxColor(initialThemeColors[color], index) }"
              class="cursor-pointer d-flex align-center justify-center"
              :class="{ 'elevation-4': vuetifyTheme.current.value.colors.primary === getBoxColor(initialThemeColors[color], index) }"
              @click="setPrimaryColor(getBoxColor(initialThemeColors[color], index))"
            >
              <VFadeTransition>
                <VIcon
                  v-show="vuetifyTheme.current.value.colors.primary === (getBoxColor(initialThemeColors[color], index))"
                  icon="mdi-check"
                  color="white"
                />
              </VFadeTransition>
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION LAYOUT -->
        <CustomizerSection title="LAYOUT">
          <!-- 👉 Content Width -->
          <h6 class="text-base font-weight-regular">
            Content width
          </h6>
          <VRadioGroup
            v-model="appContentWidth"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(ContentWidth)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Navbar Type -->
          <h6 class="mt-3 text-base font-weight-regular">
            {{ appContentLayoutNav === AppContentLayoutNav.Vertical ? 'Navbar' : 'Header' }} Type
          </h6>
          <VRadioGroup
            v-model="navbarType"
            inline
          >
            <VRadio
              v-for="[key, val] in headerValues"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Footer Type -->
          <h6 class="mt-3 text-base font-weight-regular">
            Footer Type
          </h6>
          <VRadioGroup
            v-model="footerType"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(FooterType)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Navbar blur -->
          <div class="d-flex align-center justify-space-between">
            <VLabel
              for="customizer-navbar-blur"
              class="text-high-emphasis"
            >
              Navbar Blur
            </VLabel>
            <div>
              <VSwitch
                id="customizer-navbar-blur"
                v-model="isNavbarBlurEnabled"
                class="ms-2"
              />
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION Menu -->
        <CustomizerSection title="MENU">
          <!-- 👉 Menu Type -->
          <h6 class="text-base font-weight-regular">
            Menu Type
          </h6>
          <VRadioGroup
            v-model="appContentLayoutNav"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(AppContentLayoutNav)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>

          <!-- 👉 Collapsed Menu -->
          <div
            v-if="appContentLayoutNav === AppContentLayoutNav.Vertical"
            class="d-flex align-center justify-space-between"
          >
            <VLabel
              for="customizer-menu-collapsed"
              class="text-high-emphasis"
            >
              Collapsed Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-collapsed"
                v-model="isVerticalNavCollapsed"
                class="ms-2"
              />
            </div>
          </div>

          <!-- 👉 Semi Dark Menu -->
          <div
            class="align-center justify-space-between"
            :class="vuetifyTheme.global.name.value === 'light' && appContentLayoutNav === AppContentLayoutNav.Vertical ? 'd-flex' : 'd-none'"
          >
            <VLabel
              for="customizer-menu-semi-dark"
              class="text-high-emphasis"
            >
              Semi Dark Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-semi-dark"
                v-model="isVerticalNavSemiDark"
                class="ms-2"
              />
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION MISC -->
        <CustomizerSection title="MISC">
          <!-- 👉 RTL -->
          <div class="d-flex align-center justify-space-between">
            <VLabel
              for="customizer-rtl"
              class="text-high-emphasis"
            >
              RTL
            </VLabel>
            <div>
              <VSwitch
                id="customizer-rtl"
                v-model="isAppRtl"
                class="ms-2"
              />
            </div>
          </div>

          <!-- 👉 Route Transition -->
          <div class="mt-6">
            <VRow>
              <VCol
                cols="5"
                class="d-flex align-center"
              >
                <VLabel
                  for="route-transition"
                  class="text-high-emphasis"
                >
                  Router Transition
                </VLabel>
              </VCol>

              <VCol cols="7">
                <VSelect
                  id="route-transition"
                  v-model="appRouteTransition"
                  :items="Object.entries(RouteTransitions).map(([key, value]) => ({ key, value }))"
                  item-title="key"
                  item-value="value"
                  single-line
                />
              </VCol>
            </VRow>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->
      </PerfectScrollbar>
    </VNavigationDrawer>
  </template>
</template>

<style lang="scss">
.app-customizer {
  .customizer-section {
    padding: 1.25rem;
  }

  .customizer-heading {
    padding-block: 0.875rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-customizer-toggler {
  position: fixed !important;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);
}
</style>
