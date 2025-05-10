// Theme types defined inline to avoid circular dependencies
export type Mode = 'light' | 'dark' | 'system'
export type Skin = 'default' | 'bordered'
export type Layout = 'vertical' | 'horizontal'

export type Config = {
  templateName: string
  settingsCookieName: string
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  primaryColor: string
}

const themeConfig: Config = {
  templateName: 'Muscle Garage',
  settingsCookieName: 'muscle-garage-theme',
  mode: 'system', // 'system', 'light', 'dark'
  skin: 'default', // 'default', 'bordered'
  semiDark: false, // true, false
  layout: 'vertical', // 'vertical', 'horizontal'
  primaryColor: '#7367F0' // Default primary color
}

export default themeConfig
