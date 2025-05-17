
export type Mode = 'light' | 'dark' | 'system';
export type Skin = 'default' | 'bordered';
export type Layout = 'vertical' | 'horizontal';

export interface ThemeSettings {
  mode: Mode;
  skin: Skin;
  semiDark: boolean;
  layout: Layout;
  primaryColor: string;
}

export interface UpdateSettingsOptions {
  updateStorage?: boolean;
}
