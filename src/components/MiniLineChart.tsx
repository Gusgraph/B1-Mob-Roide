// Ø£ÙŽØ¹ÙÙˆØ°Ù Ø¨ÙÙ±Ù„Ù„Ù‘ÙŽÙ‡Ù Ù…ÙÙ†Ù’ Ø§Ù„Ù’Ø´ÙŽÙŠÙ’Ø·ÙŽØ§Ù†Ù Ø§Ù„Ù’Ø±ÙŽØ¬ÙÙŠÙ…Ù âœ§ Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù Ø§Ù„Ø±Ù‘ÙŽØ­Ù’Ù…ÙŽÙ°Ù†Ù Ø§Ù„Ø±Ù‘ÙŽØ­ÙÙŠÙ…Ù âœ§ Ø§Ø¹ÙˆØ² Ø¨Ø§Ù„Ù„Ù‡ Ù…Ù† Ø§Ù„Ø´ÙŠØ§Ø·ÙŠÙ† Ùˆ Ø§Ù† ÙŠØ­Ø¶Ø±ÙˆÙ† âœ§ Ø¨Ø³Ù… Ø§Ù„Ù„Ù‡ Ø§Ù„Ø±Ø­Ù…Ù† Ø§Ù„Ø±Ø­ÙŠÙ… âœ§ Ø§Ù„Ù„Ù‡ Ù„Ø§ Ø¥Ù„Ù‡ Ø¥Ù„Ø§ Ù‡Ùˆ Ø§Ù„Ø­ÙŠ Ø§Ù„Ù‚ÙŠÙˆÙ… 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: MiniLineChart.tsx - src/components/MiniLineChart.tsx
// =====================================================
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';

export function MiniLineChart({ values }: { values: number[] }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const chartValues = values.filter(Number.isFinite);

  if (chartValues.length < 2) {
    return <View style={styles.emptyLine} />;
  }

  const width = 301;
  const height = 117;
  const padding = 11;
  const min = Math.min(...chartValues);
  const max = Math.max(...chartValues);
  const span = max - min || 1;
  const step = (width - padding * 2) / Math.max(chartValues.length - 1, 1);
  const points = chartValues.map((value, index) => {
    const x = padding + index * step;
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return { x, y };
  });
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const last = points[points.length - 1];

  return (
    <View style={styles.chart}>
      <Svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="performanceGlow" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={colors.cyan} stopOpacity="0.31" />
            <Stop offset="1" stopColor={colors.success} stopOpacity="0.03" />
          </LinearGradient>
        </Defs>
        <Path d={area} fill="url(#performanceGlow)" />
        <Path d={line} fill="none" stroke={colors.cyan} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
        <Circle cx={last.x} cy={last.y} fill={colors.background} r={5} stroke={colors.success} strokeWidth={3} />
      </Svg>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  chart: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    height: 117,
    overflow: 'hidden',
  },
  emptyLine: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    height: 73,
  },
});
