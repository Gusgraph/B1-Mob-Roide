import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/auth/AuthProvider';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="more/products" options={{ title: 'Products' }} />
        <Stack.Screen name="more/brokers" options={{ title: 'Broker Accounts' }} />
        <Stack.Screen name="more/orders" options={{ title: 'Orders' }} />
        <Stack.Screen name="more/performance" options={{ title: 'Performance' }} />
        <Stack.Screen name="more/billing" options={{ title: 'Billing' }} />
        <Stack.Screen name="more/support" options={{ title: 'Support' }} />
        <Stack.Screen name="more/affiliate" options={{ title: 'Affiliate' }} />
        <Stack.Screen name="more/profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="more/settings" options={{ title: 'Settings' }} />
      </Stack>
    </AuthProvider>
  );
}

