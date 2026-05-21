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
