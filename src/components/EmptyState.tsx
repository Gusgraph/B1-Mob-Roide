// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: EmptyState.tsx - src/components/EmptyState.tsx
// =====================================================
import { StyleSheet, Text } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { Bismel1Card } from '@/components/Bismel1Card';

export function EmptyState({ message }: { message: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <Bismel1Card>
      <Text style={styles.text}>{message}</Text>
    </Bismel1Card>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
});
