// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: _layout.tsx - app/(tabs)/_layout.tsx
// =====================================================
import { Redirect, Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Activity, Bot, ChartCandlestick, CircleUserRound, Gauge } from 'lucide-react-native';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const isLargeScreen = Math.min(width, height) >= 600 || width >= 761;
  const iconSize = isLargeScreen ? 25 : 21;
  const tabBarBackground = colors.background === '#02060B' ? 'rgba(2, 6, 11, 0.91)' : 'rgba(234, 247, 255, 0.91)';

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
        tabBarItemStyle: {
          transform: [{ translateY: isLargeScreen ? -3 : -7 }],
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 3,
        },
        tabBarShowLabel: isLargeScreen,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: isLargeScreen ? 83 : 73,
          paddingBottom: isLargeScreen ? 13 : 17,
          paddingTop: isLargeScreen ? 9 : 5,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Gauge color={color} size={iconSize} /> }}
      />
      <Tabs.Screen
        name="automation"
        options={{ title: 'Automation', tabBarIcon: ({ color }) => <Bot color={color} size={iconSize} /> }}
      />
      <Tabs.Screen
        name="positions"
        options={{ title: 'Positions', tabBarIcon: ({ color }) => <ChartCandlestick color={color} size={iconSize} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: ({ color }) => <Activity color={color} size={iconSize} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: 'More', tabBarIcon: ({ color }) => <CircleUserRound color={color} size={iconSize} /> }}
      />
    </Tabs>
  );
}
