
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProviderProps } from "@/components/ui/theme-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";
type ColorScheme = "slate" | "blue" | "green" | "orange" | "red" | "violet" | "zinc" | "yellow" | "gray" | "primary";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  radius: number;
  setRadius: (radius: number) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorScheme: "zinc",
  setColorScheme: () => null,
  radius: 0.5,
  setRadius: () => null,
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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
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

  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    radius,
    setRadius,
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
