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
    const nextUser = await api.get<MobileUser>(endpoints.auth.me);
    setUser(nextUser);
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
      setUser(response.user || (await api.get<MobileUser>(endpoints.auth.me)));
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
          const nextUser = await api.get<MobileUser>(endpoints.auth.me);
          if (mounted) {
            setUser(nextUser);
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
