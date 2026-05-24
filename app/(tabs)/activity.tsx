// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: activity.tsx - app/(tabs)/activity.tsx
// =====================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Activity as ActivityIcon, ArrowUp, CircleDot } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatMoney, formatSignedMoney } from '@/utils/money';
import { formatSignedPercent } from '@/utils/percent';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';
import { formatDateTime } from '@/utils/dates';

type ActivityTab = 'trades' | 'system';

export default function ActivityScreen() {
  const [tab, setTab] = useState<ActivityTab>('trades');
  const [trades, setTrades] = useState<Record<string, unknown>[]>([]);
  const [system, setSystem] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, width, height);

  const loadActivity = useCallback(async () => {
    setIsLoading(true);

    const [tradeResult, systemResult] = await Promise.allSettled([
      api.get<unknown>(endpoints.tradeActivity),
      api.get<unknown>(endpoints.systemActivity),
    ]);

    if (tradeResult.status === 'fulfilled') {
      setTrades(asArray(asRecord(tradeResult.value).activity || asRecord(tradeResult.value).trades || tradeResult.value).map(asRecord));
      setTradeError(null);
    } else {
      setTradeError(customerSafeMessage(tradeResult.reason));
    }

    if (systemResult.status === 'fulfilled') {
      setSystem(asArray(asRecord(systemResult.value).activity || systemResult.value).map(asRecord));
      setSystemError(null);
    } else {
      setSystemError(customerSafeMessage(systemResult.reason));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const rows = tab === 'trades' ? trades : system;
  const error = tab === 'trades' ? tradeError : systemError;
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setShowBackTop(false);
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextVisible = event.nativeEvent.contentOffset.y > 271;

    setShowBackTop((currentVisible) => currentVisible === nextVisible ? currentVisible : nextVisible);
  };
  const backTopControl = !isLoading && !error && rows.length > 3 && showBackTop ? (
    <Pressable accessibilityLabel="Back to top" accessibilityRole="button" onPress={scrollToTop} style={styles.backTopButton}>
      <ArrowUp color={colors.cyan} size={15} />
      <Text style={styles.backTopText}>Top</Text>
    </Pressable>
  ) : null;

  return (
    <AppShell
      floatingAction={backTopControl}
      onRefresh={loadActivity}
      onScroll={handleScroll}
      refreshing={isLoading}
      scrollRef={scrollRef}
      showAccountNav
      title="Activity"
    >
      <View style={styles.segment}>
        <Pressable onPress={() => setTab('trades')} style={[styles.segmentButton, tab === 'trades' && styles.active]}>
          <Text style={styles.segmentText}>Trade Activity</Text>
        </Pressable>
        <Pressable onPress={() => setTab('system')} style={[styles.segmentButton, tab === 'system' && styles.active]}>
          <Text style={styles.segmentText}>System Activity</Text>
        </Pressable>
      </View>
      {isLoading ? <LoadingState label="Loading activity" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && rows.length === 0 ? <EmptyState message="No activity returned." /> : null}
      <View style={styles.cardGrid}>
        {rows.map((item, index) => (
          tab === 'trades' ? (
            <TradeActivityCard
              colors={colors}
              item={item}
              key={String(item.id || index)}
              styles={styles}
              tone={index % 2 === 0 ? 'cyan' : 'green'}
            />
          ) : (
            <SystemActivityCard
              colors={colors}
              item={item}
              key={String(item.id || index)}
              styles={styles}
              tone={index % 2 === 0 ? 'cyan' : 'purple'}
            />
          )
        ))}
      </View>
    </AppShell>
  );
}

function TradeActivityCard({
  colors,
  item,
  styles,
  tone,
}: {
  colors: ThemeColors;
  item: Record<string, unknown>;
  styles: ReturnType<typeof makeStyles>;
  tone: 'cyan' | 'green' | 'purple';
}) {
  const trade = buildTradeRecord(item);
  const sideTone = getTradeTone(trade.sideText);
  const reasonTone = getTradeTone(trade.reasonText);
  const pnlTone = getPnlTone(trade.realizedPnl);

  return (
    <View style={[styles.activityCard, tone === 'green' ? styles.cardGreen : styles.cardCyan]}>
      <Text style={styles.attachedTime}>{trade.timeLine}</Text>
      <View style={styles.cardHeader}>
        <View style={[styles.neonLine, tone === 'green' ? styles.neonLineGreen : styles.neonLineCyan]} />
        <ActivityIcon color={tone === 'green' ? colors.success : colors.cyan} size={19} />
        <Text style={[styles.title, sideTone === 'up' ? styles.positiveText : sideTone === 'down' ? styles.negativeText : styles.gridText]}>{trade.sideText}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <Text style={styles.gridCell}>
            <Text style={styles.symbolText}>{trade.symbol}: </Text>
            <Text style={sideTone === 'up' ? styles.positiveText : styles.negativeText}>{trade.sideText}</Text>
            {trade.reasonText ? (
              <Text>
                {' / '}
                <Text style={reasonTone === 'up' ? styles.positiveText : reasonTone === 'down' ? styles.negativeText : styles.gridText}>{trade.reasonText}</Text>
              </Text>
            ) : null}
          </Text>
          <Text style={[styles.gridCell, styles.gridCellRight]}>{trade.productStatus}</Text>
        </View>

        {trade.detailLine || trade.fillLine || trade.valueLine ? (
          <View style={[styles.gridRow, !trade.pnlValue && styles.gridRowLast]}>
            <Text style={styles.gridCell}>{trade.fillLine || trade.detailLine}</Text>
            <Text style={[styles.gridCell, styles.gridCellRight]}>{trade.valueLine || trade.accountLine}</Text>
          </View>
        ) : null}

        {trade.pnlValue ? (
          <View style={[styles.gridRow, styles.gridRowLast, styles.gridRowSingle]}>
            <Text style={styles.gridCell}>
              <Text>Realized P/L: </Text>
              <Text style={pnlTone === 'up' ? styles.positiveText : pnlTone === 'down' ? styles.negativeText : styles.gridText}>{trade.pnlValue}</Text>
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SystemActivityCard({
  colors,
  item,
  styles,
  tone,
}: {
  colors: ThemeColors;
  item: Record<string, unknown>;
  styles: ReturnType<typeof makeStyles>;
  tone: 'cyan' | 'green' | 'purple';
}) {
  return (
    <View style={[styles.activityCard, tone === 'purple' ? styles.cardPurple : styles.cardCyan]}>
      <Text style={styles.attachedTime}>{formatDateTime(item.created_at || item.timestamp || item.time)}</Text>
      <View style={styles.cardHeader}>
        <View style={[styles.neonLine, tone === 'purple' ? styles.neonLinePurple : styles.neonLineCyan]} />
        <CircleDot color={tone === 'purple' ? colors.purple : colors.cyan} size={19} />
        <Text style={styles.title}>{firstString(item, ['label', 'title', 'event', 'type'], 'System Activity')}</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <Text style={styles.gridCell}>{firstString(item, ['symbol'], firstString(item, ['activity_product', 'product'], 'Bismel1'))}</Text>
          <Text style={[styles.gridCell, styles.gridCellRight]}>{firstString(item, ['activity_product', 'product'], 'Bismel1')}</Text>
        </View>
        <View style={[styles.gridRow, styles.gridRowLast]}>
          <Text style={styles.gridCell}>{firstString(item, ['detail', 'message', 'description', 'status'], 'Activity recorded')}</Text>
        </View>
      </View>
    </View>
  );
}

const buildTradeRecord = (item: Record<string, unknown>) => {
  const symbol = firstString(item, ['symbol', 'ticker', 'asset_symbol'], 'Symbol');
  const sideText = normalizeTradeSide(item);
  const realizedPnl = firstNumber(item, ['realized_pl', 'realized_pnl', 'pnl', 'profit_loss']);
  const reasonText = normalizeTradeReason(item, realizedPnl);
  const product = firstString(item, ['activity_product', 'product_label', 'product_name', 'product'], 'Product');
  const status = normalizeStatus(firstString(item, ['status', 'order_status', 'fill_status', 'label'], 'Filled'));
  const tradeFlow = firstString(item, ['trade_flow'], '').toLowerCase();
  const qty = firstNumber(item, ['qty', 'quantity', 'filled_qty', 'filled_quantity', 'shares']);
  const price = firstNumber(item, ['price', 'filled_avg_price', 'avg_fill_price', 'fill_price', 'average_price']);
  const value = firstNumber(item, ['value', 'notional', 'filled_value', 'order_value', 'market_value']);
  const entry = firstNumber(item, ['entry_price', 'average_entry', 'avg_entry_price', 'average_entry_price']);
  const realizedPnlPercent = firstNumber(item, ['realized_pl_percent', 'realized_pnl_percent', 'pnl_percent', 'profit_loss_percent']);
  const currency = firstString(item, ['currency'], 'USD');
  const display = asRecord(item.display);
  const detailLine = cleanTradeDetail(firstString(item, ['detail', 'message', 'description'], ''));

  return {
    symbol,
    sideText,
    reasonText,
    productStatus: `${product} ${status}.`,
    fillLine: formatFillLine(qty, price, currency, display),
    valueLine: formatValueLine(value, entry, currency, display),
    pnlValue: tradeFlow === 'entry' ? '' : formatPnlValue(realizedPnl, realizedPnlPercent, currency, display),
    accountLine: firstString(item, ['account_label', 'account_name'], ''),
    detailLine,
    realizedPnl,
    timeLine: formatDateTime(item.created_at || item.timestamp || item.time || item.filled_at),
  };
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

  return formatTitle(source);
};

const normalizeTradeReason = (item: Record<string, unknown>, realizedPnl: number | undefined) => {
  const flow = firstString(item, ['trade_flow'], '').toLowerCase();

  if (flow === 'entry') {
    return 'Open';
  }

  if (flow === 'exit') {
    return typeof realizedPnl === 'number' && realizedPnl >= 0 ? 'Take Profit Close' : 'Strategy Exit';
  }

  const source = firstString(item, ['reason', 'exit_reason', 'strategy_event', 'activity_type', 'category', 'label', 'title'], '');
  const value = source.toLowerCase().replace(/_/g, ' ');

  if (!value) {
    return '';
  }

  if (value.includes('take profit')) {
    return 'Take Profit Close';
  }

  if (value.includes('strategy exit')) {
    return 'Strategy Exit';
  }

  if (value.includes('broker reconcile')) {
    return 'Broker Reconcile';
  }

  if (value.includes('open')) {
    return 'Open';
  }

  const cleaned = source.replace(/\b(sell|buy|filled|order|trade activity recorded for)\b/gi, '').replace(/\s+/g, ' ').trim();

  return cleaned ? formatTitle(cleaned) : '';
};

const normalizeStatus = (value: string) => {
  const status = value.toLowerCase();

  if (status.includes('fill') || status.includes('entry') || status.includes('exit')) {
    return 'Filled';
  }

  return formatTitle(value);
};

const cleanTradeDetail = (value: string) =>
  value
    .replace(/trade activity recorded for\s+[A-Z0-9.-]+\.?/gi, '')
    .replace(/trade activity recorded for\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

const displayMoneyAsCurrency = (value: string, currency: string) => {
  if (!value || value === 'Not available') {
    return '';
  }

  if (value.startsWith('+$')) {
    return `+${currency} ${value.slice(2)}`;
  }

  if (value.startsWith('-$')) {
    return `-${currency} ${value.slice(2)}`;
  }

  return value.startsWith('$') ? `${currency} ${value.slice(1)}` : value;
};

const formatFillLine = (qty: number | undefined, price: number | undefined, currency: string, display: Record<string, unknown>) => {
  if (typeof qty !== 'number' && typeof price !== 'number') {
    return '';
  }

  const displayShares = firstString(display, ['shares'], '');
  const displayPrice = displayMoneyAsCurrency(firstString(display, ['fill_price'], ''), currency);
  const qtyText = displayShares ? `${displayShares} shares` : typeof qty === 'number' ? `${Number(qty.toFixed(6))} shares` : 'Shares';
  const priceText = displayPrice || (typeof price === 'number' ? `${currency} ${price.toFixed(2)}` : 'price pending');

  return `${qtyText} at ${priceText}. Order`;
};

const formatValueLine = (value: number | undefined, entry: number | undefined, currency: string, display: Record<string, unknown>) => {
  if (typeof value !== 'number' && typeof entry !== 'number') {
    return '';
  }

  const displayValue = displayMoneyAsCurrency(firstString(display, ['order_value'], ''), currency);
  const displayEntry = displayMoneyAsCurrency(firstString(display, ['entry_price'], ''), currency);
  const valueText = displayValue || (typeof value === 'number' ? formatMoney(value, currency).replace('$', `${currency} `) : 'Pending');
  const entryText = displayEntry || (typeof entry === 'number' ? `${currency} ${entry.toFixed(2)}` : 'Pending');

  return `Value: ${valueText}. Entry: ${entryText}.`;
};

const formatPnlValue = (pnl: number | undefined, percent: number | undefined, currency: string, display: Record<string, unknown>) => {
  if (typeof pnl !== 'number') {
    return '';
  }

  const displayPnl = displayMoneyAsCurrency(firstString(display, ['realized_pl'], ''), currency);
  const displayPercent = firstString(display, ['realized_pl_percent'], '');
  const moneyText = displayPnl || formatSignedMoney(pnl, currency).replace('$', `${currency} `);
  const percentText = displayPercent ? ` (${displayPercent})` : typeof percent === 'number' ? ` (${formatSignedPercent(percent)})` : '';

  return `${moneyText}${percentText}.`;
};

const getPnlTone = (value: number | undefined) => {
  if (typeof value !== 'number') {
    return 'neutral';
  }

  return value >= 0 ? 'up' : 'down';
};

const getTradeTone = (value: string) => {
  const text = value.toLowerCase();

  if (text.includes('buy') || text.includes('open') || text.includes('take profit')) {
    return 'up';
  }

  if (text.includes('sell') || text.includes('strategy exit') || text.includes('broker reconcile')) {
    return 'down';
  }

  return 'neutral';
};

const formatTitle = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const makeStyles = (colors: ThemeColors, width: number, height: number) => {
  const useColumns = Math.min(width, height) >= 600 || width >= 900;

  return StyleSheet.create({
  segment: {
    backgroundColor: colors.surface,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 7,
    flex: 1,
    padding: spacing.md,
  },
  active: {
    backgroundColor: colors.accentMuted,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 17,
  },
  segmentText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  activityCard: {
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
    width: useColumns ? '48%' : '100%',
  },
  attachedTime: {
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
  cardCyan: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
  },
  cardGreen: {
    borderColor: colors.success,
    shadowColor: colors.success,
  },
  cardPurple: {
    borderColor: colors.purple,
    shadowColor: colors.purple,
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
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
  neonLinePurple: {
    backgroundColor: colors.purple,
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
    flexDirection: 'row',
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
  symbolText: {
    color: colors.text,
    fontWeight: '900',
  },
  positiveText: {
    color: colors.success,
  },
  negativeText: {
    color: colors.danger,
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
};
