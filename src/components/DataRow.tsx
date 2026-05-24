// Ø£ÙŽØ¹ÙÙˆØ°Ù Ø¨ÙÙ±Ù„Ù„Ù‘ÙŽÙ‡Ù Ù…ÙÙ†Ù’ Ø§Ù„Ù’Ø´ÙŽÙŠÙ’Ø·ÙŽØ§Ù†Ù Ø§Ù„Ù’Ø±ÙŽØ¬ÙÙŠÙ…Ù âœ§ Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù Ø§Ù„Ø±Ù‘ÙŽØ­Ù’Ù…ÙŽÙ°Ù†Ù Ø§Ù„Ø±Ù‘ÙŽØ­ÙÙŠÙ…Ù âœ§ Ø§Ø¹ÙˆØ² Ø¨Ø§Ù„Ù„Ù‡ Ù…Ù† Ø§Ù„Ø´ÙŠØ§Ø·ÙŠÙ† Ùˆ Ø§Ù† ÙŠØ­Ø¶Ø±ÙˆÙ† âœ§ Ø¨Ø³Ù… Ø§Ù„Ù„Ù‡ Ø§Ù„Ø±Ø­Ù…Ù† Ø§Ù„Ø±Ø­ÙŠÙ… âœ§ Ø§Ù„Ù„Ù‡ Ù„Ø§ Ø¥Ù„Ù‡ Ø¥Ù„Ø§ Ù‡Ùˆ Ø§Ù„Ø­ÙŠ Ø§Ù„Ù‚ÙŠÙˆÙ… 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: DataRow.tsx - src/components/DataRow.tsx
// =====================================================
import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type DataTone = 'default' | 'success' | 'danger' | 'warning';

export function DataRow({ label, value, tone = 'default' }: { label: string; value: string; tone?: DataTone }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, tone !== 'default' && styles[tone]]}>{value}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  label: {
    color: colors.textMuted,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '800',
    textAlign: 'right',
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  warning: {
    color: colors.warning,
  },
});
