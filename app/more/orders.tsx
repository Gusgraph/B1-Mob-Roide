// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: orders.tsx - app/more/orders.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReceiptText } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/dates';
import { formatMoney } from '@/utils/money';
import { LIST_PAGE_SIZE, paginatedEndpoint, uniqueRows } from '@/utils/pagination';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreOrders, setHasMoreOrders] = useState(false);
  const [visibleOrderCount, setVisibleOrderCount] = useState(LIST_PAGE_SIZE);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(paginatedEndpoint(endpoints.orders));
        const nextOrders = orderRows(response);

        setOrders(nextOrders);
        setHasMoreOrders(nextOrders.length >= LIST_PAGE_SIZE);
        setVisibleOrderCount(LIST_PAGE_SIZE);
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Orders" showAccountNav>
      {isLoading ? <LoadingState label="Loading orders" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && orders.length === 0 ? <EmptyState message="No orders returned." /> : null}
      <ResponsiveGrid>
        {orders.slice(0, visibleOrderCount).map((order, index) => (
          <Bismel1Card key={String(order.id || index)}>
            <View style={styles.cardHeader}>
              <ReceiptText color={colors.accent} size={19} />
              <View style={styles.copy}>
                <Text style={styles.title}>{firstString(order, ['symbol', 'client_order_id', 'order_ref', 'id'], 'Order')}</Text>
                <Text style={styles.text}>{firstString(order, ['safe_source_label'], 'Bismel1')}</Text>
              </View>
              <Text style={styles.status}>{firstString(order, ['status'], 'Status')}</Text>
            </View>
            <DataRow label="Side" value={firstString(order, ['side'], 'Unavailable')} />
            <DataRow label="Filled Qty" value={firstString(order, ['filled_qty', 'qty'], 'Unavailable')} />
            <DataRow label="Avg Fill" value={formatMoney(firstNumber(order, ['avg_fill', 'filled_avg_price']))} />
            <DataRow label="Value" value={formatMoney(firstNumber(order, ['order_value', 'notional']))} />
            <DataRow label="Submitted" value={formatDateTime(order.submitted_at || order.created_at)} />
          </Bismel1Card>
        ))}
      </ResponsiveGrid>
      {(hasMoreOrders || orders.length > visibleOrderCount) && !isLoading && !error ? (
        <View style={styles.loadMoreWrap}>
          <Pressable
            accessibilityLabel="Load more orders"
            accessibilityRole="button"
            disabled={isLoadingMore}
            onPress={loadMoreOrders}
            style={[styles.loadMoreButton, isLoadingMore && styles.loadMoreButtonDisabled]}
          >
            <Text style={styles.loadMoreText}>{isLoadingMore ? 'Loading' : 'Load More'}</Text>
          </Pressable>
        </View>
      ) : null}
    </AppShell>
  );

  async function loadMoreOrders() {
    if (isLoadingMore) {
      return;
    }

    if (orders.length > visibleOrderCount) {
      setVisibleOrderCount((count) => count + LIST_PAGE_SIZE);
      return;
    }

    setIsLoadingMore(true);
    try {
      const response = await api.get<unknown>(paginatedEndpoint(endpoints.orders, LIST_PAGE_SIZE, orders.length));
      const nextOrders = orderRows(response);

      setOrders((currentOrders) => uniqueRows(currentOrders, nextOrders, orderRowKey));
      setHasMoreOrders(nextOrders.length >= LIST_PAGE_SIZE);
      setVisibleOrderCount((count) => count + LIST_PAGE_SIZE);
      setError(null);
    } catch (loadMoreError) {
      setError(customerSafeMessage(loadMoreError));
    } finally {
      setIsLoadingMore(false);
    }
  }
}

const orderRows = (response: unknown) => asArray(asRecord(response).orders || response).map(asRecord);

const orderRowKey = (order: Record<string, unknown>, index: number) =>
  firstString(order, ['id', 'order_id', 'client_order_id', 'order_ref'], '') ||
  [
    firstString(order, ['symbol', 'ticker', 'asset_symbol'], ''),
    firstString(order, ['side', 'action'], ''),
    firstString(order, ['submitted_at', 'created_at'], ''),
    firstString(order, ['status'], ''),
  ].filter(Boolean).join('|') ||
  String(index);

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  status: {
    color: colors.success,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  loadMoreWrap: {
    alignItems: 'center',
    width: '100%',
  },
  loadMoreButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 113,
    paddingHorizontal: 17,
    paddingVertical: 9,
    shadowColor: colors.cyan,
    shadowOpacity: 0.27,
    shadowRadius: 13,
  },
  loadMoreButtonDisabled: {
    opacity: 0.57,
  },
  loadMoreText: {
    color: colors.cyan,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
