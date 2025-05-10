// Theme types for the application
export type Mode = 'light' | 'dark' | 'system'
export type Skin = 'default' | 'bordered'
export type Layout = 'vertical' | 'horizontal'
export type Direction = 'ltr' | 'rtl'

// Theme settings type
export type ThemeSettings = {
  mode?: Mode
  skin?: Skin
  semiDark?: boolean
  layout?: Layout
  primaryColor?: string
}

// Update settings options type
export type UpdateSettingsOptions = {
  updateStorage?: boolean
}
