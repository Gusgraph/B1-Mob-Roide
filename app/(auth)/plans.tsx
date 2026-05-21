import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gem } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Plan } from '@/api/types';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function PlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.plans, false);
        const record = asRecord(response);
        setPlans(asArray(record.plans || response));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Plans" subtitle="Available plans are loaded from the Bismel1 API.">
      {isLoading ? <LoadingState label="Loading plans" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && plans.length === 0 ? <EmptyState message="No plans are available." /> : null}
      {plans.map((plan, index) => {
        const record = asRecord(plan);
        return (
          <Bismel1Card key={String(record.id || record.slug || index)}>
            <Gem color={colors.accent} size={19} />
            <Text style={styles.name}>{firstString(record, ['name', 'title', 'label'], 'Plan')}</Text>
            <Text style={styles.description}>{firstString(record, ['description', 'summary'], '')}</Text>
            {record.price || record.amount ? (
              <Text style={styles.price}>{firstString(record, ['price', 'amount'])}</Text>
            ) : null}
          </Bismel1Card>
        );
      })}
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  name: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  price: {
    color: colors.accent,
    fontSize: typography.h2,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});
