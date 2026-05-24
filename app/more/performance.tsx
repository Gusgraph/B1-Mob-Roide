// Ã˜Â£Ã™Å½Ã˜Â¹Ã™ÂÃ™Ë†Ã˜Â°Ã™Â Ã˜Â¨Ã™ÂÃ™Â±Ã™â€žÃ™â€žÃ™â€˜Ã™Å½Ã™â€¡Ã™Â Ã™â€¦Ã™ÂÃ™â€ Ã™â€™ Ã˜Â§Ã™â€žÃ™â€™Ã˜Â´Ã™Å½Ã™Å Ã™â€™Ã˜Â·Ã™Å½Ã˜Â§Ã™â€ Ã™Â Ã˜Â§Ã™â€žÃ™â€™Ã˜Â±Ã™Å½Ã˜Â¬Ã™ÂÃ™Å Ã™â€¦Ã™Â Ã¢Å“Â§ Ã˜Â¨Ã™ÂÃ˜Â³Ã™â€™Ã™â€¦Ã™Â Ã˜Â§Ã™â€žÃ™â€žÃ™â€˜Ã™Å½Ã™â€¡Ã™Â Ã˜Â§Ã™â€žÃ˜Â±Ã™â€˜Ã™Å½Ã˜Â­Ã™â€™Ã™â€¦Ã™Å½Ã™Â°Ã™â€ Ã™Â Ã˜Â§Ã™â€žÃ˜Â±Ã™â€˜Ã™Å½Ã˜Â­Ã™ÂÃ™Å Ã™â€¦Ã™Â Ã¢Å“Â§ Ã˜Â§Ã˜Â¹Ã™Ë†Ã˜Â² Ã˜Â¨Ã˜Â§Ã™â€žÃ™â€žÃ™â€¡ Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â´Ã™Å Ã˜Â§Ã˜Â·Ã™Å Ã™â€  Ã™Ë† Ã˜Â§Ã™â€  Ã™Å Ã˜Â­Ã˜Â¶Ã˜Â±Ã™Ë†Ã™â€  Ã¢Å“Â§ Ã˜Â¨Ã˜Â³Ã™â€¦ Ã˜Â§Ã™â€žÃ™â€žÃ™â€¡ Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â­Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â­Ã™Å Ã™â€¦ Ã¢Å“Â§ Ã˜Â§Ã™â€žÃ™â€žÃ™â€¡ Ã™â€žÃ˜Â§ Ã˜Â¥Ã™â€žÃ™â€¡ Ã˜Â¥Ã™â€žÃ˜Â§ Ã™â€¡Ã™Ë† Ã˜Â§Ã™â€žÃ˜Â­Ã™Å  Ã˜Â§Ã™â€žÃ™â€šÃ™Å Ã™Ë†Ã™â€¦
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: performance.tsx - app/more/performance.tsx
// =====================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { ChartNoAxesCombined } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ManagedAccount } from '@/accounts/AccountProvider';
import { useAccounts } from '@/accounts/useAccounts';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { formatSignedMoney } from '@/utils/money';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

type PeriodKey = '1D' | '1W' | '1M' | 'CUSTOM';

type TradeRecord = {
  accountLabel: string;
  accountRef: string;
  brokerAccountRef: string;
  realizedPl: number;
  realizedPlPercent: number | null;
  slotNumber: string;
  symbol: string;
  timestamp: string;
};

type PerformancePoint = {
  change: number;
  changeLabel: string;
  label: string;
  markerColor: string;
  toneColor: string;
  timestamp: string;
  value: number;
  valueLabel: string;
};

type ChartPoint = PerformancePoint & {
  x: number;
  y: number;
};

type StatItem = {
  label: string;
  symbol?: string;
  tone: 'positive' | 'negative' | 'neutral';
  value: string;
};

const CHART_HEIGHT = 191;
const DEFAULT_CHART_WIDTH = 301;
const EMPTY_MESSAGE = 'Performance path will appear after closed trades are available.';
const PERIODS: PeriodKey[] = ['1D', '1W', '1M', 'CUSTOM'];

export default function PerformanceScreen() {
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [period, setPeriod] = useState<PeriodKey>('1W');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(DEFAULT_CHART_WIDTH);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { accounts, accountsError, isLoadingAccounts, refreshAccounts, selectAccount, selectedAccount } = useAccounts();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [, activityResponse] = await Promise.all([
        refreshAccounts(),
        api.get<unknown>(periodTradeActivityEndpoint(period)),
      ]);
      const nextTrades = parseClosedTrades(activityResponse);

      setTrades(nextTrades);
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [period, refreshAccounts]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredTrades = useMemo(
    () => filterTrades(trades, selectedAccount, period, customStart, customEnd),
    [customEnd, customStart, period, selectedAccount, trades],
  );
  const hasAccountScopedTrades = useMemo(
    () => trades.some((trade) => trade.accountRef || trade.brokerAccountRef || trade.slotNumber),
    [trades],
  );
  const isLegacyFirstAccountFeed = !hasAccountScopedTrades && selectedAccount?.pathValue === '1';
  const shouldShowAccountScopeNotice = Boolean(selectedAccount && !hasAccountScopedTrades && selectedAccount.pathValue !== '1');
  const stats = useMemo(() => buildStats(filteredTrades), [filteredTrades]);
  const points = useMemo(() => buildCurvePoints(filteredTrades), [filteredTrades]);
  const chart = useMemo(() => buildChartGeometry(points, chartWidth), [chartWidth, points]);
  const selectedPoint = selectedIndex === null ? null : chart.points[selectedIndex] || null;

  const onChartLayout = (event: LayoutChangeEvent) => {
    setChartWidth(Math.max(73, Math.round(event.nativeEvent.layout.width)));
  };

  const updateSelectedPoint = (event: GestureResponderEvent) => {
    if (!chart.points.length) {
      return;
    }

    const locationX = event.nativeEvent.locationX;
    const nearest = chart.points.reduce(
      (best, point, index) => {
        const distance = Math.abs(point.x - locationX);
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );

    setSelectedIndex(nearest.index);
  };

  return (
    <AppShell
      onRefresh={load}
      refreshing={isLoading}
      showAccountNav
      title="Performance"
    >
      {isLoading || isLoadingAccounts ? <LoadingState label="Loading performance" /> : null}
      {error || accountsError ? <ErrorState message={error || accountsError || 'Connection failed.'} /> : null}
      {!isLoading && !isLoadingAccounts && !error && !accountsError ? (
        <>
          <Bismel1Card style={styles.selectorCard}>
            <View style={styles.topHeader}>
              <View style={styles.titleRow}>
                <ChartNoAxesCombined color={colors.accent} size={19} />
                <View>
                  <Text style={styles.eyebrow}>Trading Results</Text>
                </View>
              </View>
              <View style={styles.periodRow}>
                {PERIODS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setPeriod(item);
                      setSelectedIndex(null);
                    }}
                    style={[styles.periodChip, period === item && styles.periodChipActive]}
                  >
                    <Text style={[styles.periodText, period === item && styles.periodTextActive]}>
                      {item === 'CUSTOM' ? 'Custom' : item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.accountSelector}>
              <Text style={styles.selectorLabel}>Account</Text>
              <View style={styles.accountChips}>
                {accounts.length ? accounts.map((account) => (
                  <Pressable
                    key={account.id}
                    onPress={() => {
                      selectAccount(account.id);
                      setSelectedIndex(null);
                    }}
                    style={[styles.accountChip, selectedAccount?.id === account.id && styles.accountChipActive]}
                  >
                    <Text style={[styles.accountChipText, selectedAccount?.id === account.id && styles.accountChipTextActive]}>
                      {account.label}
                    </Text>
                    {account.pathValue ? <Text style={styles.accountMeta}>Account {account.pathValue}</Text> : null}
                  </Pressable>
                )) : (
                  <Text style={styles.mutedText}>No accounts returned.</Text>
                )}
              </View>
            </View>

            {period === 'CUSTOM' ? (
              <View style={styles.customRow}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setCustomStart}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  style={styles.dateInput}
                  value={customStart}
                />
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setCustomEnd}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  style={styles.dateInput}
                  value={customEnd}
                />
              </View>
            ) : null}
          </Bismel1Card>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.symbol ? (
                  <Text style={styles.statValue}>
                    <Text style={styles.neutralText}>{stat.symbol} </Text>
                    <Text style={stat.tone === 'positive' ? styles.positiveText : stat.tone === 'negative' ? styles.negativeText : styles.neutralText}>{stat.value}</Text>
                  </Text>
                ) : (
                  <Text style={[styles.statValue, stat.tone === 'positive' ? styles.positiveText : stat.tone === 'negative' ? styles.negativeText : styles.neutralText]}>
                    {stat.value}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <Bismel1Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.eyebrow}>{filteredTrades.length} Closed Trades</Text>
                <Text style={styles.chartTitle}>Cumulative Realized P/L</Text>
              </View>
              {chart.lastPoint ? <Text style={[styles.latestValue, { color: chart.lastPoint.toneColor }]}>{chart.lastPoint.valueLabel}</Text> : null}
            </View>

            {shouldShowAccountScopeNotice ? (
              <EmptyState message="Account-specific performance is not available for this connected account yet." />
            ) : points.length ? (
              <View style={styles.chartPanel}>
                <View style={styles.chartFrame}>
                  <View style={styles.chartAxis}>
                    {chart.ticks.map((tick, index) => (
                      <Text key={`${tick}-${index}`} numberOfLines={1} style={styles.chartTick}>
                        {tick}
                      </Text>
                    ))}
                  </View>
                  <View
                    onLayout={onChartLayout}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={updateSelectedPoint}
                    onResponderMove={updateSelectedPoint}
                    onStartShouldSetResponder={() => true}
                    style={styles.chartCanvas}
                  >
                    <Svg height={CHART_HEIGHT} width={chartWidth}>
                      <Defs>
                        <LinearGradient id="realizedFill" x1="0" x2="0" y1="0" y2="1">
                          <Stop offset="0" stopColor={chart.toneColor} stopOpacity="0.29" />
                          <Stop offset="0.57" stopColor={colors.accent} stopOpacity="0.13" />
                          <Stop offset="1" stopColor={colors.cyan} stopOpacity="0.03" />
                        </LinearGradient>
                        <LinearGradient id="realizedStroke" x1="0" x2="1" y1="0" y2="0">
                          <Stop offset="0" stopColor={colors.accentAlt} />
                          <Stop offset="0.47" stopColor={colors.cyan} />
                          <Stop offset="1" stopColor={chart.toneColor} />
                        </LinearGradient>
                      </Defs>
                      <Rect fill={colors.surfaceElevated} height={CHART_HEIGHT - 2} opacity="0.39" rx="11" width={chartWidth - 2} x="1" y="1" />
                      {chart.gridLines.map((y) => (
                        <Line
                          key={`grid-${y}`}
                          opacity="0.35"
                          stroke={colors.border}
                          strokeDasharray="3 7"
                          strokeWidth="1"
                          x1="11"
                          x2={chartWidth - 11}
                          y1={y}
                          y2={y}
                        />
                      ))}
                      <Line
                        opacity="0.53"
                        stroke={colors.textMuted}
                        strokeDasharray="5 7"
                        strokeWidth="1"
                        x1="11"
                        x2={chartWidth - 11}
                        y1={chart.zeroY}
                        y2={chart.zeroY}
                      />
                      {chart.areaPath ? <Path d={chart.areaPath} fill="url(#realizedFill)" /> : null}
                      {chart.linePath ? (
                        <>
                          <Path
                            d={chart.linePath}
                            fill="none"
                            opacity="0.19"
                            stroke={colors.cyan}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={7}
                          />
                          <Path
                            d={chart.linePath}
                            fill="none"
                            stroke="url(#realizedStroke)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                          />
                        </>
                      ) : null}
                      {chart.points.map((point, index) => (
                        <Circle
                          key={`${point.label}-${index}`}
                          cx={point.x}
                          cy={point.y}
                          fill={point.markerColor}
                          opacity={0.91}
                          r={2.5}
                          stroke={colors.backgroundAlt}
                          strokeWidth={1}
                        />
                      ))}
                      {chart.points.length === 1 && chart.lastPoint ? (
                        <Circle
                          cx={chart.lastPoint.x}
                          cy={chart.lastPoint.y}
                          fill={chart.lastPoint.markerColor}
                          opacity={0.95}
                          r={4}
                          stroke={colors.backgroundAlt}
                          strokeWidth={1}
                        />
                      ) : null}
                      {selectedPoint ? (
                        <>
                          <Line
                            opacity="0.53"
                            stroke={selectedPoint.toneColor}
                            strokeDasharray="3 5"
                            strokeWidth="1"
                            x1={selectedPoint.x}
                            x2={selectedPoint.x}
                            y1="11"
                            y2={CHART_HEIGHT - 19}
                          />
                          <Circle
                            cx={selectedPoint.x}
                            cy={selectedPoint.y}
                            fill={selectedPoint.markerColor}
                            opacity={0.97}
                            r={5}
                            stroke={colors.backgroundAlt}
                            strokeWidth={1}
                          />
                        </>
                      ) : null}
                    </Svg>
                    {selectedPoint ? (
                      <View style={[styles.tooltip, tooltipPosition(selectedPoint, chartWidth)]}>
                        <Text numberOfLines={1} style={styles.tooltipLabel}>{selectedPoint.label}</Text>
                        <Text style={[styles.tooltipValue, { color: selectedPoint.toneColor }]}>
                          Cumulative P/L: {selectedPoint.valueLabel}
                        </Text>
                        <Text style={[styles.tooltipMove, { color: selectedPoint.toneColor }]}>
                          Trade move: {selectedPoint.changeLabel}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : (
              <EmptyState message={EMPTY_MESSAGE} />
            )}
            {isLegacyFirstAccountFeed ? (
              <Text style={styles.scopeNote}>Using the available account performance feed.</Text>
            ) : null}
          </Bismel1Card>
        </>
      ) : null}
    </AppShell>
  );
}

const parseClosedTrades = (response: unknown): TradeRecord[] => {
  const root = asRecord(response);
  const rows = asArray(root.activity || root.trades || root.items || response).map(asRecord);

  return rows
    .map((row) => {
      const realizedPl = firstNumber(row, ['realized_pl', 'realized_pnl', 'pnl', 'profit_loss']);
      const timestamp = firstString(row, ['timestamp', 'created_at', 'filled_at', 'time'], '');
      const flow = firstString(row, ['trade_flow'], '').toLowerCase();

      if (flow !== 'exit' || typeof realizedPl !== 'number' || !timestamp || Number.isNaN(Date.parse(timestamp))) {
        return null;
      }

      return {
        accountLabel: firstString(row, ['account_label', 'account_name'], ''),
        accountRef: firstString(row, ['account_ref', 'account_id', 'account'], ''),
        brokerAccountRef: firstString(row, ['broker_account_ref', 'broker_account_id'], ''),
        realizedPl,
        realizedPlPercent: firstNumber(row, ['realized_pl_percent', 'realized_pnl_percent', 'pnl_percent']) ?? null,
        slotNumber: firstString(row, ['slot_number', 'account_slot', 'slot'], ''),
        symbol: firstString(row, ['symbol', 'ticker', 'asset_symbol'], 'Symbol'),
        timestamp,
      };
    })
    .filter((row): row is TradeRecord => Boolean(row));
};

const periodTradeActivityEndpoint = (period: PeriodKey) => {
  if (period === 'CUSTOM') {
    return endpoints.tradeActivity;
  }

  return `${endpoints.tradeActivity}?period=${period.toLowerCase()}`;
};

const filterTrades = (
  trades: TradeRecord[],
  account: ManagedAccount | null,
  period: PeriodKey,
  customStart: string,
  customEnd: string,
) => {
  const now = new Date();
  const start = periodStart(now, period, customStart);
  const end = period === 'CUSTOM' && customEnd ? endOfLocalDay(customEnd) : now;
  const hasScopedIdentity = trades.some((trade) => trade.accountRef || trade.brokerAccountRef || trade.slotNumber);

  return trades
    .filter((trade) => {
      if (!account) {
        return true;
      }

      if (hasScopedIdentity) {
        return tradeMatchesAccount(trade, account);
      }

      return account.pathValue === '1';
    })
    .filter((trade) => {
      if (period !== 'CUSTOM') {
        return true;
      }

      const time = new Date(trade.timestamp);
      return time >= start && time <= end;
    })
    .sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp));
};

const tradeMatchesAccount = (trade: TradeRecord, account: ManagedAccount) => {
  const raw = account.raw;
  const possibleIds = [
    account.id,
    account.pathValue,
    firstString(raw, ['broker_account_ref', 'broker_account_id'], ''),
    firstString(raw, ['account_ref', 'account_id'], ''),
    firstString(raw, ['slot_number', 'account_slot', 'slot'], ''),
  ].filter(Boolean);

  return [trade.accountRef, trade.brokerAccountRef, trade.slotNumber, trade.accountLabel].some((value) => value && possibleIds.includes(value));
};

const periodStart = (now: Date, period: PeriodKey, customStart: string) => {
  if (period === 'CUSTOM' && customStart) {
    const custom = new Date(`${customStart}T00:00:00`);
    if (!Number.isNaN(custom.getTime())) {
      return custom;
    }
  }

  const start = new Date(now);

  if (period === '1D') {
    start.setDate(start.getDate() - 1);
  } else if (period === '1W') {
    start.setDate(start.getDate() - 7);
  } else {
    start.setMonth(start.getMonth() - 1);
  }

  return start;
};

const endOfLocalDay = (value: string) => {
  const date = new Date(`${value}T23:59:59`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const buildStats = (trades: TradeRecord[]): StatItem[] => {
  const realized = trades.reduce((sum, trade) => sum + trade.realizedPl, 0);
  const winners = trades.filter((trade) => trade.realizedPl > 0);
  const losers = trades.filter((trade) => trade.realizedPl < 0);
  const average = trades.length ? realized / trades.length : 0;
  const best = trades.length ? trades.reduce((current, trade) => trade.realizedPl > current.realizedPl ? trade : current, trades[0]) : null;
  const worst = trades.length ? trades.reduce((current, trade) => trade.realizedPl < current.realizedPl ? trade : current, trades[0]) : null;
  const winRate = trades.length ? (winners.length / trades.length) * 100 : 0;

  return [
    { label: 'Realized P/L', tone: toneForNumber(realized), value: formatSignedMoney(realized) },
    { label: 'Closed Trades', tone: 'neutral', value: String(trades.length) },
    { label: 'Winning Trades', tone: 'positive', value: String(winners.length) },
    { label: 'Losing Trades', tone: losers.length ? 'negative' : 'neutral', value: String(losers.length) },
    { label: 'Win Rate', tone: 'positive', value: `${winRate.toFixed(2)}%` },
    { label: 'Average Trade P/L', tone: toneForNumber(average), value: formatSignedMoney(average) },
    { label: 'Best Trade', symbol: best?.symbol, tone: best ? toneForNumber(best.realizedPl) : 'neutral', value: best ? formatSignedMoney(best.realizedPl) : '' },
    { label: 'Worst Trade', symbol: worst?.symbol, tone: worst ? toneForNumber(worst.realizedPl) : 'neutral', value: worst ? formatSignedMoney(worst.realizedPl) : '' },
  ];
};

const buildCurvePoints = (trades: TradeRecord[]): PerformancePoint[] => {
  let runningTotal = 0;

  return trades.map((trade) => {
    runningTotal += trade.realizedPl;
    const tone = toneForNumber(trade.realizedPl);

    return {
      change: trade.realizedPl,
      changeLabel: formatSignedMoney(trade.realizedPl),
      label: `${trade.symbol} · ${formatShortDateTime(trade.timestamp)}`,
      markerColor: tone === 'negative' ? '#FF8A83' : tone === 'positive' ? '#9DFFD7' : '#9EF9FF',
      timestamp: trade.timestamp,
      toneColor: tone === 'negative' ? '#FF4D43' : tone === 'positive' ? '#26F29F' : '#8FA3B8',
      value: runningTotal,
      valueLabel: formatSignedMoney(runningTotal),
    };
  });
};

const buildChartGeometry = (points: PerformancePoint[], width: number) => {
  const safeWidth = Math.max(73, width);
  const xStart = 11;
  const xEnd = safeWidth - 7;
  const top = 13;
  const bottom = CHART_HEIGHT - 23;
  const plotHeight = bottom - top;
  const values = points.map((point) => point.value);
  const domain = buildNiceDomain(Math.min(0, ...values), Math.max(0, ...values));
  const minY = domain.min;
  const maxY = domain.max;
  const range = maxY - minY || 1;
  const gridLines = domain.ticks.map((_, index) => top + (plotHeight / Math.max(1, domain.ticks.length - 1)) * index);
  const ticks = domain.ticks.map(formatAxisMoney);
  const zeroY = top + (plotHeight - ((0 - minY) / range) * plotHeight);
  const xStep = (xEnd - xStart) / Math.max(1, points.length - 1);
  const chartPoints: ChartPoint[] = points.map((point, index) => ({
    ...point,
    x: xStart + index * xStep,
    y: points.length === 1 ? Math.round((top + bottom) / 2) : top + (plotHeight - ((point.value - minY) / range) * plotHeight),
  }));
  const linePath = smoothPath(chartPoints);
  const firstPoint = chartPoints[0] || null;
  const lastPoint = chartPoints[chartPoints.length - 1] || null;
  const areaPath = firstPoint && lastPoint && chartPoints.length > 1
    ? `${linePath} L ${lastPoint.x.toFixed(1)} ${zeroY.toFixed(1)} L ${firstPoint.x.toFixed(1)} ${zeroY.toFixed(1)} Z`
    : '';

  return {
    areaPath,
    gridLines,
    lastPoint,
    linePath,
    points: chartPoints,
    ticks,
    toneColor: lastPoint?.toneColor || '#00D9FF',
    zeroY,
  };
};

const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) {
    return '';
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    }

    const previous = points[index - 1];
    const controlOffset = (point.x - previous.x) / 2;

    return `${path} C ${(previous.x + controlOffset).toFixed(1)} ${previous.y.toFixed(1)}, ${(point.x - controlOffset).toFixed(1)} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, '');
};

const toneForNumber = (value: number): StatItem['tone'] => {
  if (value > 0) {
    return 'positive';
  }

  if (value < 0) {
    return 'negative';
  }

  return 'neutral';
};

const buildNiceDomain = (minValue: number, maxValue: number) => {
  const rawRange = Math.max(1, maxValue - minValue);
  const step = niceStep(rawRange / 5);
  const min = Math.floor(minValue / step) * step;
  const max = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];

  for (let value = max; value >= min; value -= step) {
    ticks.push(roundTick(value));
  }

  return {
    max,
    min,
    ticks: ticks.length >= 2 ? ticks : [max, min],
  };
};

const niceStep = (value: number) => {
  const exponent = Math.floor(Math.log10(value));
  const base = value / 10 ** exponent;
  const niceBase = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;

  return niceBase * 10 ** exponent;
};

const roundTick = (value: number) => Math.abs(value) < 0.0001 ? 0 : Number(value.toFixed(2));

const formatAxisMoney = (value: number) => {
  const absolute = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absolute >= 1000000) {
    return `${sign}$${trimNumber(absolute / 1000000)}M`;
  }

  if (absolute >= 1000) {
    return `${sign}$${trimNumber(absolute / 1000)}K`;
  }

  return `${sign}$${trimNumber(absolute)}`;
};

const trimNumber = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

const formatShortDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const tooltipPosition = (point: { x: number; y: number }, width: number) => ({
  left: Math.min(Math.max(point.x - 73, 5), Math.max(5, width - 157)),
  top: Math.max(5, point.y - 67),
});

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    gap: 15,
    padding: 15,
  },
  selectorCard: {
    gap: 7,
    paddingBottom: 11,
    paddingHorizontal: 15,
    paddingTop: 11,
  },
  chartCard: {
    gap: 11,
    paddingBottom: 11,
    paddingHorizontal: 7,
    paddingTop: 15,
  },
  topHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
    minHeight: 43,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingTop: 5,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-end',
    maxWidth: 227,
  },
  periodChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  periodChipActive: {
    borderColor: colors.cyan,
    borderWidth: 2,
  },
  periodText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
  },
  periodTextActive: {
    color: colors.cyan,
  },
  accountSelector: {
    gap: 7,
    marginTop: -5,
  },
  selectorLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
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
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  accountChipActive: {
    borderColor: colors.cyan,
    borderWidth: 2,
  },
  accountChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  accountChipTextActive: {
    color: colors.success,
  },
  accountMeta: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 3,
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  customRow: {
    flexDirection: 'row',
    gap: 7,
  },
  dateInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 7,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 1,
    minHeight: 45,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 13,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 19,
  },
  positiveText: {
    color: colors.success,
  },
  negativeText: {
    color: colors.danger,
  },
  neutralText: {
    color: colors.text,
  },
  chartHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    position: 'relative',
  },
  chartTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  latestValue: {
    backgroundColor: colors.accentMuted,
    borderBottomLeftRadius: 9,
    borderColor: colors.borderStrong,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    fontSize: 17,
    fontWeight: '900',
    paddingHorizontal: 11,
    paddingVertical: 7,
    position: 'absolute',
    right: -7,
    textAlign: 'right',
    top: -31,
  },
  chartPanel: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    gap: 5,
    paddingBottom: 5,
    marginHorizontal: -1,
    paddingLeft: 0,
    paddingRight: 3,
    paddingTop: 5,
  },
  chartFrame: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 0,
  },
  chartAxis: {
    justifyContent: 'space-between',
    paddingBottom: 23,
    paddingTop: 13,
    width: 29,
  },
  chartTick: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 11,
    opacity: 0.73,
    textAlign: 'right',
  },
  chartCanvas: {
    flex: 1,
    minHeight: CHART_HEIGHT,
    position: 'relative',
  },
  tooltip: {
    backgroundColor: 'rgba(5, 16, 27, 0.73)',
    borderColor: colors.borderStrong,
    borderRadius: 7,
    borderWidth: 1,
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 5,
    position: 'absolute',
    width: 151,
  },
  tooltipLabel: {
    color: colors.textSoft,
    fontSize: 9,
    fontWeight: '900',
  },
  tooltipValue: {
    fontSize: 11,
    fontWeight: '900',
  },
  tooltipMove: {
    fontSize: 9,
    fontWeight: '800',
  },
  scopeNote: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 15,
    textAlign: 'center',
  },
});
