// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: AccountSideNav.tsx - src/components/AccountSideNav.tsx
// =====================================================
import { usePathname, useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Activity,
  Bot,
  Building2,
  ChartCandlestick,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  ListOrdered,
} from 'lucide-react-native';
import { useAccounts } from '@/accounts/useAccounts';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const productLinks = [
  { label: 'Prime', href: '/engine/prime' },
  { label: 'Execute', href: '/engine/execute' },
] as const;

const accountLinks = [
  { label: 'Positions', href: '/(tabs)/positions', icon: ChartCandlestick },
  { label: 'Orders', href: '/more/orders', icon: ListOrdered },
  { label: 'Activity', href: '/(tabs)/activity', icon: Activity },
  { label: 'Performance', href: '/more/performance', icon: ChartNoAxesCombined },
  { label: 'Help', href: 'https://bismel1.com/customer/help', icon: CircleHelp, external: true },
] as const;

type AccountSideNavProps = {
  compact?: boolean;
};

export function AccountSideNav({ compact = false }: AccountSideNavProps) {
  const { accounts, accountsError, isLoadingAccounts } = useAccounts();
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = makeStyles(colors, compact);

  return (
    <View style={styles.nav}>
      <Pressable onPress={() => router.push('/more/brokers' as never)} style={styles.manageButton}>
        <Building2 color={colors.black} size={17} />
        <Text style={styles.manageText}>Manage Accounts</Text>
      </Pressable>

      {accounts.length ? (
        <View style={styles.accountsInfo}>
          <Text style={styles.sectionLabel}>Connected Accounts</Text>
          <Text style={styles.emptyText}>{accounts.length} available for product assignment.</Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>{isLoadingAccounts ? 'Loading accounts' : accountsError || 'No broker accounts connected.'}</Text>
      )}

      <View style={styles.menu}>
        <View style={styles.engineBlock}>
          <View style={styles.menuHeader}>
            <Bot color={colors.cyan} size={17} />
            <Text style={styles.menuHeaderText}>Trading Engine</Text>
          </View>
          <View style={styles.productGrid}>
            {productLinks.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.href as never)}
                style={[styles.productButton, pathname === item.href && styles.activeMenuItem]}
              >
                <Text style={styles.productText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {accountLinks.map((item) => {
          const external = 'external' in item && item.external === true;
          const active = pathname === item.href.replace('/(tabs)', '');
          return (
            <Pressable
              key={item.label}
              onPress={() => external ? Linking.openURL(item.href) : router.push(item.href as never)}
              style={[styles.menuItem, active && styles.activeMenuItem]}
            >
              <View style={styles.menuLeft}>
                <item.icon color={active ? colors.cyan : colors.textMuted} size={17} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={15} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors, compact: boolean) => StyleSheet.create({
  nav: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    gap: 11,
    padding: 11,
    width: compact ? undefined : 219,
  },
  manageButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.cyan,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    paddingHorizontal: 11,
    paddingVertical: 13,
  },
  manageText: {
    color: colors.black,
    fontSize: typography.small,
    fontWeight: '900',
  },
  accountsInfo: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    gap: 7,
    padding: 9,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
  menu: {
    gap: 7,
  },
  engineBlock: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    gap: 9,
    padding: 9,
  },
  menuHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  menuHeaderText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  productGrid: {
    flexDirection: 'row',
    gap: 7,
  },
  productButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 9,
  },
  productText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 9,
    paddingVertical: 11,
  },
  activeMenuItem: {
    borderColor: colors.cyan,
    backgroundColor: colors.accentMuted,
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  menuText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
});
