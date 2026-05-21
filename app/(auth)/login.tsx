import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LogIn, Mail, Shield } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { ErrorState } from '@/components/ErrorState';
import { useAuth } from '@/auth/useAuth';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LoginScreen() {
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

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
          <View style={styles.labelRow}>
            <Mail color={colors.accent} size={15} />
            <Text style={styles.label}>Email</Text>
          </View>
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
          <View style={styles.labelRow}>
            <Shield color={colors.purple} size={15} />
            <Text style={styles.label}>Password</Text>
          </View>
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
          <LogIn color={colors.white} size={17} />
          <Text style={styles.buttonText}>{isSubmitting ? 'Signing in' : 'Login'}</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
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
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    padding: spacing.lg,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
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
