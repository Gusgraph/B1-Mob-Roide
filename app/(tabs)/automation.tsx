import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function AutomationScreen() {
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [automation, setAutomation] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.products);
        const products = asArray(asRecord(response).products || response).map(asRecord);
        const firstProduct = products[0];
        setProduct(firstProduct || null);

        const productId = firstProduct?.id || firstProduct?.slug;
        const accountSlot = firstProduct?.account_slot || firstProduct?.accountSlot || firstProduct?.slot || 1;

        if (productId) {
          setAutomation(asRecord(await api.get<unknown>(endpoints.automation(String(productId), String(accountSlot)))));
        }
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const symbols = asArray(automation?.symbols);

  return (
    <AppShell title="Automation" subtitle="Product automation state returned by Laravel.">
      {isLoading ? <LoadingState label="Loading automation" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && !product ? <EmptyState message="No automation product is available." /> : null}
      {product ? (
        <Bismel1Card>
          <Text style={styles.title}>{firstString(product, ['name', 'title', 'slug'], 'Product')}</Text>
          <StatusBadge label={firstString(asRecord(automation), ['status', 'state'], 'Status unavailable')} />
          <Text style={styles.text}>Symbols returned: {symbols.length}</Text>
        </Bismel1Card>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
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

