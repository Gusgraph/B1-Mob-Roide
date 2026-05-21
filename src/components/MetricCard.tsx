import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Bismel1Card } from '@/components/Bismel1Card';

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Bismel1Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Bismel1Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: '47%',
    flex: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.label,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
