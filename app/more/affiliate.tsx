// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: affiliate.tsx - app/more/affiliate.tsx
// =====================================================
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Network } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asRecord, firstString } from '@/utils/records';

export default function AffiliateScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const approved = Boolean(user?.affiliate_approved || user?.affiliateApproved);

  useEffect(() => {
    if (!approved) {
      return;
    }

    const load = async () => {
      try {
        setSummary(asRecord(await api.get<unknown>(endpoints.affiliateSummary)));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [approved]);

  if (!approved) {
    return <Redirect href={'/(tabs)/more' as never} />;
  }

  return (
    <AppShell title="Affiliate">
      {isLoading ? <LoadingState label="Loading affiliate summary" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {summary ? (
        <Bismel1Card>
          <Network color={colors.accent} size={19} />
          <Text style={styles.title}>{firstString(summary, ['status', 'tier'], 'Affiliate')}</Text>
          <Text style={styles.text}>{firstString(summary, ['referrals_count', 'referrals', 'message'])}</Text>
        </Bismel1Card>
      ) : null}
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
