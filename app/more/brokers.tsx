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
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ConfirmSheet } from '@/components/ConfirmSheet';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function BrokerAccountsScreen() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [accounts, setAccounts] = useState<Record<string, unknown>[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [disconnectTarget, setDisconnectTarget] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const load = async () => {
    setError(null);
    try {
      const brokerResponse = asRecord(await api.get<unknown>(endpoints.brokerAccounts));
      setResponse(brokerResponse);
      setAccounts(asArray(brokerResponse.accounts || brokerResponse.broker_accounts || brokerResponse).map(asRecord));
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const connectAllowed = Boolean(response?.can_connect_alpaca || asRecord(response?.actions).connect_alpaca);
  const canSubmitConnect = connectAllowed && apiKey.trim() && apiSecret.trim() && !isSubmitting;

  const connect = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(endpoints.connectAlpaca, {
        api_key: apiKey.trim(),
        api_secret: apiSecret,
      });
      setApiKey('');
      setApiSecret('');
      await load();
    } catch (connectError) {
      setError(customerSafeMessage(connectError));
      setApiSecret('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disconnect = async () => {
    const id = disconnectTarget?.id || disconnectTarget?.broker_account_id;
    if (!id) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(endpoints.disconnectBroker(String(id)), { confirm: true });
      setDisconnectTarget(null);
      await load();
    } catch (disconnectError) {
      setError(customerSafeMessage(disconnectError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Broker Accounts">
      {isLoading ? <LoadingState label="Loading broker accounts" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && accounts.length === 0 ? <EmptyState message="No broker accounts returned." /> : null}
      {accounts.map((account, index) => {
        const canDisconnect = Boolean(account.can_disconnect || asRecord(account.actions).disconnect);
        return (
          <Bismel1Card key={String(account.id || account.broker_account_id || index)}>
            <Building2 color={colors.accent} size={19} />
            <Text style={styles.title}>{firstString(account, ['name', 'broker', 'provider'], 'Broker Account')}</Text>
            <StatusBadge label={firstString(account, ['status', 'connection_status'], 'Status unavailable')} />
            {canDisconnect ? (
              <Pressable style={styles.dangerButton} onPress={() => setDisconnectTarget(account)}>
                <Unlink color={colors.white} size={15} />
                <Text style={styles.buttonText}>Disconnect</Text>
              </Pressable>
            ) : null}
          </Bismel1Card>
        );
      })}
      {connectAllowed ? (
        <Bismel1Card>
          <LinkIcon color={colors.success} size={19} />
          <Text style={styles.title}>Connect Alpaca</Text>
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
      ) : null}
      <ConfirmSheet
        confirmLabel="Disconnect"
        isLoading={isSubmitting}
        message={firstString(
          asRecord(disconnectTarget),
          ['disconnect_warning', 'warning', 'confirmation_message'],
          'Disconnect this broker account through Bismel1. Automation using this account may stop.',
        )}
        onCancel={() => setDisconnectTarget(null)}
        onConfirm={disconnect}
        title="Disconnect Broker"
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
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
