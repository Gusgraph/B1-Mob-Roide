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
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyRound, Save, Settings } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asRecord, firstString } from '@/utils/records';

export default function SettingsScreen() {
  const { reloadMe } = useAuth();
  const [settingsProfile, setSettingsProfile] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        let response = normalizeSettings(await api.get<unknown>(endpoints.profileSettings));

        if (!firstString(response, ['name', 'display_name'], '') || !firstString(response, ['email', 'login_email'], '')) {
          response = normalizeSettings(await api.get<unknown>(endpoints.auth.me));
        }

        setSettingsProfile(response);
        setName(firstString(response, ['name', 'display_name'], ''));
        setEmail(firstString(response, ['email', 'login_email'], ''));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const emailVerified = settingsProfile?.email_verified === true;

  return (
    <AppShell title="Settings" showAccountNav>
      {isLoading ? <LoadingState label="Loading settings" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error ? (
        <>
          <Bismel1Card>
            <Settings color={colors.accent} size={19} />
            <Text style={styles.title}>User Basic Info</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                autoCapitalize="words"
                onChangeText={setName}
                placeholder="Display name"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={name}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Login Email</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={email}
              />
            </View>
            <DataRow label="Email Status" value={emailVerified ? 'Verified' : 'Unverified'} tone={emailVerified ? 'success' : 'warning'} />
            {profileMessage ? <Text style={styles.successText}>{profileMessage}</Text> : null}
            <Pressable
              accessibilityRole="button"
              disabled={isSavingProfile}
              onPress={saveProfile}
              style={[styles.button, isSavingProfile && styles.buttonDisabled]}
            >
              <Save color={colors.white} size={15} />
              <Text style={styles.buttonText}>{isSavingProfile ? 'Saving' : 'Save Profile'}</Text>
            </Pressable>
          </Bismel1Card>
          <Bismel1Card>
            <KeyRound color={colors.warning} size={19} />
            <Text style={styles.title}>Password</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={styles.input}
                textContentType="password"
                value={currentPassword}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={styles.input}
                textContentType="newPassword"
                value={newPassword}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={styles.input}
                textContentType="newPassword"
                value={confirmPassword}
              />
            </View>
            {passwordMessage ? <Text style={styles.successText}>{passwordMessage}</Text> : null}
            <Pressable
              accessibilityRole="button"
              disabled={isSavingPassword}
              onPress={savePassword}
              style={[styles.button, isSavingPassword && styles.buttonDisabled]}
            >
              <KeyRound color={colors.white} size={15} />
              <Text style={styles.buttonText}>{isSavingPassword ? 'Saving' : 'Update Password'}</Text>
            </Pressable>
          </Bismel1Card>
        </>
      ) : null}
    </AppShell>
  );

  async function saveProfile() {
    setError(null);
    setProfileMessage(null);
    setIsSavingProfile(true);

    try {
      const response = normalizeSettings(await api.patch<unknown>(endpoints.profileSettings, {
        name: name.trim(),
        email: email.trim(),
      }));
      setSettingsProfile(response);
      setName(firstString(response, ['name', 'display_name'], name.trim()));
      setEmail(firstString(response, ['email', 'login_email'], email.trim()));
      setProfileMessage('Profile saved.');
      await reloadMe();
    } catch (saveError) {
      setError(customerSafeMessage(saveError));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function savePassword() {
    setError(null);
    setPasswordMessage(null);
    setIsSavingPassword(true);

    try {
      await api.patch<unknown>(endpoints.profilePassword, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated.');
    } catch (saveError) {
      setError(customerSafeMessage(saveError));
    } finally {
      setIsSavingPassword(false);
    }
  }
}

const normalizeSettings = (value: unknown) => {
  const record = asRecord(value);
  const settings = asRecord(record.settings);
  const profile = asRecord(record.profile);
  const profileSettings = asRecord(record.profile_settings);
  const user = asRecord(record.user);
  const selectedUser = asRecord(record.selected_user);

  if (Object.keys(settings).length) {
    return settings;
  }

  if (Object.keys(profile).length) {
    return profile;
  }

  if (Object.keys(profileSettings).length) {
    const fields = asRecord(profileSettings.fields);
    const profileSettingsUser = asRecord(profileSettings.user);

    return {
      ...profileSettingsUser,
      ...fields,
      email_verified: profileSettingsUser.email_verified,
    };
  }

  if (Object.keys(user).length) {
    return user;
  }

  if (Object.keys(selectedUser).length) {
    return selectedUser;
  }

  return record;
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 51,
    paddingHorizontal: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 51,
    paddingHorizontal: 15,
  },
  buttonDisabled: {
    opacity: 0.57,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  successText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
});
