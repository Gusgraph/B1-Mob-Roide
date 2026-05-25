// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: profile.tsx - app/more/profile.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        setProfile(asRecord(await api.get<unknown>(endpoints.auth.me)));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const profileUser = asRecord(profile?.user);
  const selectedAccount = asRecord(profile?.selected_account);
  const activeProducts = asArray(profile?.active_products).map(asRecord);

  return (
    <AppShell title="Profile" showAccountNav>
      {isLoading ? <LoadingState label="Loading profile" /> : null}
      {error ? <ErrorState message={error} /> : null}
      <ResponsiveGrid>
        <Bismel1Card>
          <UserRound color={colors.accent} size={19} />
          <Text style={styles.title}>{firstString(profileUser, ['name'], user?.name || 'Bismel1 Customer')}</Text>
          <Text style={styles.text}>{firstString(profileUser, ['email'], user?.email || 'Email unavailable')}</Text>
          <DataRow label="Email Status" value={profileUser.email_verified === true ? 'Verified' : 'Needs verification'} tone={profileUser.email_verified === true ? 'success' : 'warning'} />
          <DataRow label="Account" value={firstString(selectedAccount, ['label'], 'Unavailable')} />
          <DataRow label="Access" value={firstString(selectedAccount, ['status'], 'Unavailable')} tone={selectedAccount.status === 'active' ? 'success' : 'warning'} />
          <DataRow label="Products" value={activeProducts.map((product) => firstString(product, ['name', 'code'], '')).filter(Boolean).join(', ') || 'Unavailable'} />
        </Bismel1Card>
      </ResponsiveGrid>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});
