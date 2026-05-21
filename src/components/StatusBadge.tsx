// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: StatusBadge.tsx - src/components/StatusBadge.tsx
// =====================================================
import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Status = 'success' | 'warning' | 'danger' | 'neutral';

export function StatusBadge({ label, status = 'neutral' }: { label: string; status?: Status }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: typography.label,
    fontWeight: '700',
  },
  success: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warningMuted,
    borderColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.dangerMuted,
    borderColor: colors.danger,
  },
  neutral: {
    backgroundColor: colors.surfaceMuted,
  },
});
