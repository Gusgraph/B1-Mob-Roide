// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: index.tsx - app/index.tsx
// =====================================================
import { Link, Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChartCandlestick, LockKeyhole, Sparkles } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function FrontPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (isLoading) {
    return <LoadingState label="Preparing secure session" />;
  }

  if (isAuthenticated) {
    return <Redirect href={'/(tabs)/dashboard' as never} />;
  }

  return (
    <AppShell scroll={false}>
      <View style={styles.container}>
        <View style={styles.copy}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <ChartCandlestick color={colors.cyan} size={23} />
            </View>
            <Text style={styles.kicker}>Neon Trading Terminal</Text>
          </View>
          <Text style={styles.title}>Bismel1</Text>
          <Text style={styles.subtitle}>
            Trading automation, account visibility, and activity review in one mobile app.
          </Text>
        </View>

        <View style={styles.actions}>
          <Link href={'/(auth)/login' as never} asChild>
            <Pressable style={styles.primaryButton}>
              <LockKeyhole color={colors.white} size={17} />
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>
          </Link>
          <Link href={'/(auth)/plans' as never} asChild>
            <Pressable style={styles.secondaryButton}>
              <Sparkles color={colors.accent} size={17} />
              <Text style={styles.secondaryText}>View Plans</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.disclosure}>
          Trading involves risk. Bismel1 is software and does not guarantee trading results.
        </Text>
      </View>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  copy: {
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.accentMuted,
    borderColor: colors.borderStrong,
    borderRadius: 9,
    borderWidth: 1,
    height: 43,
    justifyContent: 'center',
    width: 43,
  },
  kicker: {
    color: colors.accent,
    fontSize: typography.label,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 43,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.h3,
    lineHeight: 27,
  },
  actions: {
    gap: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  primaryText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  disclosure: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
});
