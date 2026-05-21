import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

export function Bismel1Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={isDark ? ['rgba(47,206,255,0.16)', 'rgba(168,85,247,0.06)', 'transparent'] : ['rgba(0,120,216,0.12)', 'rgba(124,58,237,0.06)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={styles.glow}
      />
      <View style={styles.edge} />
      {children}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  edge: {
    backgroundColor: colors.borderStrong,
    borderRadius: 999,
    height: 3,
    opacity: 0.75,
    width: 43,
  },
});
