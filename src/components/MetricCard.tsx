import { StyleSheet, Text } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Bismel1Card } from '@/components/Bismel1Card';

export function MetricCard({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <Bismel1Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueTone(value, colors) }]}>{value}</Text>
    </Bismel1Card>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
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

const valueTone = (value: string, colors: ThemeColors) => {
  if (value.trim().startsWith('-')) {
    return colors.danger;
  }

  if (value.trim().startsWith('+')) {
    return colors.success;
  }

  return colors.text;
};
