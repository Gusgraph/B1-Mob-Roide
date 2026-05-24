// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: positions.tsx - app/(tabs)/positions.tsx
// =====================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowUp, ChartCandlestick, XCircle } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { ConfirmSheet } from '@/components/ConfirmSheet';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { formatMoney, formatSignedMoney } from '@/utils/money';
import { formatRatioPercent } from '@/utils/percent';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

export default function PositionsScreen() {
  const [positions, setPositions] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);
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
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setShowBackTop(false);
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextVisible = event.nativeEvent.contentOffset.y > 271;

    setShowBackTop((currentVisible) => currentVisible === nextVisible ? currentVisible : nextVisible);
  };
  const backTopControl = !isLoading && !error && positions.length > 3 && showBackTop ? (
    <Pressable accessibilityLabel="Back to top" accessibilityRole="button" onPress={scrollToTop} style={styles.backTopButton}>
      <ArrowUp color={colors.cyan} size={15} />
      <Text style={styles.backTopText}>Top</Text>
    </Pressable>
  ) : null;

  return (
    <AppShell floatingAction={backTopControl} onScroll={handleScroll} scrollRef={scrollRef} title="Positions" showAccountNav>
      {isLoading ? <LoadingState label="Loading positions" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && positions.length === 0 ? <EmptyState message="No open positions returned." /> : null}
      {positions.map((position, index) => {
        const symbol = firstString(position, ['symbol'], 'Position');
        const actions = asRecord(position.actions);
        const actionAllowed = Boolean(
          position.action_allowed_manual_close || position.manual_close_allowed || position.can_manual_close || actions.manual_close,
        );
        const pnl = firstNumber(position, ['unrealized_pl', 'unrealized_pnl']);
        const pnlTone = pnl === undefined ? 'default' : pnl < 0 ? 'danger' : pnl > 0 ? 'success' : 'default';
        const isPositive = pnlTone === 'success';
        const direction = firstString(position, ['side', 'direction'], 'Long');
        const directionTone = direction.toLowerCase().includes('short') ? 'danger' : 'success';

        return (
          <View
            key={String(position.id || symbol || index)}
            style={[styles.positionCard, index % 2 === 0 ? styles.cardCyan : styles.cardGreen]}
          >
            <Text style={[styles.attachedPnl, isPositive ? styles.attachedPnlPositive : pnlTone === 'danger' ? styles.attachedPnlNegative : null]}>
              {formatSignedMoney(pnl)}
            </Text>
            <View style={styles.cardHeader}>
              <View style={[styles.neonLine, index % 2 === 0 ? styles.neonLineCyan : styles.neonLineGreen]} />
              <ChartCandlestick color={index % 2 === 0 ? colors.cyan : colors.success} size={19} />
              <View style={styles.symbolCopy}>
                <Text style={styles.symbol}>
                  {symbol}{' '}
                  <Text style={directionTone === 'success' ? styles.success : styles.danger}>{direction}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.grid}>
              <View style={styles.gridRow}>
                <Text style={styles.gridCell}>{firstString(position, ['qty', 'quantity'])} shares</Text>
                <Text style={[styles.gridCell, styles.gridCellRight]}>Value: {formatMoney(firstNumber(position, ['market_value']))}</Text>
              </View>

              <View style={styles.gridRow}>
                <Text style={styles.gridCell}>Price: {formatMoney(firstNumber(position, ['current_price', 'market_price']))}</Text>
                <Text style={[styles.gridCell, styles.gridCellRight]}>Entry: {formatMoney(firstNumber(position, ['avg_entry', 'average_entry', 'avg_entry_price']))}</Text>
              </View>

              <View style={[styles.gridRow, styles.gridRowSingle, actionAllowed ? null : styles.gridRowLast]}>
                <Text style={styles.gridCell}>
                  <Text>Unrealized P/L: </Text>
                  <Text style={pnlTone === 'success' ? styles.success : pnlTone === 'danger' ? styles.danger : styles.gridText}>
                    {formatSignedMoney(pnl)} ({formatRatioPercent(firstNumber(position, ['unrealized_pl_percent', 'unrealized_pnl_percent']))})
                  </Text>
                </Text>
              </View>
            </View>

            {actionAllowed ? (
              <Pressable style={styles.closeButton} onPress={() => setSelected(position)}>
                <XCircle color={colors.white} size={15} />
                <Text style={styles.closeText}>Close Position</Text>
              </Pressable>
            ) : null}
          </View>
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
  positionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.cyan,
    borderRadius: 9,
    borderWidth: 2,
    gap: 11,
    overflow: 'hidden',
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 21,
    position: 'relative',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.17,
    shadowRadius: 19,
  },
  cardCyan: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
  },
  cardGreen: {
    borderColor: colors.success,
    shadowColor: colors.success,
  },
  attachedPnl: {
    backgroundColor: colors.accentMuted,
    borderBottomLeftRadius: 7,
    borderColor: colors.border,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  attachedPnlPositive: {
    color: colors.success,
  },
  attachedPnlNegative: {
    color: colors.danger,
  },
  symbol: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  neonLine: {
    borderRadius: 999,
    height: 3,
    width: 43,
  },
  neonLineCyan: {
    backgroundColor: colors.cyan,
  },
  neonLineGreen: {
    backgroundColor: colors.success,
  },
  symbolCopy: {
    flex: 1,
  },
  grid: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  gridRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 11,
    paddingVertical: 9,
  },
  gridRowLast: {
    borderBottomWidth: 0,
  },
  gridRowSingle: {
    justifyContent: 'flex-start',
  },
  gridCell: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  gridCellRight: {
    textAlign: 'right',
  },
  gridText: {
    color: colors.text,
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.dangerMuted,
    alignSelf: 'flex-end',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  closeText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '900',
  },
  backTopButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.31,
    shadowRadius: 15,
  },
  backTopText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
