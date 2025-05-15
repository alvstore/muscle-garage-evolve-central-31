import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
interface ThemeToggleProps {
  className?: string;
}
const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = ''
}) => {
  const {
    settings,
    updateSettings
  } = useTheme();
  const toggleTheme = () => {
    const newMode = settings.mode === 'light' ? 'dark' : 'light';
    updateSettings({
      mode: newMode
    });
  };
  return;
};
export default ThemeToggle;