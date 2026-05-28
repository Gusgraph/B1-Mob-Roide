// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: login.tsx - app/(auth)/login.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Check, Eye, EyeOff, LogIn, Mail, Shield } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { ErrorState } from '@/components/ErrorState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { useAuth } from '@/auth/useAuth';
import { loginPreferenceStore } from '@/auth/loginPreferenceStore';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LoginScreen() {
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    let mounted = true;

    const loadRememberedEmail = async () => {
      const rememberedEmail = await loginPreferenceStore.getRememberedEmail();

      if (mounted && rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberEmail(true);
      }
    };

    loadRememberedEmail();

    return () => {
      mounted = false;
    };
  }, []);

  const submit = async () => {
    setIsSubmitting(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      await login(normalizedEmail, password);
      if (rememberEmail) {
        await loginPreferenceStore.setRememberedEmail(normalizedEmail);
      } else {
        await loginPreferenceStore.clearRememberedEmail();
      }
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || !email.trim() || !password;

  return (
    <AppShell title="Login">
      <ResponsiveGrid>
      <View style={styles.form}>
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Mail color={colors.accent} size={15} />
            <Text style={styles.label}>Email</Text>
          </View>
          <View style={[styles.inputShell, focusedField === 'email' && styles.inputFocused]}>
            <TextInput
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect={false}
              importantForAutofill="yes"
              keyboardType="email-address"
              onBlur={() => setFocusedField(null)}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onSubmitEditing={() => undefined}
              placeholder="email@example.com"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              style={styles.input}
              textContentType="username"
              underlineColorAndroid="transparent"
              value={email}
            />
          </View>
        </View>
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Shield color={colors.purple} size={15} />
            <Text style={styles.label}>Password</Text>
          </View>
          <View style={[styles.inputShell, styles.passwordBox, focusedField === 'password' && styles.inputFocused]}>
            <TextInput
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              importantForAutofill="yes"
              onBlur={() => setFocusedField(null)}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onSubmitEditing={() => {
                if (!disabled) {
                  void submit();
                }
              }}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              secureTextEntry={!passwordVisible}
              spellCheck={false}
              style={[styles.input, styles.passwordInput]}
              textContentType="password"
              underlineColorAndroid="transparent"
              value={password}
            />
            <Pressable
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
              onPress={() => setPasswordVisible((visible) => !visible)}
              style={styles.eyeButton}
            >
              {passwordVisible ? (
                <EyeOff color={colors.textMuted} size={17} />
              ) : (
                <Eye color={colors.textMuted} size={17} />
              )}
            </Pressable>
          </View>
        </View>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberEmail }}
          onPress={async () => {
            const nextValue = !rememberEmail;
            setRememberEmail(nextValue);

            if (!nextValue) {
              await loginPreferenceStore.clearRememberedEmail();
            }
          }}
          style={styles.rememberRow}
        >
          <View style={[styles.checkbox, rememberEmail && styles.checkboxActive]}>
            {rememberEmail ? <Check color={colors.black} size={13} strokeWidth={3} /> : null}
          </View>
          <Text style={styles.rememberText}>Save username/email</Text>
        </Pressable>
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
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Dont Have Account?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL('https://bismel1.com/')}
            style={styles.signupLink}
          >
            <Text style={styles.signupLinkText}>Signup here</Text>
          </Pressable>
        </View>
      </View>
      </ResponsiveGrid>
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
  inputShell: {
    backgroundColor: colors.cyan,
    borderRadius: 9,
    shadowColor: colors.cyan,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.57,
    shadowRadius: 13,
    padding: 2,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 7,
    color: colors.text,
    fontSize: typography.body,
    padding: spacing.lg,
  },
  inputFocused: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.67,
    shadowRadius: 15,
    elevation: 2,
  },
  passwordBox: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 53,
  },
  eyeButton: {
    alignItems: 'center',
    height: 43,
    justifyContent: 'center',
    position: 'absolute',
    right: 9,
    top: 9,
    width: 43,
  },
  rememberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: -3,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 6,
    borderWidth: 1,
    height: 23,
    justifyContent: 'center',
    width: 23,
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.cyan,
  },
  rememberText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
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
  signupRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    justifyContent: 'center',
    paddingTop: 19,
  },
  signupText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  signupLink: {
    borderBottomColor: colors.accent,
    borderBottomWidth: 1,
    paddingVertical: 3,
  },
  signupLinkText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
});
