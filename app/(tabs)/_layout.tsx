import { Redirect, Tabs } from 'expo-router';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState label="Checking secure session" />;
  }

  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/login' as never} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="automation" options={{ title: 'Automation' }} />
      <Tabs.Screen name="positions" options={{ title: 'Positions' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
