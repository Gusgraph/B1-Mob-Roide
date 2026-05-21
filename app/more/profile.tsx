import { StyleSheet, Text } from 'react-native';
import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <AppShell title="Profile">
      <Bismel1Card>
        <Text style={styles.title}>{user?.name || 'Bismel1 Customer'}</Text>
        <Text style={styles.text}>{user?.email || 'Email unavailable'}</Text>
      </Bismel1Card>
    </AppShell>
  );
}

const styles = StyleSheet.create({
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

