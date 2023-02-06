import type { Ref } from 'vue'
import { useDisplay } from 'vuetify'

export const useResponsiveLeftSidebar = (mobileBreakpoint: Ref<boolean> | undefined = undefined) => {
  const { mdAndDown, name: currentBreakpoint } = useDisplay()

  const _mobileBreakpoint = mobileBreakpoint || mdAndDown

  const isLeftSidebarOpen = ref(true)

  const setInitialValue = () => {
    isLeftSidebarOpen.value = !_mobileBreakpoint.value
  }

  // Set the initial value of sidebar
  setInitialValue()

  watch(
    currentBreakpoint,
    () => {
      // Reset left sidebar
      isLeftSidebarOpen.value = !_mobileBreakpoint.value
    },
  )

  return {
    isLeftSidebarOpen,
  }
}
