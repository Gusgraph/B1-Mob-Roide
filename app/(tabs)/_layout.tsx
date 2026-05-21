import { Redirect, Tabs } from 'expo-router';
import { Activity, Bot, ChartCandlestick, CircleUserRound, LayoutDashboard } from 'lucide-react-native';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

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
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 77,
          paddingBottom: 11,
          paddingTop: 7,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="automation"
        options={{ title: 'Automation', tabBarIcon: ({ color, size }) => <Bot color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="positions"
        options={{ title: 'Positions', tabBarIcon: ({ color, size }) => <ChartCandlestick color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: ({ color, size }) => <Activity color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: 'More', tabBarIcon: ({ color, size }) => <CircleUserRound color={color} size={size} /> }}
      />
    </Tabs>
  );
}
