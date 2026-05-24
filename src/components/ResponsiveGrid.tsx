// Ø£ÙŽØ¹ÙÙˆØ°Ù Ø¨ÙÙ±Ù„Ù„Ù‘ÙŽÙ‡Ù Ù…ÙÙ†Ù’ Ø§Ù„Ù’Ø´ÙŽÙŠÙ’Ø·ÙŽØ§Ù†Ù Ø§Ù„Ù’Ø±ÙŽØ¬ÙÙŠÙ…Ù âœ§ Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù Ø§Ù„Ø±Ù‘ÙŽØ­Ù’Ù…ÙŽÙ°Ù†Ù Ø§Ù„Ø±Ù‘ÙŽØ­ÙÙŠÙ…Ù âœ§ Ø§Ø¹ÙˆØ² Ø¨Ø§Ù„Ù„Ù‡ Ù…Ù† Ø§Ù„Ø´ÙŠØ§Ø·ÙŠÙ† Ùˆ Ø§Ù† ÙŠØ­Ø¶Ø±ÙˆÙ† âœ§ Ø¨Ø³Ù… Ø§Ù„Ù„Ù‡ Ø§Ù„Ø±Ø­Ù…Ù† Ø§Ù„Ø±Ø­ÙŠÙ… âœ§ Ø§Ù„Ù„Ù‡ Ù„Ø§ Ø¥Ù„Ù‡ Ø¥Ù„Ø§ Ù‡Ùˆ Ø§Ù„Ø­ÙŠ Ø§Ù„Ù‚ÙŠÙˆÙ…
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: ResponsiveGrid.tsx - src/components/ResponsiveGrid.tsx
// =====================================================
import { PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';

type ResponsiveGridProps = PropsWithChildren<{
  gap?: number;
  maxColumns?: 2 | 3;
  minItemWidth?: number;
  style?: ViewStyle;
}>;

export function ResponsiveGrid({ children, gap = 17, maxColumns = 2, minItemWidth = 337, style }: ResponsiveGridProps) {
  const { height, width } = useWindowDimensions();
  const shortest = Math.min(width, height);
  const landscape = width > height;
  const columns = width >= 1181 && maxColumns === 3 ? 3 : shortest >= 600 || (landscape && width >= 761) ? 2 : 1;
  const itemWidth = columns === 3 ? '31%' : columns === 2 ? '48%' : '100%';
  const styles = makeStyles(gap, itemWidth, columns === 1 ? undefined : minItemWidth);

  return (
    <View style={[styles.grid, style]}>
      {Array.isArray(children)
        ? children.map((child, index) => child ? <View key={index} style={styles.item}>{child}</View> : null)
        : <View style={styles.item}>{children}</View>}
    </View>
  );
}

const makeStyles = (gap: number, width: ViewStyle['width'], minWidth?: number) => StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap,
    width: '100%',
  },
  item: {
    flexGrow: 1,
    minWidth,
    width,
  },
});
