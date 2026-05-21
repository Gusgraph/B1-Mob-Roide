import { Link, Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function FrontPage() {
  const { isAuthenticated, isLoading } = useAuth();

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
          <Text style={styles.title}>Bismel1</Text>
          <Text style={styles.subtitle}>
            Trading automation, account visibility, and activity review in one mobile app.
          </Text>
        </View>

        <View style={styles.actions}>
          <Link href={'/(auth)/login' as never} asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>
          </Link>
          <Link href={'/(auth)/plans' as never} asChild>
            <Pressable style={styles.secondaryButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  copy: {
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
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
    borderRadius: 8,
    padding: spacing.lg,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
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
