import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ChartCandlestick, XCircle } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ConfirmSheet } from '@/components/ConfirmSheet';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatMoney } from '@/utils/money';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

export default function PositionsScreen() {
  const [positions, setPositions] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const load = async () => {
    setError(null);
    try {
      const response = await api.get<unknown>(endpoints.positions);
      setPositions(asArray(asRecord(response).positions || response).map(asRecord));
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const warning = useMemo(
    () =>
      firstString(
        asRecord(selected),
        ['manual_close_warning', 'warning', 'confirmation_message'],
        'Confirm manual close through Bismel1. This action is submitted to Laravel and cannot be undone from the app.',
      ),
    [selected],
  );

  const closeSelected = async () => {
    const symbol = firstString(asRecord(selected), ['symbol'], '');
    if (!symbol) {
      return;
    }

    setIsClosing(true);
    try {
      await api.post(endpoints.manualClosePosition(symbol), { confirm: true });
      setSelected(null);
      await load();
    } catch (closeError) {
      setError(customerSafeMessage(closeError));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <AppShell title="Positions" subtitle="Open positions returned by the mobile API.">
      {isLoading ? <LoadingState label="Loading positions" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && positions.length === 0 ? <EmptyState message="No open positions returned." /> : null}
      {positions.map((position, index) => {
        const symbol = firstString(position, ['symbol'], 'Position');
        const actions = asRecord(position.actions);
        const actionAllowed = Boolean(
          position.manual_close_allowed || position.can_manual_close || actions.manual_close,
        );

        return (
          <Bismel1Card key={String(position.id || symbol || index)}>
            <ChartCandlestick color={colors.accent} size={19} />
            <Text style={styles.symbol}>{symbol}</Text>
            <Text style={styles.text}>Qty: {firstString(position, ['qty', 'quantity'])}</Text>
            <Text style={styles.text}>Average Entry: {formatMoney(firstNumber(position, ['average_entry', 'avg_entry_price']))}</Text>
            <Text style={styles.text}>Current Price: {formatMoney(firstNumber(position, ['current_price', 'market_price']))}</Text>
            <Text style={styles.text}>Market Value: {formatMoney(firstNumber(position, ['market_value']))}</Text>
            <Text style={styles.text}>Unrealized P/L: {formatMoney(firstNumber(position, ['unrealized_pl', 'unrealized_pnl']))}</Text>
            {actionAllowed ? (
              <Pressable style={styles.closeButton} onPress={() => setSelected(position)}>
                <XCircle color={colors.white} size={15} />
                <Text style={styles.closeText}>Manual Close</Text>
              </Pressable>
            ) : null}
          </Bismel1Card>
        );
      })}
      <ConfirmSheet
        confirmLabel="Close Position"
        isLoading={isClosing}
        message={warning}
        onCancel={() => setSelected(null)}
        onConfirm={closeSelected}
        title="Confirm Manual Close"
        visible={Boolean(selected)}
      />
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  symbol: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  closeText: {
    color: colors.white,
    fontWeight: '700',
  },
});
