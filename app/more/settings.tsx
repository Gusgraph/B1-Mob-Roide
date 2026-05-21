// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: settings.tsx - app/more/settings.tsx
// =====================================================
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = makeStyles(colors);

  return (
    <AppShell title="Settings">
      <Bismel1Card>
        <View style={styles.row}>
          {isDark ? <Moon color={colors.purple} size={19} /> : <Sun color={colors.warning} size={19} />}
          <View style={styles.copy}>
            <Text style={styles.title}>Theme</Text>
            <Text style={styles.text}>{isDark ? 'Dark neon terminal' : 'Light market terminal'}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={toggleTheme} style={styles.toggle}>
            <Text style={styles.toggleText}>{isDark ? 'Light' : 'Dark'}</Text>
          </Pressable>
        </View>
      </Bismel1Card>
      <EmptyState message="No editable settings returned by the mobile API." />
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  toggle: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.borderStrong,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
});
