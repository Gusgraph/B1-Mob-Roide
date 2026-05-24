// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: billing.tsx - app/more/billing.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { BadgeDollarSign, ExternalLink } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/dates';
import { asRecord, firstString } from '@/utils/records';

export default function BillingScreen() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = asRecord(await api.get<unknown>(endpoints.billingSummary));
        setSummary(asRecord(response.billing || response));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const openPortal = async () => {
    setError(null);
    try {
      await Linking.openURL('https://bismel1.com/customer/billing');
    } catch (portalError) {
      setError(customerSafeMessage(portalError));
    }
  };

  const canOpenPortal = Boolean(summary);

  return (
    <AppShell title="Billing" showAccountNav>
      {isLoading ? <LoadingState label="Loading billing" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {summary ? (
        <Bismel1Card>
          <BadgeDollarSign color={colors.success} size={19} />
          <Text style={styles.title}>{firstString(summary, ['plan_label', 'plan_name', 'plan_code'], 'Billing')}</Text>
          <DataRow label="Subscription" value={firstString(summary, ['subscription_status', 'stripe_status'], 'Unavailable')} tone={summary.subscription_active === true ? 'success' : 'warning'} />
          <DataRow label="Billing ID" value={firstString(summary, ['customer_id'], 'Unavailable')} />
          <DataRow label="Add-ons" value={firstString(summary, ['add_on_count'], '0')} />
          <DataRow label="Confirmed" value={formatDateTime(summary.confirmed_at)} />
          <Text style={styles.text}>{firstString(summary, ['blocked_summary', 'message'], '')}</Text>
          {canOpenPortal ? (
            <Pressable style={styles.button} onPress={openPortal}>
              <ExternalLink color={colors.white} size={15} />
              <Text style={styles.buttonText}>Open Billing Portal</Text>
            </Pressable>
          ) : null}
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
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
