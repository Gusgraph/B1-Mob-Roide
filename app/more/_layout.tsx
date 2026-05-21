import { Redirect, Stack } from 'expo-router';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/auth/useAuth';
import { colors } from '@/theme/colors';

export default function MoreLayout() {
  const { isAuthenticated, isLoading } = useAuth();

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
      }}
    />
  );
}
