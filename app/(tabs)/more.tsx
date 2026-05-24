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
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { BadgeDollarSign, Bot, ChevronRight, CircleHelp, LogOut, Settings, UserRound } from 'lucide-react-native';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/auth/useAuth';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const menuItems = [
  { label: 'Billing', href: '/more/billing', icon: BadgeDollarSign },
  { label: 'Help', href: 'https://bismel1.com/customer/help', icon: CircleHelp, external: true },
  { label: 'Profile', href: '/more/profile', icon: UserRound },
  { label: 'Settings', href: '/more/settings', icon: Settings },
] as const;

export default function MoreScreen() {
  const { logout, user } = useAuth();
  const { colors, isDark, setThemeMode } = useTheme();
  const styles = makeStyles(colors);
  const affiliateApproved = Boolean(user?.affiliate_approved || user?.affiliateApproved);
  const visibleItems = affiliateApproved
    ? [...menuItems.slice(0, 6), { label: 'Affiliate', href: '/more/affiliate', icon: Bot }, ...menuItems.slice(6)]
    : menuItems;

  return (
    <AppShell title="More" showAccountNav>
      <View style={styles.menu}>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: !isDark }}
          onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
          style={styles.themeToggle}
        >
          <Text style={styles.itemText}>Light Mode</Text>
          <View style={[styles.switchTrack, !isDark && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, !isDark && styles.switchThumbActive]} />
          </View>
        </Pressable>
        {visibleItems.map((item) => {
          const external = 'external' in item && item.external === true;
          const row = (
            <Pressable
              onPress={() => external ? Linking.openURL(item.href) : undefined}
              style={styles.item}
            >
              <View style={styles.itemLeft}>
                <item.icon color={colors.accent} size={19} />
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={17} />
            </Pressable>
          );

          return external ? (
            <View key={item.href}>{row}</View>
          ) : (
            <Link key={item.href} href={item.href as never} asChild>
              {row}
            </Link>
          );
        })}
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
  themeToggle: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingLeft: 11,
    shadowColor: colors.cyan,
    shadowOpacity: 0.17,
    shadowRadius: 11,
  },
  switchTrack: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    height: 29,
    paddingHorizontal: 3,
    width: 57,
  },
  switchTrackActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.29,
    shadowRadius: 11,
  },
  switchThumb: {
    backgroundColor: colors.textMuted,
    borderRadius: 999,
    height: 21,
    width: 21,
  },
  switchThumbActive: {
    backgroundColor: colors.success,
    transform: [{ translateX: 27 }],
  },
  itemLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  itemText: {
    color: colors.text,
    fontSize: 15,
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
