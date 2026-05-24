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
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LockKeyhole, Sparkles } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { LoadingState } from '@/components/LoadingState';
import { LivePerformancePreview } from '@/features/home/LivePerformancePreview';
import { useAuth } from '@/auth/useAuth';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';

const PLANS_URL = 'https://www.bismel1.com/plans';

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
    <AppShell>
      <View style={styles.container}>
        <View style={styles.heroBlock}>
          <View style={styles.copy}>
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/android-icon-foreground.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>
                Bismel<Text style={styles.titleOne}>1</Text>
              </Text>
            </View>
            <Text style={styles.subtitle}>Automated AI Trading App</Text>
          </View>

          <View style={styles.actions}>
            <Link href={'/(auth)/login' as never} asChild>
              <Pressable style={styles.primaryButton}>
                <LockKeyhole color={colors.white} size={17} />
                <Text style={styles.primaryText}>Login</Text>
              </Pressable>
            </Link>
            <Pressable
              accessibilityRole="link"
              onPress={() => {
                void openBrowserAsync(PLANS_URL, {
                  presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
                });
              }}
              style={styles.secondaryButton}
            >
              <Sparkles color={colors.accent} size={17} />
              <Text style={styles.secondaryText}>View Plans</Text>
            </Pressable>
          </View>
        </View>

        <LivePerformancePreview />

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
    gap: 19,
    paddingVertical: 27,
  },
  heroBlock: {
    gap: 19,
  },
  copy: {
    gap: 15,
    marginTop: 11,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
  },
  logo: {
    borderRadius: 15,
    height: 51,
    width: 51,
  },
  title: {
    color: colors.text,
    fontSize: 39,
    fontWeight: '800',
  },
  titleOne: {
    color: colors.success,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.h3,
    lineHeight: 27,
  },
  actions: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.cyan,
    borderRadius: 9,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    paddingHorizontal: 19,
    paddingVertical: 11,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.magenta,
    borderRadius: 9,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    paddingHorizontal: 19,
    paddingVertical: 11,
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
    fontSize: 9,
    lineHeight: 13,
    opacity: 0.59,
  },
});
