
import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";

type Theme = "light" | "dark" | "system";
type ColorScheme = "slate" | "blue" | "green" | "orange" | "red" | "violet" | "zinc" | "yellow" | "gray" | "primary";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  radius: number;
  setRadius: (radius: number) => void;
  // Added compatibility properties
  mode: Theme;
  setMode: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  settings: {
    mode: Theme;
    semiDark: boolean;
  };
  updateSettings: (settings: { mode?: Theme; semiDark?: boolean }) => void;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  defaultRadius?: number;
  storageKey?: string;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorScheme: "zinc",
  setColorScheme: () => null,
  radius: 0.5,
  setRadius: () => null,
  // Added compatibility properties
  mode: "system",
  setMode: () => null,
  isDark: false,
  toggleTheme: () => null,
  settings: {
    mode: "system",
    semiDark: false
  },
  updateSettings: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "zinc",
  defaultRadius = 0.5,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>("ui-theme", defaultTheme);
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    "ui-color-scheme",
    defaultColorScheme
  );
  const [radius, setRadius] = useLocalStorage<number>(
    "ui-radius",
    defaultRadius
  );
  const [semiDark, setSemiDark] = useLocalStorage<boolean>(
    "ui-semi-dark",
    false
  );
  
  // Calculate if we're in dark mode based on the theme
  const [isDark, setIsDark] = useState<boolean>(theme === "dark" || 
    (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      setIsDark(systemTheme === "dark");
      return;
    }

    root.classList.add(theme);
    setIsDark(theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("color-scheme-")) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(`color-scheme-${colorScheme}`);
    
    // Apply primary color to CSS variables
    document.documentElement.style.setProperty('--primary', `hsl(var(--${colorScheme}))`);
    document.documentElement.style.setProperty('--primary-foreground', `hsl(var(--${colorScheme}-foreground))`);
    
  }, [colorScheme]);

  useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("radius-")) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(`radius-${radius}`);
    document.documentElement.style.setProperty('--radius', `${radius}rem`);
  }, [radius]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      // If system, then toggle based on current appearance
      setTheme(isDark ? "light" : "dark");
    }
  };

  const updateSettings = (newSettings: { mode?: Theme; semiDark?: boolean }) => {
    if (newSettings.mode) {
      setTheme(newSettings.mode);
    }
    if (newSettings.semiDark !== undefined) {
      setSemiDark(newSettings.semiDark);
    }
  };

  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    radius,
    setRadius,
    // Added compatibility properties
    mode: theme,
    setMode: setTheme,
    isDark,
    toggleTheme,
    settings: {
      mode: theme,
      semiDark
    },
    updateSettings
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div
        className={cn(
          `theme-${theme}`,
          `color-scheme-${colorScheme}`,
          `radius-${radius}`
        )}
      >
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
