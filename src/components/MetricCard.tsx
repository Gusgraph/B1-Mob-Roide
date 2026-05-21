// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: MetricCard.tsx - src/components/MetricCard.tsx
// =====================================================
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
