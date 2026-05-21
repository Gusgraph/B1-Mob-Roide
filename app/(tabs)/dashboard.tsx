// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: dashboard.tsx - app/(tabs)/dashboard.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Activity, Bell, Boxes } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        setDashboard(asRecord(await api.get<unknown>(endpoints.dashboard)));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const snapshot = asRecord(dashboard?.account_snapshot || dashboard?.snapshot || dashboard?.account);
  const products = asArray(dashboard?.active_products || dashboard?.products);
  const activity = asArray(dashboard?.latest_activity || dashboard?.activity);
  const alerts = asArray(dashboard?.alerts || dashboard?.statuses);
  const openPositionsCount = firstNumber(asRecord(dashboard), ['open_positions_count', 'positions_count']);

  return (
    <AppShell title="Dashboard" subtitle="Account status and customer activity from the mobile API.">
      {isLoading ? <LoadingState label="Loading dashboard" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && !dashboard ? <EmptyState message="No account data available yet." /> : null}
      {dashboard ? (
        <>
          <View style={styles.metrics}>
            <MetricCard label="Equity" value={firstString(snapshot, ['equity', 'portfolio_value', 'balance'])} />
            <MetricCard
              label="Open Positions"
              value={openPositionsCount === undefined ? String(asArray(dashboard.positions).length) : String(openPositionsCount)}
            />
          </View>
          <Bismel1Card>
            <View style={styles.cardHeader}>
              <Boxes color={colors.cyan} size={19} />
              <Text style={styles.cardTitle}>Active Products</Text>
            </View>
            {products.length ? (
              products.slice(0, 4).map((product, index) => {
                const record = asRecord(product);
                return (
                  <View key={String(record.id || record.slug || index)} style={styles.row}>
                    <Text style={styles.rowText}>{firstString(record, ['name', 'title', 'slug'])}</Text>
                    <StatusBadge label={firstString(record, ['status'], 'Active')} status="success" />
                  </View>
                );
              })
            ) : (
              <Text style={styles.muted}>No active products returned.</Text>
            )}
          </Bismel1Card>
          <Bismel1Card>
            <View style={styles.cardHeader}>
              <Activity color={colors.purple} size={19} />
              <Text style={styles.cardTitle}>Latest Activity</Text>
            </View>
            {activity.length ? (
              activity.slice(0, 5).map((item, index) => {
                const record = asRecord(item);
                return (
                  <Text key={String(record.id || index)} style={styles.muted}>
                    {firstString(record, ['message', 'title', 'type'])}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.muted}>No activity returned.</Text>
            )}
          </Bismel1Card>
          <Bismel1Card>
            <View style={styles.cardHeader}>
              <Bell color={colors.warning} size={19} />
              <Text style={styles.cardTitle}>Alerts / Status</Text>
            </View>
            {alerts.length ? (
              alerts.slice(0, 4).map((item, index) => {
                const record = asRecord(item);
                return (
                  <Text key={String(record.id || index)} style={styles.muted}>
                    {firstString(record, ['message', 'label', 'status'])}
                  </Text>
                );
              })
            ) : (
              <StatusBadge label="No alerts returned" status="neutral" />
            )}
          </Bismel1Card>
        </>
      ) : null}
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
  },
  muted: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
});
