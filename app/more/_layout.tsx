import { Redirect, Stack } from 'expo-router';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { useTheme } from '@/theme/ThemeProvider';

export default function MoreLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return <LoadingState label="Checking secure session" />;
  }

  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/login' as never} />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: 27, fontWeight: '700' },
      }}
    >
      <Stack.Screen name="products" options={{ title: 'Products' }} />
      <Stack.Screen name="brokers" options={{ title: 'Broker Accounts' }} />
      <Stack.Screen name="orders" options={{ title: 'Orders' }} />
      <Stack.Screen name="performance" options={{ title: 'Performance' }} />
      <Stack.Screen name="billing" options={{ title: 'Billing' }} />
      <Stack.Screen name="support" options={{ title: 'Support' }} />
      <Stack.Screen name="affiliate" options={{ title: 'Affiliate' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
