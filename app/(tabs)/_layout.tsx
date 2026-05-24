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
import { Activity, Bot, ChartCandlestick, CircleUserRound, Gauge } from 'lucide-react-native';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';

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
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Gauge color={color} size={21} /> }}
      />
      <Tabs.Screen
        name="automation"
        options={{ title: 'Automation', tabBarIcon: ({ color }) => <Bot color={color} size={21} /> }}
      />
      <Tabs.Screen
        name="positions"
        options={{ title: 'Positions', tabBarIcon: ({ color }) => <ChartCandlestick color={color} size={21} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: ({ color }) => <Activity color={color} size={21} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: 'More', tabBarIcon: ({ color }) => <CircleUserRound color={color} size={21} /> }}
      />
    </Tabs>
  );
}
