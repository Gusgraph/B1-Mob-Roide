// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: Bismel1Card.tsx - src/components/Bismel1Card.tsx
// =====================================================
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
