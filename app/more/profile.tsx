import { StyleSheet, Text } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <AppShell title="Profile">
      <Bismel1Card>
        <UserRound color={colors.accent} size={19} />
        <Text style={styles.title}>{user?.name || 'Bismel1 Customer'}</Text>
        <Text style={styles.text}>{user?.email || 'Email unavailable'}</Text>
      </Bismel1Card>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});
