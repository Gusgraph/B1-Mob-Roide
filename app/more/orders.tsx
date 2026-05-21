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
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/dates';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.orders);
        setOrders(asArray(asRecord(response).orders || response).map(asRecord));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Orders">
      {isLoading ? <LoadingState label="Loading orders" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && orders.length === 0 ? <EmptyState message="No orders returned." /> : null}
      {orders.map((order, index) => (
        <Bismel1Card key={String(order.id || index)}>
          <Text style={styles.title}>{firstString(order, ['symbol', 'client_order_id', 'id'], 'Order')}</Text>
          <Text style={styles.text}>{firstString(order, ['status', 'side', 'type'], '')}</Text>
          <Text style={styles.text}>{formatDateTime(order.created_at || order.submitted_at)}</Text>
        </Bismel1Card>
      ))}
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

