import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Package } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function ProductsScreen() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.products);
        setItems(asArray(asRecord(response).products || response).map(asRecord));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Products">
      {isLoading ? <LoadingState label="Loading products" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? <EmptyState message="No products returned." /> : null}
      {items.map((item, index) => (
        <Bismel1Card key={String(item.id || item.slug || index)}>
          <Package color={colors.accent} size={19} />
          <Text style={styles.title}>{firstString(item, ['name', 'title', 'slug'], 'Product')}</Text>
          <StatusBadge label={firstString(item, ['status', 'state'], 'Status unavailable')} />
        </Bismel1Card>
      ))}
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
});
