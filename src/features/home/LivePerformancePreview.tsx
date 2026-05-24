// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: LivePerformancePreview.tsx - src/features/home/LivePerformancePreview.tsx
// =====================================================
import { useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Activity, Clock3, ShieldCheck } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { Bismel1Card } from '@/components/Bismel1Card';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';

type LiveMetric = {
  key: string;
  label: string;
  value: string;
  tone?: 'up' | 'down' | 'neutral' | string;
};

type ChartPoint = {
  value: number;
  label?: string;
};

type LiveGroup = {
  key: string;
  label: string;
  items?: unknown[];
};

type LiveGroupItem = {
  symbol: string;
  pnl?: string;
  pnlPercent?: string;
  tone?: LiveMetric['tone'];
};

type LiveCompanyData = {
  eyebrow?: string;
  title?: string;
  status?: string;
  updated_label?: string;
  metrics?: LiveMetric[];
  chart?: {
    type?: string;
    unit?: string;
    points?: ChartPoint[];
  };
  groups?: LiveGroup[];
  safety?: {
    source?: string;
    direct_broker_call?: boolean;
    contains_credentials?: boolean;
    contains_raw_account_ids?: boolean;
    contains_order_ids?: boolean;
  };
};

type HomeLivePerformanceResponse = {
  live_company_data?: LiveCompanyData;
};

const CHART_WIDTH = 287;
const CHART_HEIGHT = 137;

export function LivePerformancePreview() {
  const [data, setData] = useState<LiveCompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(CHART_WIDTH);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<HomeLivePerformanceResponse>(endpoints.homeLivePerformance, false);
        setData(response.live_company_data || null);
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const metrics = useMemo(() => data?.metrics || [], [data?.metrics]);
  const points = useMemo(() => data?.chart?.points || [], [data?.chart?.points]);
  const groups = useMemo(() => data?.groups || [], [data?.groups]);
  const chart = useMemo(() => buildChartGeometry(points, chartWidth), [chartWidth, points]);
  const chartTicks = useMemo(() => buildChartTicks(points), [points]);
  const displayTitle = data?.title === 'Live Performance' ? 'Performance' : data?.title;
  const selectedPoint = selectedIndex === null ? null : chart.chartPoints[selectedIndex] || null;
  const selectedDataPoint = selectedIndex === null ? null : points[selectedIndex] || null;

  const onChartLayout = (event: LayoutChangeEvent) => {
    const width = Math.max(73, Math.round(event.nativeEvent.layout.width));
    setChartWidth(width);
  };

  const updateSelectedPoint = (event: GestureResponderEvent) => {
    if (!chart.chartPoints.length) {
      return;
    }

    const locationX = event.nativeEvent.locationX;
    const nearest = chart.chartPoints.reduce(
      (best, point, index) => {
        const distance = Math.abs(point.x - locationX);
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );

    setSelectedIndex(nearest.index);
  };

  if (isLoading) {
    return (
      <Bismel1Card style={styles.card}>
        <LoadingState label="Loading live performance" />
      </Bismel1Card>
    );
  }

  if (error) {
    return (
      <Bismel1Card style={styles.card}>
        <Text style={styles.error}>{error}</Text>
      </Bismel1Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Bismel1Card style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          {data.eyebrow ? <Text style={styles.eyebrow}>{data.eyebrow}</Text> : null}
          {displayTitle ? <Text style={styles.title}>{displayTitle}</Text> : null}
        </View>
        {data.status ? (
          <View style={styles.statusPill}>
            <Activity color={colors.success} size={15} />
            <Text style={styles.statusText}>Live</Text>
          </View>
        ) : null}
      </View>

      {metrics.length ? (
        <View style={styles.metricsGrid}>
          {metrics.slice(0, 4).map((metric) => (
            <View key={metric.key} style={styles.metric}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={[styles.metricValue, toneStyle(metric.tone, colors)]}>{metric.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {points.length ? (
        <View style={styles.chartPanel}>
          <View style={styles.chartFrame}>
            <View style={styles.chartAxis}>
              {chartTicks.map((tick, index) => (
                <Text key={`${tick}-${index}`} numberOfLines={1} style={styles.chartTick}>{tick}</Text>
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
                  <LinearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <Stop offset="0" stopColor={chart.toneColor} stopOpacity="0.31" />
                    <Stop offset="0.57" stopColor={colors.accent} stopOpacity="0.13" />
                    <Stop offset="1" stopColor={colors.cyan} stopOpacity="0.03" />
                  </LinearGradient>
                  <LinearGradient id="chartStroke" x1="0" x2="1" y1="0" y2="0">
                    <Stop offset="0" stopColor={colors.accent} />
                    <Stop offset="0.53" stopColor={colors.cyan} />
                    <Stop offset="1" stopColor={chart.toneColor} />
                  </LinearGradient>
                </Defs>
                <Rect fill={colors.surfaceElevated} height={CHART_HEIGHT - 2} opacity="0.39" rx="11" width={chartWidth - 2} x="1" y="1" />
                {chart.gridLines.map((y) => (
                  <Line
                    key={`grid-y-${y}`}
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
                <Path d={chart.areaPath} fill="url(#chartFill)" />
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
                      stroke="url(#chartStroke)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                    />
                  </>
                ) : null}
                {chart.chartPoints.map((point, index) => (
                  <Circle
                    key={`point-${index}-${point.x}`}
                    cx={point.x}
                    cy={point.y}
                    fill={point.markerColor}
                    opacity={0.89}
                    r={2}
                    stroke={colors.backgroundAlt}
                    strokeWidth={1}
                  />
                ))}
                {chart.lastPoint && !selectedPoint ? (
                  <>
                    <Circle cx={chart.lastPoint.x} cy={chart.lastPoint.y} fill={chart.lastPoint.markerColor} opacity={0.95} r={4} stroke={colors.backgroundAlt} strokeWidth={1} />
                    <Circle cx={chart.lastPoint.x} cy={chart.lastPoint.y} fill={colors.white} opacity={0.47} r={1} />
                  </>
                ) : null}
                {selectedPoint ? (
                  <>
                    <Line
                      opacity="0.47"
                      stroke={selectedPoint.toneColor}
                      strokeDasharray="3 5"
                      strokeWidth="1"
                      x1={selectedPoint.x}
                      x2={selectedPoint.x}
                      y1="11"
                      y2={CHART_HEIGHT - 17}
                    />
                    <Circle cx={selectedPoint.x} cy={selectedPoint.y} fill={selectedPoint.markerColor} opacity={0.95} r={5} stroke={colors.backgroundAlt} strokeWidth={1} />
                    <Circle cx={selectedPoint.x} cy={selectedPoint.y} fill={colors.white} opacity={0.47} r={1.5} />
                  </>
                ) : null}
              </Svg>
              {selectedPoint && selectedDataPoint ? (
                <View style={[styles.tooltip, tooltipPosition(selectedPoint, chartWidth)]}>
                  <Text style={styles.tooltipLabel}>Closed-exit curve</Text>
                  <Text style={[styles.tooltipValue, { color: selectedPoint.toneColor }]}>
                    {selectedDataPoint.label || `${selectedDataPoint.value.toFixed(2)}%`}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {points[points.length - 1]?.label ? <Text style={styles.chartLabel}>{points[points.length - 1].label}</Text> : null}
        </View>
      ) : (
        <View style={styles.chartEmpty}>
          <Text style={styles.chartEmptyText}>Performance history preparing.</Text>
        </View>
      )}

      {groups.length ? (
        <View style={styles.groups}>
          {groups.map((group) => {
            const items = (group.items || [])
              .map(groupItem)
              .filter((item): item is LiveGroupItem => Boolean(item));

            return (
              <View key={group.key} style={styles.groupPanel}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  {groupRealizedPnl(items) ? (
                    <Text style={[styles.groupPnl, toneStyle(groupRealizedTone(items), colors)]}>
                      Test Account Realized P/L: {groupRealizedPnl(items)}
                    </Text>
                  ) : null}
                </View>
                {items.length ? (
                  <View style={styles.groupItems}>
                    {items.map((item, index) => (
                      <View key={`${group.key}-${item.symbol}-${index}`} style={styles.itemCard}>
                        <Text style={styles.itemSymbol}>{item.symbol}</Text>
                        {item.pnl ? (
                          <Text style={[styles.itemPnl, toneStyle(item.tone, colors)]}>{item.pnl}</Text>
                        ) : null}
                        {item.pnlPercent ? (
                          <Text style={[styles.itemPercent, toneStyle(item.tone, colors)]}>
                            {item.pnlPercent}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.footer}>
        {data.updated_label ? (
          <View style={styles.footerItem}>
            <Clock3 color={colors.textMuted} size={15} />
            <Text style={styles.footerText}>{data.updated_label}</Text>
          </View>
        ) : null}
        {data.safety ? (
          <View style={styles.footerItem}>
            <ShieldCheck color={colors.success} size={15} />
            <Text style={styles.footerText}>Snapshot</Text>
          </View>
        ) : null}
      </View>
    </Bismel1Card>
  );
}

const buildChartGeometry = (points: ChartPoint[], width: number) => {
  const values = points.map((point) => Number(point.value)).filter(Number.isFinite);
  const safeWidth = Math.max(73, width);
  const xStart = 11;
  const xEnd = safeWidth - 11;
  const top = 13;
  const bottom = CHART_HEIGHT - 19;
  const baseline = bottom;
  const gridLines = Array.from({ length: 5 }, (_, index) => top + ((bottom - top) / 4) * index);

  if (!values.length) {
    return {
      areaPath: '',
      chartPoints: [],
      gridLines,
      lastPoint: null,
      linePath: '',
      toneColor: '#00D9FF',
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = (xEnd - xStart) / Math.max(values.length - 1, 1);

  const chartPoints = points
    .map((point, index) => {
      const normalized = (Number(point.value) - min) / range;
      const x = xStart + index * xStep;
      const y = values.length === 1 ? Math.round((top + bottom) / 2) : top + (1 - normalized) * (bottom - top);
      return {
        markerColor: pointMarkerColor(point.value),
        toneColor: pointToneColor(point.value),
        x,
        y,
      };
    });

  const linePath = smoothPath(chartPoints);
  const firstPoint = chartPoints[0];
  const lastPoint = chartPoints[chartPoints.length - 1];
  const areaPath = chartPoints.length === 1
    ? `M ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)} L ${firstPoint.x.toFixed(1)} ${baseline} Z`
    : `${linePath} L ${lastPoint.x.toFixed(1)} ${baseline} L ${firstPoint.x.toFixed(1)} ${baseline} Z`;

  return {
    areaPath,
    chartPoints,
    gridLines,
    lastPoint,
    linePath,
    toneColor: pointToneColor(lastPoint ? points[chartPoints.length - 1]?.value || 0 : 0),
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

const buildChartTicks = (points: ChartPoint[]) => {
  const values = points.map((point) => Number(point.value)).filter(Number.isFinite);

  if (!values.length) {
    return ['0%', '0%', '0%', '0%', '0%'];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return Array.from({ length: 5 }, (_, index) => {
    const value = max - (range / 4) * index;
    return formatPercentTick(value);
  });
};

const formatPercentTick = (value: number) => {
  if (Math.abs(value) < 0.01) {
    return '0%';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(Math.abs(value) >= 10 ? 0 : 1)}%`;
};

const pointToneColor = (value: number) => {
  if (value > 0) {
    return '#26F29F';
  }

  if (value < 0) {
    return '#FF4D43';
  }

  return '#00D9FF';
};

const pointMarkerColor = (value: number) => {
  if (value > 0) {
    return '#9DFFD7';
  }

  if (value < 0) {
    return '#FF8A83';
  }

  return '#9EF9FF';
};

const tooltipPosition = (point: { x: number; y: number }, width: number) => ({
  left: Math.min(Math.max(point.x - 47, 5), Math.max(5, width - 101)),
  top: Math.max(5, point.y - 53),
});

const toneStyle = (tone: LiveMetric['tone'], colors: ThemeColors) => {
  if (tone === 'up') {
    return { color: colors.success };
  }

  if (tone === 'down') {
    return { color: colors.danger };
  }

  return { color: colors.text };
};

const groupItem = (item: unknown): LiveGroupItem | null => {
  if (typeof item === 'string' || typeof item === 'number') {
    return { symbol: String(item) };
  }

  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    const symbol = record.symbol || record.label || record.name || record.title || record.key;

    if (typeof symbol === 'string' || typeof symbol === 'number') {
      const pnl = record.pnl;
      const pnlPercent = record.pnl_percent || record.pnlPercent;
      const tone = record.tone;

      return {
        symbol: String(symbol),
        pnl: typeof pnl === 'string' || typeof pnl === 'number' ? String(pnl) : undefined,
        pnlPercent: typeof pnlPercent === 'string' || typeof pnlPercent === 'number' ? String(pnlPercent) : undefined,
        tone: typeof tone === 'string' ? tone : undefined,
      };
    }
  }

  return null;
};

const groupRealizedPnl = (items: LiveGroupItem[]) => {
  const total = items.reduce((sum, item) => {
    const value = parseMoney(item.pnl);
    return value === null ? sum : sum + value;
  }, 0);

  if (!items.some((item) => parseMoney(item.pnl) !== null)) {
    return null;
  }

  return `${total >= 0 ? '+' : '-'}$${Math.abs(total).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
};

const groupRealizedTone = (items: LiveGroupItem[]) => {
  const total = items.reduce((sum, item) => {
    const value = parseMoney(item.pnl);
    return value === null ? sum : sum + value;
  }, 0);

  if (total > 0) {
    return 'up';
  }

  if (total < 0) {
    return 'down';
  }

  return 'neutral';
};

const parseMoney = (value?: string) => {
  if (!value) {
    return null;
  }

  const normalized = Number(value.replace(/[$,+\s]/g, ''));
  return Number.isFinite(normalized) ? normalized : null;
};

const makeStyles = (colors: ThemeColors) => {
  const productPanelSurface = colors.background === '#02060B' ? 'rgba(7, 19, 31, 0.07)' : 'rgba(255, 255, 255, 0.19)';
  const productTileSurface = colors.background === '#02060B' ? 'rgba(7, 19, 31, 0.11)' : 'rgba(255, 255, 255, 0.19)';

  return StyleSheet.create({
  card: {
    gap: 11,
    padding: 15,
  },
  headingRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
  },
  headingCopy: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  metric: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 5,
    padding: 11,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: typography.h3,
    fontWeight: '800',
  },
  chartPanel: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    gap: 5,
    padding: 9,
  },
  chartFrame: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 3,
  },
  chartAxis: {
    justifyContent: 'space-between',
    paddingBottom: 17,
    paddingTop: 13,
    width: 31,
  },
  chartCanvas: {
    flex: 1,
    minHeight: CHART_HEIGHT,
    position: 'relative',
  },
  chartTick: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 11,
    opacity: 0.71,
    textAlign: 'right',
  },
  chartLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  chartEmpty: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    padding: 19,
  },
  chartEmptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  tooltip: {
    backgroundColor: 'rgba(5, 16, 27, 0.07)',
    borderColor: colors.borderStrong,
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 5,
    position: 'absolute',
    width: 97,
  },
  tooltipLabel: {
    color: colors.textMuted,
    fontSize: 7,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tooltipValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  groups: {
    gap: 9,
  },
  groupPanel: {
    backgroundColor: productPanelSurface,
    borderColor: colors.borderStrong,
    borderRadius: 9,
    borderWidth: 1,
    gap: 7,
    padding: 9,
  },
  groupHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  groupLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  groupPnl: {
    flexShrink: 1,
    fontSize: 9,
    fontWeight: '800',
  },
  groupItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  itemCard: {
    backgroundColor: productTileSurface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexBasis: '31%',
    flexGrow: 1,
    gap: 1,
    minWidth: 73,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  itemSymbol: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
  },
  itemPnl: {
    fontSize: 11,
    fontWeight: '800',
  },
  itemPercent: {
    fontSize: 9,
    fontWeight: '700',
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 7,
    paddingTop: 11,
  },
  footerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  footerText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  });
};
