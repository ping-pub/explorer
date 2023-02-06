import { useTheme } from 'vuetify'
import { useThemeConfig } from '@core/composable/useThemeConfig'

const { skin } = useThemeConfig()

// composable function to return the image variant as per the current theme and skin
export const useGenerateImageVariant = (imgLight: string, imgDark: string, imgLightBordered?: string, imgDarkBordered?: string, bordered = false) => {
  const { global } = useTheme()

  return computed(() => {
    if (global.name.value === 'light') {
      if (skin.value === 'bordered' && bordered)
        return imgLightBordered

      else
        return imgLight
    }
    if (global.name.value === 'dark') {
      if (skin.value === 'bordered' && bordered)
        return imgDarkBordered

      else
        return imgDark
    }
  })
}
