import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'bismel1.accessToken';

export const tokenStore = {
  getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    return SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};

