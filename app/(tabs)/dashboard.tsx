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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Activity, Bell, Boxes, X } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { ManagedAccount } from '@/accounts/AccountProvider';
import { useAccounts } from '@/accounts/useAccounts';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatMoney, formatSignedMoney } from '@/utils/money';
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

type TradeActivityItem = {
  accountLabel: string;
  accountRef: string;
  brokerAccountRef: string;
  detail: string;
  product: string;
  side: string;
  slotNumber: string;
  symbol: string;
  timestamp: string;
  value: string;
};

export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [snapshot, setSnapshot] = useState<Record<string, unknown> | null>(null);
  const [positions, setPositions] = useState<Record<string, unknown>[]>([]);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [trades, setTrades] = useState<TradeActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [dismissedAlertKeys, setDismissedAlertKeys] = useState<string[]>([]);
  const [dismissingAlertKeys, setDismissingAlertKeys] = useState<string[]>([]);
  const [dismissError, setDismissError] = useState<string | null>(null);
  const { accounts, accountsError, isLoadingAccounts, refreshAccounts, selectAccount, selectedAccount } = useAccounts();
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, width, height);
  const connectedAccounts = useMemo(() => accounts.filter(isConnectedAccount), [accounts]);
  const activeAccount = useMemo(
    () => connectedAccounts.find((account) => account.id === selectedAccount?.id) || connectedAccounts[0] || null,
    [connectedAccounts, selectedAccount],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [, dashboardResponse, positionsResponse, ordersResponse, tradesResponse] = await Promise.all([
        refreshAccounts(),
        api.get<unknown>(endpoints.dashboard),
        api.get<unknown>(endpoints.positions),
        api.get<unknown>(endpoints.orders),
        api.get<unknown>(endpoints.tradeActivity),
      ]);
      const nextDashboard = asRecord(dashboardResponse);

      setDashboard(nextDashboard);
      setDismissedAlertKeys(asArray<unknown>(nextDashboard.dismissed_alert_keys).map((key) => String(key)));
      setPositions(parseRows(positionsResponse, ['positions', 'items']));
      setOrders(parseRows(ordersResponse, ['orders', 'items']));
      setTrades(parseTradeActivity(tradesResponse));
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [refreshAccounts]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let mounted = true;

    const loadSnapshot = async () => {
      if (!activeAccount) {
        setSnapshot(null);
        setSnapshotError(null);
        return;
      }

      setIsSnapshotLoading(true);
      setSnapshotError(null);
      try {
        const accountKey = activeAccount.pathValue || activeAccount.id;
        const nextSnapshot = asRecord(await api.get<unknown>(endpoints.accountSnapshot(accountKey)));

        if (mounted) {
          setSnapshot(nextSnapshot);
        }
      } catch (loadSnapshotError) {
        if (mounted) {
          setSnapshot(asRecord(activeAccount.raw));
          setSnapshotError(customerSafeMessage(loadSnapshotError));
        }
      } finally {
        if (mounted) {
          setIsSnapshotLoading(false);
        }
      }
    };

    loadSnapshot();

    return () => {
      mounted = false;
    };
  }, [activeAccount]);

  const dashboardSnapshot = asRecord(dashboard?.account_snapshot || dashboard?.snapshot || dashboard?.account);
  const effectiveSnapshot = asRecord(snapshot || dashboardSnapshot || activeAccount?.raw);
  const brokerSnapshot = asRecord(effectiveSnapshot.broker);
  const products = asArray(dashboard?.active_products || dashboard?.products);
  const persistedDismissedAlertKeys = asArray<unknown>(dashboard?.dismissed_alert_keys).map((key) => String(key));
  const alerts = normalizeDashboardAlerts(dashboard)
    .filter((alert) => {
      const alertKeys = alertDismissalKeys(alert);

      return !alertKeys.some((key) => dismissedAlertKeys.includes(key) || persistedDismissedAlertKeys.includes(key));
    });
  const scopedPositions = useMemo(() => filterRowsByAccount(positions, activeAccount), [activeAccount, positions]);
  const scopedOrders = useMemo(() => filterRowsByAccount(orders, activeAccount), [activeAccount, orders]);
  const scopedTrades = useMemo(() => filterTradesByAccount(trades, activeAccount), [activeAccount, trades]);
  const hasScopedTradeFeed = useMemo(
    () => trades.some((trade) => trade.accountRef || trade.brokerAccountRef || trade.slotNumber),
    [trades],
  );
  const showTradeScopeNotice = Boolean(activeAccount && trades.length && !hasScopedTradeFeed && activeAccount.pathValue !== '1');
  const openPositionsCount = scopedPositions.length || firstNumber(effectiveSnapshot, ['open_positions_count', 'positions_count']) || firstNumber(asRecord(dashboard), ['open_positions_count', 'positions_count']);
  const ordersCount = scopedOrders.length || firstNumber(effectiveSnapshot, ['orders_count', 'open_orders_count']) || firstNumber(asRecord(dashboard), ['orders_count', 'open_orders_count']);
  const equity = firstNumber(effectiveSnapshot, ['equity', 'portfolio_value', 'balance']) ??
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
      {isLoading || isLoadingAccounts ? <LoadingState label="Loading dashboard" /> : null}
      {error || accountsError ? <ErrorState message={error || accountsError || 'Connection failed.'} /> : null}
      {!isLoading && !isLoadingAccounts && !error && !accountsError && connectedAccounts.length === 0 ? <EmptyState message="No connected trading accounts returned." /> : null}
      {dashboard ? (
        <>
          <Bismel1Card style={styles.selectorCard}>
            <View style={styles.accountHeader}>
              <View>
                <Text style={styles.eyebrow}>Trading Account</Text>
                <Text style={styles.accountTitle}>{activeAccount?.label || 'Select account'}</Text>
              </View>
              {isSnapshotLoading ? <Text style={styles.loadingText}>Syncing</Text> : null}
            </View>
            <View style={styles.accountChips}>
              {connectedAccounts.map((account) => (
                <Pressable
                  key={account.id}
                  onPress={() => selectAccount(account.id)}
                  style={[styles.accountChip, activeAccount?.id === account.id && styles.accountChipActive]}
                >
                  <Text style={[styles.accountChipText, activeAccount?.id === account.id && styles.accountChipTextActive]}>{account.label}</Text>
                  <Text style={styles.accountMeta}>{account.pathValue ? `Account ${account.pathValue}` : account.broker}</Text>
                </Pressable>
              ))}
            </View>
            {snapshotError ? <Text style={styles.scopeNote}>Using broker account fallback while snapshot sync is unavailable.</Text> : null}
          </Bismel1Card>

          <Bismel1Card style={styles.compactMetricsCard}>
            <View style={styles.cardHeader}>
              <Activity color={colors.success} size={19} />
              <Text style={styles.cardTitle}>Account Overview</Text>
            </View>
            <View style={styles.metricStrip}>
              <View style={styles.compactMetric}>
                <Text style={styles.metricLabel}>Equity</Text>
                <Text style={styles.metricValue}>{formatMoney(equity)}</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.compactMetric}>
                <Text style={styles.metricLabel}>Open Positions</Text>
                <Text style={styles.metricValue}>{openPositionsCount === undefined ? '0' : String(openPositionsCount)}</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.compactMetric}>
                <Text style={styles.metricLabel}>Orders</Text>
                <Text style={styles.metricValue}>{ordersCount === undefined ? '0' : String(ordersCount)}</Text>
              </View>
            </View>
          </Bismel1Card>

          <ResponsiveGrid>
            <Bismel1Card style={styles.dataCard}>
              <View style={styles.cardHeader}>
                <Activity color={colors.success} size={19} />
                <Text style={styles.cardTitle}>Account Snapshot</Text>
              </View>
              <View style={styles.dataRows}>
                <SnapshotRow label="Broker" value={firstString(effectiveSnapshot, ['broker'], firstString(brokerSnapshot, ['broker'], activeAccount?.broker || 'Unavailable'))} styles={styles} />
                <SnapshotRow label="Mode" value={firstString(effectiveSnapshot, ['environment', 'mode'], firstString(brokerSnapshot, ['environment', 'mode'], 'Unavailable'))} styles={styles} />
                <SnapshotRow label="Buying Power" value={formatMoney(firstNumber(effectiveSnapshot, ['buying_power']) ?? firstNumber(brokerSnapshot, ['buying_power']))} styles={styles} />
                <SnapshotRow label="Last Sync" value={formatDateTime(effectiveSnapshot.last_sync || brokerSnapshot.last_sync)} styles={styles} last />
              </View>
            </Bismel1Card>
            <Bismel1Card style={styles.dataCardAlt}>
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
            <Bismel1Card style={styles.dataCard}>
              <View style={styles.cardHeader}>
                <Activity color={colors.purple} size={19} />
                <Text style={styles.cardTitle}>Latest Trading Activity</Text>
              </View>
              {showTradeScopeNotice ? <Text style={styles.scopeNote}>Trade activity feed is not account-scoped for this connected account yet.</Text> : null}
              {scopedTrades.length ? (
                scopedTrades.slice(0, 5).map((trade, index) => (
                  <View key={`${trade.timestamp}-${trade.symbol}-${index}`} style={styles.activityRow}>
                    <View style={styles.activityDot} />
                    <View style={styles.activityCopy}>
                      <Text style={styles.activityTitle}>{trade.symbol} {trade.side}</Text>
                      <Text style={styles.muted}>{trade.detail || trade.product}</Text>
                    </View>
                    <View style={styles.activityRight}>
                      <Text style={styles.time}>{formatDateTime(trade.timestamp)}</Text>
                      {trade.value ? <Text style={styles.activityValue}>{trade.value}</Text> : null}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.muted}>No trading activity returned.</Text>
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

function SnapshotRow({
  label,
  last = false,
  styles,
  value,
}: {
  label: string;
  last?: boolean;
  styles: ReturnType<typeof makeStyles>;
  value: string;
}) {
  return (
    <View style={[styles.snapshotRow, last && styles.snapshotRowLast]}>
      <Text style={styles.snapshotLabel}>{label}</Text>
      <Text style={styles.snapshotValue}>{value}</Text>
    </View>
  );
}

const parseRows = (response: unknown, keys: string[]) => {
  const record = asRecord(response);
  const value = keys.reduce<unknown>((current, key) => current || record[key], undefined);

  return asArray(value || response).map(asRecord);
};

const isConnectedAccount = (account: ManagedAccount) => {
  const raw = account.raw;
  const status = account.status.toLowerCase();

  return raw.connected !== false && !status.includes('disconnect') && !status.includes('removed');
};

const filterRowsByAccount = (rows: Record<string, unknown>[], account: ManagedAccount | null) => {
  if (!account) {
    return rows;
  }

  const hasScopedIdentity = rows.some((row) => rowHasAccountIdentity(row));

  if (!hasScopedIdentity) {
    return account.pathValue === '1' ? rows : [];
  }

  return rows.filter((row) => rowMatchesAccount(row, account));
};

const filterTradesByAccount = (trades: TradeActivityItem[], account: ManagedAccount | null) => {
  if (!account) {
    return trades;
  }

  const hasScopedIdentity = trades.some((trade) => trade.accountRef || trade.brokerAccountRef || trade.slotNumber);

  if (!hasScopedIdentity) {
    return account.pathValue === '1' ? trades : [];
  }

  return trades.filter((trade) => tradeMatchesAccount(trade, account));
};

const rowHasAccountIdentity = (row: Record<string, unknown>) =>
  Boolean(firstString(row, ['account_ref', 'account_id', 'account', 'broker_account_ref', 'broker_account_id', 'slot_number', 'account_slot', 'slot'], ''));

const rowMatchesAccount = (row: Record<string, unknown>, account: ManagedAccount) => {
  const possibleIds = accountIdentityValues(account);
  const rowValues = [
    firstString(row, ['account_ref', 'account_id', 'account'], ''),
    firstString(row, ['broker_account_ref', 'broker_account_id'], ''),
    firstString(row, ['slot_number', 'account_slot', 'slot'], ''),
    firstString(row, ['account_label', 'account_name'], ''),
  ];

  return rowValues.some((value) => value && possibleIds.includes(value));
};

const tradeMatchesAccount = (trade: TradeActivityItem, account: ManagedAccount) => {
  const possibleIds = accountIdentityValues(account);

  return [trade.accountRef, trade.brokerAccountRef, trade.slotNumber, trade.accountLabel].some((value) => value && possibleIds.includes(value));
};

const accountIdentityValues = (account: ManagedAccount) => {
  const raw = account.raw;

  return [
    account.id,
    account.label,
    account.pathValue,
    firstString(raw, ['broker_account_ref', 'broker_account_id'], ''),
    firstString(raw, ['account_ref', 'account_id'], ''),
    firstString(raw, ['slot_number', 'account_slot', 'slot'], ''),
  ].filter(Boolean);
};

const parseTradeActivity = (response: unknown): TradeActivityItem[] => {
  const rows = parseRows(response, ['activity', 'trades', 'items']);

  return rows
    .map((row) => {
      const timestamp = firstString(row, ['timestamp', 'created_at', 'filled_at', 'time'], '');
      const realizedPl = firstNumber(row, ['realized_pl', 'realized_pnl', 'pnl', 'profit_loss']);

      return {
        accountLabel: firstString(row, ['account_label', 'account_name'], ''),
        accountRef: firstString(row, ['account_ref', 'account_id', 'account'], ''),
        brokerAccountRef: firstString(row, ['broker_account_ref', 'broker_account_id'], ''),
        detail: cleanTradeDetail(firstString(row, ['detail', 'message', 'description', 'status'], '')),
        product: firstString(row, ['activity_product', 'product_label', 'product_name', 'product'], ''),
        side: normalizeTradeSide(row),
        slotNumber: firstString(row, ['slot_number', 'account_slot', 'slot'], ''),
        symbol: firstString(row, ['symbol', 'ticker', 'asset_symbol'], 'Symbol'),
        timestamp,
        value: typeof realizedPl === 'number' ? formatSignedMoney(realizedPl) : '',
      };
    })
    .filter((trade) => trade.timestamp)
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp));
};

const normalizeTradeSide = (item: Record<string, unknown>) => {
  const source = firstString(item, ['side', 'action', 'direction', 'label', 'title', 'event', 'type'], 'Trade');
  const value = source.toLowerCase();

  if (value.includes('buy')) {
    return 'Buy';
  }

  if (value.includes('sell')) {
    return 'Sell';
  }

  if (value.includes('open')) {
    return 'Open';
  }

  return source.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const cleanTradeDetail = (value: string) =>
  value
    .replace(/trade activity recorded for\s+[A-Z0-9.-]+\.?/gi, '')
    .replace(/trade activity recorded for\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

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

const makeStyles = (colors: ThemeColors, width: number, height: number) => {
  const isWide = width > height || width >= 761;
  const isTvWide = width >= 1181;

  return StyleSheet.create({
  selectorCard: {
    gap: 11,
    paddingBottom: 13,
  },
  accountHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  accountTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  loadingText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    paddingTop: 3,
    textTransform: 'uppercase',
  },
  accountChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  accountChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    minWidth: isWide ? 137 : 101,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  accountChipActive: {
    borderColor: colors.warning,
    borderWidth: 2,
    shadowColor: colors.warning,
    shadowOpacity: 0.23,
    shadowRadius: 11,
  },
  accountChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  accountChipTextActive: {
    color: colors.warning,
  },
  accountMeta: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 3,
  },
  compactMetricsCard: {
    borderColor: colors.borderStrong,
    gap: 13,
    shadowColor: colors.cyan,
    shadowOpacity: 0.17,
  },
  metricStrip: {
    flexDirection: 'row',
    gap: 0,
  },
  compactMetric: {
    flex: 1,
    gap: 5,
    minHeight: 57,
    justifyContent: 'center',
  },
  metricDivider: {
    backgroundColor: colors.borderStrong,
    height: '100%',
    marginHorizontal: isWide ? 13 : 9,
    minHeight: 57,
    opacity: 0.57,
    width: 1,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: isTvWide ? 27 : isWide ? 23 : 19,
    fontWeight: '900',
  },
  dataCard: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
  },
  dataCardAlt: {
    borderColor: colors.success,
    shadowColor: colors.success,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dataRows: {
    borderTopColor: colors.borderStrong,
    borderTopWidth: 1,
  },
  snapshotRow: {
    alignItems: 'center',
    borderBottomColor: colors.borderStrong,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  snapshotRowLast: {
    borderBottomWidth: 0,
  },
  snapshotLabel: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  snapshotValue: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
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
  scopeNote: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 17,
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
  activityRight: {
    alignItems: 'flex-end',
    gap: 3,
    maxWidth: 111,
  },
  activityTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  activityValue: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '900',
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
};
