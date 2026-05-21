// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: more.tsx - app/(tabs)/more.tsx
// =====================================================
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BadgeDollarSign, Bot, Building2, ChartNoAxesCombined, ChevronRight, Headset, LogOut, Package, ReceiptText, Settings, UserRound } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/auth/useAuth';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const menuItems = [
  { label: 'Products', href: '/more/products', icon: Package },
  { label: 'Broker Accounts', href: '/more/brokers', icon: Building2 },
  { label: 'Orders', href: '/more/orders', icon: ReceiptText },
  { label: 'Performance', href: '/more/performance', icon: ChartNoAxesCombined },
  { label: 'Billing', href: '/more/billing', icon: BadgeDollarSign },
  { label: 'Support', href: '/more/support', icon: Headset },
  { label: 'Profile', href: '/more/profile', icon: UserRound },
  { label: 'Settings', href: '/more/settings', icon: Settings },
] as const;

export default function MoreScreen() {
  const { logout, user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const affiliateApproved = Boolean(user?.affiliate_approved || user?.affiliateApproved);
  const visibleItems = affiliateApproved
    ? [...menuItems.slice(0, 6), { label: 'Affiliate', href: '/more/affiliate', icon: Bot }, ...menuItems.slice(6)]
    : menuItems;

  return (
    <AppShell title="More" subtitle="Account, billing, support, and approved program areas.">
      <View style={styles.menu}>
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href as never} asChild>
            <Pressable style={styles.item}>
              <View style={styles.itemLeft}>
                <item.icon color={colors.accent} size={19} />
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={17} />
            </Pressable>
          </Link>
        ))}
        <Pressable style={styles.logout} onPress={logout}>
          <LogOut color={colors.danger} size={19} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  menu: {
    gap: spacing.md,
  },
  item: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  itemLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  itemText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  logout: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
