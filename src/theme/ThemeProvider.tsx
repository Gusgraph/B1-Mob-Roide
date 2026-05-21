import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, ThemeMode, themes } from '@/theme/colors';

type ThemeContextValue = {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(
    systemScheme === 'light' ? 'light' : 'dark',
  );

  const toggleTheme = useCallback(() => {
    setSelectedMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      colors: themes[selectedMode],
      mode: selectedMode,
      isDark: selectedMode === 'dark',
      toggleTheme,
      setThemeMode: setSelectedMode,
    }),
    [selectedMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return value;
}
