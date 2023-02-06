import { createLayouts } from '@layouts'
import '@layouts/styles/index.scss'
import { layoutConfig } from '@themeConfig'

// ℹ️ We generate layout config from our themeConfig so you don't have to write config twice
export default createLayouts(layoutConfig)
