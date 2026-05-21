import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/auth/useAuth';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const menuItems = [
  { label: 'Products', href: '/more/products' },
  { label: 'Broker Accounts', href: '/more/brokers' },
  { label: 'Orders', href: '/more/orders' },
  { label: 'Performance', href: '/more/performance' },
  { label: 'Billing', href: '/more/billing' },
  { label: 'Support', href: '/more/support' },
  { label: 'Profile', href: '/more/profile' },
  { label: 'Settings', href: '/more/settings' },
] as const;

export default function MoreScreen() {
  const { logout, user } = useAuth();
  const affiliateApproved = Boolean(user?.affiliate_approved || user?.affiliateApproved);
  const visibleItems = affiliateApproved
    ? [...menuItems.slice(0, 6), { label: 'Affiliate', href: '/more/affiliate' }, ...menuItems.slice(6)]
    : menuItems;

  return (
    <AppShell title="More" subtitle="Account, billing, support, and approved program areas.">
      <View style={styles.menu}>
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href as never} asChild>
            <Pressable style={styles.item}>
              <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
          </Link>
        ))}
        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  menu: {
    gap: spacing.md,
  },
  item: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.lg,
  },
  itemText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  logout: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
