import { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type AppShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  scroll?: boolean;
}>;

export function AppShell({ title, subtitle, scroll = true, children }: AppShellProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = makeStyles(colors);

  const content = (
    <View style={styles.content}>
      <View style={styles.gridOne} />
      <View style={styles.gridTwo} />
      {title ? (
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LinearGradient
              colors={isDark ? [colors.cyan, colors.magenta] : [colors.accent, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signalBar}
            />
            <Pressable accessibilityRole="button" onPress={toggleTheme} style={styles.themeButton}>
              {isDark ? <Sun color={colors.warning} size={17} /> : <Moon color={colors.purple} size={17} />}
            </Pressable>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentInsetAdjustmentBehavior="automatic">{content}</ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    position: 'relative',
  },
  gridOne: {
    backgroundColor: colors.glow,
    borderRadius: 139,
    height: 219,
    position: 'absolute',
    right: -110,
    top: 52,
    width: 219,
  },
  gridTwo: {
    backgroundColor: colors.grid,
    borderRadius: 181,
    bottom: 160,
    height: 301,
    left: -180,
    position: 'absolute',
    width: 301,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signalBar: {
    borderRadius: 999,
    height: 3,
    width: 73,
  },
  themeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
});
