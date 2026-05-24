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
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Activity, Bell, Boxes, X } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { MetricCard } from '@/components/MetricCard';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatMoney } from '@/utils/money';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';
import { formatDateTime } from '@/utils/dates';

type DashboardAlert = {
  key: string;
  label: string;
  value: string;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  dismissible: boolean;
  dismissEndpoint?: string;
};

export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [dismissedAlertKeys, setDismissedAlertKeys] = useState<string[]>([]);
  const [dismissingAlertKeys, setDismissingAlertKeys] = useState<string[]>([]);
  const [dismissError, setDismissError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const nextDashboard = asRecord(await api.get<unknown>(endpoints.dashboard));
        setDashboard(nextDashboard);
        setDismissedAlertKeys(asArray<unknown>(nextDashboard.dismissed_alert_keys).map((key) => String(key)));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const snapshot = asRecord(dashboard?.account_snapshot || dashboard?.snapshot || dashboard?.account);
  const brokerSnapshot = asRecord(snapshot.broker);
  const products = asArray(dashboard?.active_products || dashboard?.products);
  const activity = asArray(dashboard?.latest_activity || dashboard?.activity);
  const persistedDismissedAlertKeys = asArray<unknown>(dashboard?.dismissed_alert_keys).map((key) => String(key));
  const alerts = normalizeDashboardAlerts(dashboard)
    .filter((alert) => {
      const alertKeys = alertDismissalKeys(alert);

      return !alertKeys.some((key) => dismissedAlertKeys.includes(key) || persistedDismissedAlertKeys.includes(key));
    });
  const openPositionsCount = firstNumber(asRecord(dashboard), ['open_positions_count', 'positions_count']);
  const ordersCount = firstNumber(asRecord(dashboard), ['orders_count', 'open_orders_count']);
  const equity = firstNumber(snapshot, ['equity', 'portfolio_value', 'balance']) ??
    firstNumber(brokerSnapshot, ['equity', 'portfolio_value', 'balance']);

  return (
    <AppShell
      title="Dashboard"
      headerAccessory={(
        <Pressable
          accessibilityLabel="Open alerts"
          accessibilityRole="button"
          onPress={() => setAlertsOpen(true)}
          style={styles.alertButton}
        >
          <Bell color={alerts.length ? colors.warning : colors.textMuted} size={17} />
          {alerts.length ? (
            <View style={styles.alertCount}>
              <Text style={styles.alertCountText}>{alerts.length}</Text>
            </View>
          ) : null}
        </Pressable>
      )}
      showAccountNav
    >
      {isLoading ? <LoadingState label="Loading dashboard" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && !dashboard ? <EmptyState message="No account data available yet." /> : null}
      {dashboard ? (
        <>
          <View style={styles.metrics}>
            <MetricCard label="Equity" value={formatMoney(equity)} />
            <MetricCard
              label="Open Positions"
              value={openPositionsCount === undefined ? String(asArray(dashboard.positions).length) : String(openPositionsCount)}
            />
            <MetricCard label="Orders" value={ordersCount === undefined ? '0' : String(ordersCount)} />
          </View>
          <ResponsiveGrid>
            <Bismel1Card>
              <View style={styles.cardHeader}>
                <Activity color={colors.success} size={19} />
                <Text style={styles.cardTitle}>Account Snapshot</Text>
              </View>
              <DataRow label="Broker" value={firstString(brokerSnapshot, ['broker'], 'Unavailable')} />
              <DataRow label="Mode" value={firstString(brokerSnapshot, ['environment'], 'Unavailable')} />
              <DataRow label="Buying Power" value={formatMoney(firstNumber(brokerSnapshot, ['buying_power']))} />
              <DataRow label="Last Sync" value={formatDateTime(brokerSnapshot.last_sync)} />
            </Bismel1Card>
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
                    <View key={String(record.id || index)} style={styles.activityRow}>
                      <View style={styles.activityDot} />
                      <View style={styles.activityCopy}>
                        <Text style={styles.activityTitle}>{firstString(record, ['label', 'message', 'title', 'type'])}</Text>
                        <Text style={styles.muted}>{firstString(record, ['detail', 'description', 'status'], '')}</Text>
                      </View>
                      <Text style={styles.time}>{formatDateTime(record.timestamp || record.created_at)}</Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.muted}>No activity returned.</Text>
              )}
            </Bismel1Card>
          </ResponsiveGrid>
        </>
      ) : null}
      <Modal animationType="fade" transparent visible={alertsOpen} onRequestClose={() => setAlertsOpen(false)}>
        <View style={styles.cabinetBackdrop}>
          <Pressable
            accessibilityLabel="Close alerts"
            accessibilityRole="button"
            onPress={() => setAlertsOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cabinet}>
            <View style={styles.cabinetHeader}>
              <View>
                <Text style={styles.cabinetEyebrow}>Alerts</Text>
              </View>
              <Pressable
                accessibilityLabel="Close alerts"
                accessibilityRole="button"
                onPress={() => setAlertsOpen(false)}
                style={styles.closeButton}
              >
                <X color={colors.text} size={17} />
              </Pressable>
            </View>
            <View style={styles.cabinetRows}>
              {alerts.length ? (
                alerts.map((alert) => (
                  <View key={alert.key} style={styles.alertRow}>
                    <View style={styles.alertCopy}>
                      <Text style={styles.alertLabel}>{alert.label}</Text>
                      <Text style={styles.alertValue}>{alert.value}</Text>
                    </View>
                    <Pressable
                      accessibilityLabel={alert.dismissible ? `Dismiss ${alert.label}` : `${alert.label} status`}
                      accessibilityRole={alert.dismissible ? 'button' : 'text'}
                      disabled={!alert.dismissible || dismissingAlertKeys.includes(alert.key)}
                      onPress={() => dismissAlert(alert)}
                      style={[
                        styles.dismissBadge,
                        (!alert.dismissible || dismissingAlertKeys.includes(alert.key)) && styles.disabledDismissBadge,
                      ]}
                    >
                      <StatusBadge label={statusLabel(alert.status)} status={alert.status} />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={styles.muted}>No alerts to review.</Text>
              )}
              {dismissError ? <Text style={styles.dismissError}>{dismissError}</Text> : null}
            </View>
          </View>
        </View>
      </Modal>
    </AppShell>
  );

  async function dismissAlert(alert: DashboardAlert) {
    if (!alert.dismissible || dismissingAlertKeys.includes(alert.key)) {
      return;
    }

    const dismissPath = alert.dismissEndpoint || endpoints.alertDismiss(alert.key);

    setDismissError(null);
    setDismissingAlertKeys((keys) => [...keys, alert.key]);

    try {
      await api.post<unknown>(dismissPath);
      setDismissedAlertKeys((keys) => [...new Set([...keys, ...alertDismissalKeys(alert)])]);
      setDashboard((currentDashboard) => removeDismissedAlert(currentDashboard, alert.key));
    } catch (dismissAlertError) {
      setDismissError(customerSafeMessage(dismissAlertError));
    } finally {
      setDismissingAlertKeys((keys) => keys.filter((key) => key !== alert.key));
    }
  }
}

const removeDismissedAlert = (dashboard: Record<string, unknown> | null, alertKey: string) => {
  if (!dashboard) {
    return dashboard;
  }

  const alertKeys = alertKeyVariants(alertKey);
  const dismissedKeys = [...new Set([...asArray<unknown>(dashboard.dismissed_alert_keys).map((key) => String(key)), ...alertKeys])];
  const alertItems = asArray(dashboard.alert_items);

  if (!alertItems.length) {
    return {
      ...dashboard,
      dismissed_alert_keys: dismissedKeys,
    };
  }

  return {
    ...dashboard,
    dismissed_alert_keys: dismissedKeys,
    alert_items: alertItems.filter((item) => {
      const record = asRecord(item);
      const key = firstString(record, ['key', 'id', 'code'], '');
      const dismissAction = asRecord(record.dismiss_action);
      const dismissEndpoint = normalizeDismissEndpoint(firstString(dismissAction, ['endpoint'], ''));
      const itemKeys = new Set([...alertKeyVariants(key), ...alertKeyVariants(alertKeyFromDismissEndpoint(dismissEndpoint) || '')]);

      return !alertKeys.some((dismissedKey) => itemKeys.has(dismissedKey));
    }),
  };
};

const normalizeDashboardAlerts = (dashboard: Record<string, unknown> | null): DashboardAlert[] => {
  if (!dashboard) {
    return [];
  }

  const alertItems = asArray(dashboard.alert_items);

  if (alertItems.length) {
    return normalizeAlerts(alertItems);
  }

  const legacyAlerts = dashboard.alerts || dashboard.statuses;

  return normalizeAlerts(legacyAlerts);
};

const normalizeAlerts = (value: unknown): DashboardAlert[] => {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const record = asRecord(item);
      const rawKey = firstString(record, ['key', 'id', 'code'], String(index));
      const label = firstString(record, ['label', 'message', 'title', 'status'], formatAlertLabel(rawKey));
      const status = normalizeAlertStatus(firstString(record, ['tone', 'status'], 'neutral'));
      const dismissAction = asRecord(record.dismiss_action);
      const dismissMethod = firstString(dismissAction, ['method'], '').toUpperCase();
      const dismissEndpoint = normalizeDismissEndpoint(firstString(dismissAction, ['endpoint'], ''));
      const key = alertKeyFromDismissEndpoint(dismissEndpoint) || rawKey;

      return {
        key,
        label,
        value: firstString(record, ['value', 'description', 'message', 'status'], label),
        status,
        dismissible: record.dismissible === true && dismissMethod === 'POST',
        dismissEndpoint,
      };
    });
  }

  return Object.entries(asRecord(value)).map(([key, raw]) => ({
    key: `dashboard:${key}`,
    label: formatAlertLabel(key),
    value: formatAlertValue(raw),
    status: statusFromAlertValue(key, raw),
    dismissible: true,
    dismissEndpoint: endpoints.alertDismiss(`dashboard:${key}`),
  }));
};

const normalizeDismissEndpoint = (endpoint: string) => {
  if (!endpoint) {
    return undefined;
  }

  if (endpoint.startsWith('/api/mobile/v1/')) {
    return endpoint.replace('/api/mobile/v1', '');
  }

  const mobilePrefix = '/api/mobile/v1';
  const mobilePrefixIndex = endpoint.indexOf(mobilePrefix);

  if (mobilePrefixIndex >= 0) {
    return endpoint.slice(mobilePrefixIndex + mobilePrefix.length);
  }

  return endpoint;
};

const alertDismissalKeys = (alert: DashboardAlert) => {
  const endpointKey = alertKeyFromDismissEndpoint(alert.dismissEndpoint);

  return [...new Set([...alertKeyVariants(alert.key), ...alertKeyVariants(endpointKey || '')])];
};

const alertKeyVariants = (key: string) => {
  if (!key) {
    return [];
  }

  const variants = [key];

  if (key.startsWith('dashboard:')) {
    variants.push(key.replace('dashboard:', ''));
  } else if (!key.includes(':')) {
    variants.push(`dashboard:${key}`);
  }

  return [...new Set(variants)];
};

const alertKeyFromDismissEndpoint = (endpoint?: string) => {
  if (!endpoint) {
    return undefined;
  }

  const match = endpoint.match(/\/alerts\/(.+)\/dismiss$/);

  if (!match?.[1]) {
    return undefined;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

const formatAlertLabel = (key: string) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatAlertValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value === null || value === undefined) {
    return 'None';
  }

  return String(value);
};

const normalizeAlertStatus = (status: string): DashboardAlert['status'] => {
  if (status === 'success' || status === 'warning' || status === 'danger' || status === 'neutral') {
    return status;
  }

  if (status === 'ok' || status === 'active' || status === 'connected') {
    return 'success';
  }

  if (status === 'error' || status === 'failed' || status === 'locked') {
    return 'danger';
  }

  return 'neutral';
};

const statusFromAlertValue = (key: string, value: unknown): DashboardAlert['status'] => {
  if (typeof value !== 'boolean') {
    return 'neutral';
  }

  if (key.includes('locked') || key.includes('exposed')) {
    return value ? 'danger' : 'success';
  }

  if (key.includes('connected')) {
    return value ? 'success' : 'warning';
  }

  return value ? 'success' : 'neutral';
};

const statusLabel = (status: DashboardAlert['status']) => {
  if (status === 'success') {
    return 'OK';
  }

  return status.toUpperCase();
};

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
  activityRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
  },
  activityDot: {
    backgroundColor: colors.purple,
    borderRadius: 999,
    height: 9,
    marginTop: 7,
    width: 9,
  },
  activityCopy: {
    flex: 1,
    gap: 3,
  },
  activityTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  alertButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    height: 39,
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOpacity: 0.19,
    shadowRadius: 11,
    width: 39,
  },
  alertCount: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderColor: colors.surface,
    borderRadius: 9,
    borderWidth: 1,
    height: 15,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -5,
    width: 15,
  },
  alertCountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  cabinetBackdrop: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.61)',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 19,
    paddingTop: 73,
  },
  cabinet: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
    borderRadius: 19,
    borderWidth: 1,
    gap: spacing.md,
    maxWidth: 373,
    padding: 19,
    width: '100%',
  },
  cabinetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cabinetEyebrow: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cabinetTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  cabinetRows: {
    gap: 11,
  },
  alertRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
    padding: 11,
  },
  dismissBadge: {
    borderRadius: 999,
  },
  disabledDismissBadge: {
    opacity: 0.57,
  },
  dismissError: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  alertCopy: {
    flex: 1,
    gap: 3,
  },
  alertLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  alertValue: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
