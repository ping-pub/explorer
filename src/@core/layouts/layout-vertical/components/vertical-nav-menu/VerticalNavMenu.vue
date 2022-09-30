<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      { 'expanded': !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered) },
      skin === 'dark' ? 'menu-dark' : 'menu-light'
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
        :toggle-collapsed="toggleCollapsed"
        :collapse-toggler-icon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row">

          <br />
          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link
              class="navbar-brand"
              to="/"
              :style="{'justify-content': 'center'}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 287.89 400"
                width="28%"
                class="mb-50 mr-1"
              ><defs><linearGradient
                id="a"
                x1="1.28"
                y1="164.53"
                x2="258.89"
                y2="164.53"
                gradientUnits="userSpaceOnUse"
              ><stop
                offset="0"
                stop-color="gold"
              /><stop
                offset="0.02"
                stop-color="#fcd403"
              /><stop
                offset="0.22"
                stop-color="#e6be19"
              /><stop
                offset="0.43"
                stop-color="#d7ad29"
              /><stop
                offset="0.68"
                stop-color="#cea432"
              /><stop
                offset="1"
                stop-color="#cba135"
              /></linearGradient><linearGradient
                id="b"
                x1="24.75"
                y1="163.06"
                x2="282.35"
                y2="163.06"
                xlink:href="#a"
              /><linearGradient
                id="c"
                x1="76"
                y1="99.07"
                x2="212.99"
                y2="233.78"
                xlink:href="#a"
              /><linearGradient
                id="d"
                x1="56.95"
                y1="324.83"
                x2="259.85"
                y2="424.78"
                gradientUnits="userSpaceOnUse"
              ><stop
                offset="0"
                stop-color="gold"
              /><stop
                offset="1"
                stop-color="#cba135"
              /></linearGradient></defs><title>Neobase-gold-logo</title><path d="M55.26,124v136.5H31V31.22L6.82,7V284.68H147.49l-24.23-24.22H79.49v-78L99.9,202.85l3.8,3.8,5.37,5.37,96.87,96.88H103.7l23.71,24.22h137Z" /><path d="M239.45,214.7V78.2h24.23V307.44l24.21,24.22V54H147.22L171.45,78.2h43.78v78L88.77,29.76H191L167.3,5.54h-137Z" /><polygon points="242.27 248.4 243.42 281.4 52.44 90.27 51.29 57.26 242.27 248.4" /><path
                d="M49.72,118.42v136.5H25.5V25.68L1.28,1.47V279.15H142l-24.23-24.23H74v-78l20.41,20.42,3.8,3.79,5.37,5.37,96.88,96.88H98.16l23.71,24.23h137Z"
                style="fill:url(#a)"
              /><path
                d="M233.91,209.17V72.66h24.23V301.91l24.21,24.21V48.44H141.69l24.22,24.22h43.78v78L83.23,24.23H185.48L161.76,0h-137Z"
                style="fill:url(#b)"
              /><polygon
                points="236.73 242.86 237.88 275.86 46.91 84.73 45.75 51.72 236.73 242.86"
                style="fill:url(#c)"
              /><text
                transform="translate(0 392.36)"
                style="font-size:57.46369934082031px;font-family:DepofixRegular, Depofix"
              >N<tspan
                x="44.48"
                y="0"
                style="font-family:ZeniqNano, Zeniq Nano"
              >EO</tspan><tspan
                x="129.29"
                y="0"
                style="letter-spacing:-0.00497936637881475em"
              >B</tspan><tspan
                x="171.7"
                y="0"
              >A</tspan><tspan
                x="210.32"
                y="0"
                style="font-family:ZeniqNano, Zeniq Nano"
              >SE</tspan></text><text
                transform="translate(0 387.73)"
                style="font-size:57.46369934082031px;font-family:DepofixRegular, Depofix"
              >N<tspan
                x="44.48"
                y="0"
                style="font-family:ZeniqNano, Zeniq Nano"
              >EO</tspan><tspan
                x="129.29"
                y="0"
                style="letter-spacing:-0.00497936637881475em"
              >B</tspan><tspan
                x="171.7"
                y="0"
              >A</tspan><tspan
                x="210.32"
                y="0"
                style="font-family:ZeniqNano, Zeniq Nano"
              >SE</tspan></text><path
                d="M34.55,386.76l-23.9-27.95v25.88a3.06,3.06,0,1,1-6.11,0V350.58c0-2.36,3.1-4.7,5.79-1.55L33.8,376.48v-25.9a3.06,3.06,0,1,1,6.11,0v34.11a3.08,3.08,0,0,1-1.77,2.77A3,3,0,0,1,34.55,386.76Z"
                style="fill:url(#d)"
              /><path
                d="M78.38,347.51v6.38h-31v-6.38Zm0,40.22h-31V364.46h31v6.32H53.73v10.57H78.38Z"
                style="fill:url(#d)"
              /><path
                d="M126.42,367.62a21.15,21.15,0,1,1-21.15-21.15A21.17,21.17,0,0,1,126.42,367.62Zm-21.15-14.54a14.54,14.54,0,1,0,14.54,14.54A14.52,14.52,0,0,0,105.27,353.08Z"
                style="fill:url(#d)"
              /><path
                d="M156.87,347.51a11.57,11.57,0,0,1,7.82,20.11,11.57,11.57,0,0,1-7.82,20.11H136.14a3.06,3.06,0,0,1-3.06-3.05V367.62a3.07,3.07,0,0,1,3.06-3.06h20.73a5.47,5.47,0,0,0,0-10.94H136.14a3.06,3.06,0,1,1,0-6.11Zm0,34.11a5.48,5.48,0,1,0,0-10.95H139.2v10.95Z"
                style="fill:url(#d)"
              /><path
                d="M173.31,383.47c2.16-4.93,13.49-32.85,15.9-35.15a2.66,2.66,0,0,1,1.79-.81,2.62,2.62,0,0,1,1.79.81c2.42,2.3,13.74,30.22,15.9,35.15,1.61,3.68-4,6.11-5.58,2.44L191,358.27l-12.1,27.64C177.29,389.58,171.7,387.15,173.31,383.47Z"
                style="fill:url(#d)"
              /><path
                d="M238.13,356.13a14.13,14.13,0,0,0-9.88-3.51,10.32,10.32,0,0,0-3.34.86,6.36,6.36,0,0,0-2.3,1.73,5.14,5.14,0,0,0-1.2,3.9c.57,3.22,4.88,4.49,9.19,5.69,7.13,2.07,14.19,4.08,13.33,13.51v.05a11.25,11.25,0,0,1-2.3,5.46,13.3,13.3,0,0,1-6.2,4.08,18.6,18.6,0,0,1-8.05.58,28,28,0,0,1-14.19-6.32l4-5A22,22,0,0,0,228.13,382a12.31,12.31,0,0,0,5.34-.34,6.21,6.21,0,0,0,3.11-2,4,4,0,0,0,.92-2.12c.28-4-4.14-5.29-8.68-6.61-6.38-1.78-12.81-3.68-13.85-11.21v-.23a12,12,0,0,1,2.7-8.56,14,14,0,0,1,4.48-3.39,16.92,16.92,0,0,1,5.64-1.44,20.43,20.43,0,0,1,14.48,5Z"
                style="fill:url(#d)"
              /><path
                d="M280.77,347.51v6.38h-31v-6.38Zm0,40.22h-31V364.46h31v6.32H256.11v10.57h24.66Z"
                style="fill:url(#d)"
              /></svg>
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->
    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="evt => { shallShadowBottom = evt.srcElement.scrollTop > 0 }"
    >
      <vertical-nav-menu-items
        :items.sync="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { BLink, BImg } from 'bootstrap-vue'
import { provide, computed, ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeConfig } from '@themeConfig'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'

export default {
  components: {
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    BImg,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'))

    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
