import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
) {
  const { colors } = useTheme();

  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
