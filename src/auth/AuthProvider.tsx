// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: AuthProvider.tsx - src/auth/AuthProvider.tsx
// =====================================================
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { api, registerUnauthorizedHandler } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { LoginResponse, MobileUser } from '@/api/types';
import { tokenStore } from '@/auth/tokenStore';
import { customerSafeMessage } from '@/api/errors';

type AuthContextValue = {
  user: MobileUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const extractToken = (response: LoginResponse) =>
  response.token || response.access_token || response.bearer_token;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? value as Record<string, unknown> : {};

const normalizeUser = (value: unknown): MobileUser => {
  const record = asRecord(value);
  const nestedUser = asRecord(record.user);
  const userRecord = Object.keys(nestedUser).length ? nestedUser : record;

  return {
    ...(userRecord as MobileUser),
    affiliate_approved: Boolean(record.affiliate_approved || userRecord.affiliate_approved),
    affiliateApproved: Boolean(record.affiliateApproved || userRecord.affiliateApproved),
  };
};

const localSessionUser = (): MobileUser => ({
  id: 'local-session',
  name: 'Bismel1',
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearSession = useCallback(async () => {
    await tokenStore.clear();
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(endpoints.auth.logout, undefined);
    } catch {
      // Customer logout must still clear local auth if the remote session is already invalid.
    } finally {
      await clearSession();
      router.replace('/');
    }
  }, [clearSession]);

  const reloadMe = useCallback(async () => {
    const nextUser = await api.get<unknown>(endpoints.auth.me);
    setUser(normalizeUser(nextUser));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);

    try {
      const response = await api.post<LoginResponse>(
        endpoints.auth.login,
        { email, password },
        false,
      );
      const token = extractToken(response);

      if (!token) {
        throw new Error('Login did not return an access token.');
      }

      await tokenStore.setAccessToken(token);
      setUser(normalizeUser(response.user || (await api.get<unknown>(endpoints.auth.me))));
      router.replace('/(tabs)/dashboard' as never);
    } catch (error) {
      const message = customerSafeMessage(error);
      setAuthError(message);
      throw error;
    }
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await clearSession();
      router.replace('/(auth)/login' as never);
    });
  }, [clearSession]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const token = await tokenStore.getAccessToken();
        if (token) {
          if (mounted) {
            setUser(localSessionUser());
            setIsLoading(false);
          }

          try {
            const nextUser = await api.get<unknown>(endpoints.auth.me);
            if (mounted) {
              setUser(normalizeUser(nextUser));
            }
          } catch {
            if (mounted) {
              await tokenStore.clear();
              setUser(null);
              router.replace('/(auth)/login' as never);
            }
          }
        }
      } catch {
        await tokenStore.clear();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      login,
      logout,
      reloadMe,
    }),
    [authError, isLoading, login, logout, reloadMe, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
