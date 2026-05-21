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
import { Pressable, StyleSheet, Text } from 'react-native';
import { BadgeDollarSign, ExternalLink } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asRecord, firstString } from '@/utils/records';

export default function BillingScreen() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        setSummary(asRecord(await api.get<unknown>(endpoints.billingSummary)));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const openPortal = async () => {
    setIsOpening(true);
    setError(null);
    try {
      await api.post(endpoints.billingPortal);
    } catch (portalError) {
      setError(customerSafeMessage(portalError));
    } finally {
      setIsOpening(false);
    }
  };

  const canOpenPortal = Boolean(summary?.can_open_portal || asRecord(summary?.actions).billing_portal);

  return (
    <AppShell title="Billing">
      {isLoading ? <LoadingState label="Loading billing" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {summary ? (
        <Bismel1Card>
          <BadgeDollarSign color={colors.success} size={19} />
          <Text style={styles.title}>{firstString(summary, ['plan_name', 'plan', 'status'], 'Billing')}</Text>
          <Text style={styles.text}>{firstString(summary, ['renewal_date', 'next_invoice_at', 'message'], '')}</Text>
          {canOpenPortal ? (
            <Pressable style={styles.button} onPress={openPortal} disabled={isOpening}>
              <ExternalLink color={colors.white} size={15} />
              <Text style={styles.buttonText}>{isOpening ? 'Opening' : 'Open Billing Portal'}</Text>
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
