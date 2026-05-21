import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { ErrorState } from '@/components/ErrorState';
import { useAuth } from '@/auth/useAuth';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LoginScreen() {
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || !email.trim() || !password;

  return (
    <AppShell title="Login" subtitle="Access your Bismel1 mobile dashboard.">
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            textContentType="username"
            value={email}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={styles.input}
            textContentType="password"
            value={password}
          />
        </View>
        {authError ? <ErrorState message={authError} /> : null}
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={submit}
          style={[styles.button, disabled && styles.disabled]}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Signing in' : 'Login'}</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    padding: spacing.lg,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
});

