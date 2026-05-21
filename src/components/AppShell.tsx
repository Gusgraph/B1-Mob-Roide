import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type AppShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  scroll?: boolean;
}>;

export function AppShell({ title, subtitle, scroll = true, children }: AppShellProps) {
  const content = (
    <View style={styles.content}>
      {title ? (
        <View style={styles.header}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
});

