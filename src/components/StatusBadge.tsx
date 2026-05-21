import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Status = 'success' | 'warning' | 'danger' | 'neutral';

export function StatusBadge({ label, status = 'neutral' }: { label: string; status?: Status }) {
  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.white,
    fontSize: typography.label,
    fontWeight: '700',
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  neutral: {
    backgroundColor: colors.surfaceMuted,
  },
});

