// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: ThemeProvider.tsx - src/theme/ThemeProvider.tsx
// =====================================================
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
