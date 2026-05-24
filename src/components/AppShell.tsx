// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: AppShell.tsx - src/components/AppShell.tsx
// =====================================================
import { PropsWithChildren, ReactNode, RefObject, useState } from 'react';
import { Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountSideNav } from '@/components/AccountSideNav';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type AppShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  headerAccessory?: ReactNode;
  showAccountNav?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollRef?: RefObject<ScrollView | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  floatingAction?: ReactNode;
}>;

export function AppShell({ title, subtitle, scroll = true, headerAccessory, showAccountNav = false, refreshing = false, onRefresh, scrollRef, onScroll, floatingAction, children }: AppShellProps) {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const isWide = width >= 761;
  const [accountNavOpen, setAccountNavOpen] = useState(false);
  const styles = makeStyles(colors, getResponsiveShell(width, height));

  const content = (
    <View style={styles.content}>
      {showAccountNav ? (
        <Pressable
          accessibilityLabel="Open account navigation"
          accessibilityRole="button"
          onPress={() => setAccountNavOpen(true)}
          style={styles.menuButton}
        >
          <Menu color={colors.text} size={19} />
        </Pressable>
      ) : null}
      {headerAccessory ? <View style={styles.topRightActions}>{headerAccessory}</View> : null}
      {title ? (
        <View style={[styles.header, showAccountNav && styles.headerWithMenu]}>
          <View style={styles.titleRow}>
            <LinearGradient
              colors={[colors.cyan, colors.success]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signalBar}
            />
            <Text style={styles.title}>{title}</Text>
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
      {showAccountNav ? (
        <Modal animationType="fade" transparent visible={accountNavOpen} onRequestClose={() => setAccountNavOpen(false)}>
          <View style={styles.drawerBackdrop}>
            <Pressable
              accessibilityLabel="Close account navigation"
              accessibilityRole="button"
              onPress={() => setAccountNavOpen(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.drawer, isWide && styles.drawerWide]}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Accounts</Text>
                <Pressable
                  accessibilityLabel="Close account navigation"
                  accessibilityRole="button"
                  onPress={() => setAccountNavOpen(false)}
                  style={styles.drawerClose}
                >
                  <X color={colors.text} size={19} />
                </Pressable>
              </View>
              <AccountSideNav compact={!isWide} />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.marketPattern}>
        {marketCandles.map((candle, index) => (
          <View
            key={`${candle.left}-${candle.top}`}
            style={[
              styles.candle,
              {
                height: candle.wick,
                left: candle.left,
                top: candle.top,
              },
            ]}
          >
            <View
              style={[
                styles.candleBody,
                index % 2 === 0 ? styles.candleBodyCyan : styles.candleBodyGreen,
                {
                  height: candle.body,
                  marginTop: candle.bodyTop,
                },
              ]}
            />
          </View>
        ))}
      </View>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          onScroll={onScroll}
          ref={scrollRef}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} /> : undefined}
          scrollEventThrottle={17}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {floatingAction ? <View style={styles.floatingAction}>{floatingAction}</View> : null}
    </SafeAreaView>
  );
}

const marketCandles = [
  { left: '7%', top: 131, wick: 77, body: 31, bodyTop: 23 },
  { left: '19%', top: 97, wick: 111, body: 43, bodyTop: 37 },
  { left: '31%', top: 147, wick: 87, body: 27, bodyTop: 29 },
  { left: '43%', top: 83, wick: 127, body: 57, bodyTop: 35 },
  { left: '55%', top: 119, wick: 97, body: 39, bodyTop: 31 },
  { left: '67%', top: 73, wick: 137, body: 51, bodyTop: 47 },
  { left: '79%', top: 137, wick: 83, body: 35, bodyTop: 21 },
  { left: '91%', top: 101, wick: 117, body: 45, bodyTop: 39 },
] as const;

const getResponsiveShell = (width: number, height: number) => {
  const shortestSide = Math.min(width, height);
  const isTvCanvas = width >= 1181 && width / Math.max(height, 1) >= 1.5;

  if (isTvCanvas) {
    return {
      contentMaxWidth: 1181,
      horizontalPadding: 43,
      verticalPadding: 31,
      patternTop: 89,
      patternHeight: 319,
    };
  }

  if (shortestSide >= 600 || width >= 761) {
    return {
      contentMaxWidth: 881,
      horizontalPadding: 31,
      verticalPadding: 31,
      patternTop: 79,
      patternHeight: 281,
    };
  }

  return {
    contentMaxWidth: undefined,
    horizontalPadding: width <= 360 ? 17 : spacing.xl,
    verticalPadding: spacing.xl,
    patternTop: 73,
    patternHeight: 251,
  };
};

const makeStyles = (colors: ThemeColors, layout: ReturnType<typeof getResponsiveShell>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: spacing.lg,
    maxWidth: layout.contentMaxWidth,
    paddingHorizontal: layout.horizontalPadding,
    paddingVertical: layout.verticalPadding,
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    height: 39,
    justifyContent: 'center',
    left: 17,
    position: 'absolute',
    top: 17,
    width: 39,
    zIndex: 3,
  },
  topRightActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    position: 'absolute',
    right: 17,
    top: 17,
    zIndex: 4,
  },
  marketPattern: {
    height: layout.patternHeight,
    left: 0,
    opacity: 0.17,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: layout.patternTop,
    zIndex: 0,
  },
  candle: {
    alignItems: 'center',
    backgroundColor: colors.grid,
    borderRadius: 999,
    position: 'absolute',
    width: 3,
  },
  candleBody: {
    borderRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.37,
    shadowRadius: 11,
    width: 15,
  },
  candleBodyCyan: {
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
  },
  candleBodyGreen: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  header: {
    gap: 9,
  },
  headerWithMenu: {
    paddingTop: 37,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
  },
  signalBar: {
    borderRadius: 999,
    height: 3,
    width: 57,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  floatingAction: {
    bottom: 91,
    position: 'absolute',
    right: 17,
    zIndex: 7,
  },
  drawerBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.57)',
    flex: 1,
  },
  drawer: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRightWidth: 1,
    flex: 1,
    maxWidth: 337,
    paddingBottom: 27,
    paddingHorizontal: 15,
    paddingTop: 57,
  },
  drawerWide: {
    maxWidth: 381,
  },
  drawerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  drawerTitle: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  drawerClose: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    height: 39,
    justifyContent: 'center',
    width: 39,
  },
});
