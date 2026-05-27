// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: brokers.tsx - app/more/brokers.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Building2, Link as LinkIcon, Unlink } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { useAccounts } from '@/accounts/useAccounts';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ConfirmSheet } from '@/components/ConfirmSheet';
import { DataRow } from '@/components/DataRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/dates';
import { formatMoney } from '@/utils/money';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

const accountKey = (account: Record<string, unknown>) =>
  firstString(account, ['broker_account_ref', 'account_ref', 'uuid', 'id', 'broker_account_id'], 'broker-account');

const nextAvailableSlot = (accounts: Record<string, unknown>[]) => {
  const usedSlots = new Set(accounts.map((account) => firstNumber(account, ['slot_number'])).filter(Boolean));

  for (let slot = 1; slot <= 19; slot += 1) {
    if (!usedSlots.has(slot)) {
      return slot;
    }
  }

  return 19;
};

export default function BrokerAccountsScreen() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [accounts, setAccounts] = useState<Record<string, unknown>[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [environment, setEnvironment] = useState<'paper' | 'live'>('paper');
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshAccounts } = useAccounts();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const load = async () => {
    setError(null);
    try {
      const brokerResponse = asRecord(await api.get<unknown>(endpoints.brokerAccounts));
      const nextAccounts = asArray(brokerResponse.accounts || brokerResponse.broker_accounts || brokerResponse).map(asRecord);
      setResponse(brokerResponse);
      setAccounts(nextAccounts);
      setSelectedBrokerId((current) => {
        if (current && nextAccounts.some((account) => accountKey(account) === current)) {
          return current;
        }

        return nextAccounts[0] ? accountKey(nextAccounts[0]) : null;
      });
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const connectAction = asRecord(asRecord(response?.actions).connect_alpaca);
  const connectBlocked = response?.can_connect_alpaca === false || connectAction.enabled === false;
  const connectAllowed = Boolean(response) && !connectBlocked;
  const nextSlotNumber = firstNumber(connectAction, ['next_slot_number', 'next_account_slot', 'slot_number'])
    || nextAvailableSlot(accounts);
  const canSubmitConnect = connectAllowed && apiKey.trim() && apiSecret.trim() && !isSubmitting;

  const connect = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(endpoints.connectAlpaca, {
        account_slot: nextSlotNumber,
        environment,
        access_key_id: apiKey.trim(),
        access_secret: apiSecret,
      });
      setApiKey('');
      setApiSecret('');
      await load();
      await refreshAccounts();
    } catch (connectError) {
      setError(customerSafeMessage(connectError));
      setApiSecret('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disconnect = async () => {
    const id = disconnectTarget?.id || disconnectTarget?.broker_account_id || disconnectTarget?.broker_account_ref;
    if (!id) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(endpoints.disconnectBroker(String(id)), { confirm: true });
      setDisconnectTarget(null);
      await load();
      await refreshAccounts();
    } catch (disconnectError) {
      setError(customerSafeMessage(disconnectError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const disconnectBlocked = (account: Record<string, unknown> | null) => {
    const disconnectAction = asRecord(asRecord(account?.actions).disconnect);
    const blockers = asRecord(account?.disconnect_blockers);
    const openPositions = firstNumber(blockers, ['open_positions_count']);
    const pendingOrders = firstNumber(blockers, ['pending_orders_count']);

    return (
      account?.can_disconnect === false ||
      disconnectAction.enabled === false ||
      Boolean((openPositions && openPositions > 0) || (pendingOrders && pendingOrders > 0))
    );
  };

  const disconnectWarning = (account: Record<string, unknown> | null) => {
    if (disconnectBlocked(account)) {
      return 'Open positions and pending orders may remain active. Review Positions and Orders before disconnecting this trading account.';
    }

    return firstString(
      asRecord(account),
      ['disconnect_warning', 'warning', 'confirmation_message'],
      'Disconnect this trading account from Bismel1. Automation using this account may stop.',
    );
  };

  return (
    <AppShell title="Broker Accounts">
      {isLoading ? <LoadingState label="Loading broker accounts" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && accounts.length === 0 ? <EmptyState message="No broker accounts returned." /> : null}
      {accounts.length ? (
        <Bismel1Card>
          <Text style={styles.title}>Broker List</Text>
          <View style={styles.selectorGrid}>
            {accounts.map((account) => {
              const key = accountKey(account);
              const active = selectedBrokerId === key;
              return (
                <Pressable key={key} onPress={() => setSelectedBrokerId(key)} style={[styles.selectorItem, active && styles.activeSelectorItem]}>
                  <Text numberOfLines={1} style={[styles.selectorTitle, active && styles.activeSelectorTitle]}>
                    {firstString(account, ['account_label', 'name', 'broker', 'provider'], 'Broker Account')}
                  </Text>
                  <Text numberOfLines={1} style={styles.selectorMeta}>{firstString(account, ['broker', 'environment'], 'Broker')}</Text>
                </Pressable>
              );
            })}
          </View>
        </Bismel1Card>
      ) : null}
      <ResponsiveGrid>
        {accounts.map((account, index) => {
          if (selectedBrokerId && accountKey(account) !== selectedBrokerId) {
            return null;
          }

          const disconnectAction = asRecord(asRecord(account.actions).disconnect);
          const hasDisconnectAction = Boolean(account.actions || account.can_disconnect !== undefined || account.broker_account_ref || account.id || account.broker_account_id);
          const canDisconnect = !disconnectBlocked(account) && (account.can_disconnect === true || disconnectAction.enabled === true || hasDisconnectAction);
          return (
            <Bismel1Card key={String(account.id || account.broker_account_id || account.broker_account_ref || index)}>
              <Building2 color={colors.accent} size={19} />
              <Text style={styles.title}>{firstString(account, ['account_label', 'name', 'broker', 'provider'], 'Broker Account')}</Text>
              <StatusBadge label={account.connected === true ? 'Connected' : firstString(account, ['status', 'connection_status'], 'Status unavailable')} status={account.connected === true ? 'success' : 'warning'} />
              <DataRow label="Broker" value={firstString(account, ['broker'], 'Unavailable')} />
              <DataRow label="Mode" value={firstString(account, ['environment'], 'Unavailable')} />
              <DataRow label="Equity" value={formatMoney(firstNumber(account, ['equity']))} />
              <DataRow label="Buying Power" value={formatMoney(firstNumber(account, ['buying_power']))} />
              <DataRow label="Last Sync" value={formatDateTime(account.last_sync)} />
              <DataRow label="Automation" value={account.automation_enabled === true ? 'Enabled' : 'Off'} tone={account.automation_enabled === true ? 'success' : 'warning'} />
              {hasDisconnectAction ? (
                <Pressable
                  hitSlop={11}
                  onPress={() => setDisconnectTarget(account)}
                  onPressIn={() => setDisconnectTarget(account)}
                  style={[styles.dangerButton, !canDisconnect && styles.warningButton]}
                >
                  <Unlink color={colors.white} size={15} />
                  <Text style={styles.buttonText}>Disconnect</Text>
                </Pressable>
              ) : null}
            </Bismel1Card>
          );
        })}
      </ResponsiveGrid>
      {connectAllowed ? (
        <ResponsiveGrid>
          <Bismel1Card>
            <LinkIcon color={colors.success} size={19} />
            <Text style={styles.title}>Connect Alpaca</Text>
            <DataRow label="Next Account" value={`Account ${String(nextSlotNumber)}`} />
            <View style={styles.field}>
              <Text style={styles.label}>Environment</Text>
              <View style={styles.segmentRow}>
                {(['paper', 'live'] as const).map((value) => {
                  const active = environment === value;

                  return (
                    <Pressable
                      key={value}
                      onPress={() => setEnvironment(value)}
                      style={[styles.segmentButton, active && styles.segmentButtonActive]}
                    >
                      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                        {value === 'paper' ? 'Paper' : 'Live'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>API Key</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setApiKey}
                placeholder="API key"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={apiKey}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>API Secret</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setApiSecret}
                placeholder="API secret"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={styles.input}
                value={apiSecret}
              />
            </View>
            <Pressable disabled={!canSubmitConnect} onPress={connect} style={[styles.button, !canSubmitConnect && styles.disabled]}>
              <LinkIcon color={colors.white} size={15} />
              <Text style={styles.buttonText}>{isSubmitting ? 'Submitting' : 'Connect'}</Text>
            </Pressable>
          </Bismel1Card>
        </ResponsiveGrid>
      ) : null}
      <ConfirmSheet
        confirmLabel={disconnectBlocked(disconnectTarget) ? 'OK' : 'Disconnect'}
        isLoading={isSubmitting}
        message={disconnectWarning(disconnectTarget)}
        onCancel={() => setDisconnectTarget(null)}
        onConfirm={disconnectBlocked(disconnectTarget) ? () => setDisconnectTarget(null) : disconnect}
        title="Disconnect Trading Account"
        visible={Boolean(disconnectTarget)}
      />
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    padding: spacing.md,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 9,
  },
  segmentButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 43,
    paddingHorizontal: 13,
  },
  segmentButtonActive: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOpacity: 0.27,
    shadowRadius: 11,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: colors.cyan,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  selectorItem: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 137,
    padding: 11,
  },
  activeSelectorItem: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOpacity: 0.27,
    shadowRadius: 11,
  },
  selectorTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '900',
  },
  activeSelectorTitle: {
    color: colors.cyan,
  },
  selectorMeta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.md,
  },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
