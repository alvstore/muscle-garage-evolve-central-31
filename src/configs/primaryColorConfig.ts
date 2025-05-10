
type ColorConfig = {
  name: string;
  main: string;
  light: string;
  dark: string;
}

const primaryColorConfig: ColorConfig[] = [
  {
    name: 'Purple',
    main: '#9b87f5',
    light: '#d6bcfa',
    dark: '#694fff',
  },
  {
    name: 'Blue',
    main: '#1EAEDB',
    light: '#90cdf4',
    dark: '#0462a1',
  },
  {
    name: 'Green',
    main: '#48bb78',
    light: '#9ae6b4',
    dark: '#2f855a',
  },
  {
    name: 'Orange',
    main: '#F97316',
    light: '#fdba74',
    dark: '#c2410c',
  },
  {
    name: 'Red',
    main: '#ef4444',
    light: '#fca5a5',
    dark: '#b91c1c',
  },
  {
    name: 'Pink',
    main: '#ec4899',
    light: '#f9a8d4',
    dark: '#be185d',
  },
  {
    name: 'Gray',
    main: '#6b7280',
    light: '#d1d5db',
    dark: '#374151',
  },
]

export default primaryColorConfig;
