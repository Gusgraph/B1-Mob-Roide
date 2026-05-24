// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: tokenStore.ts - src/auth/tokenStore.ts
// =====================================================
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'bismel1.accessToken';

export const tokenStore = {
  getAccessToken() {
    if (Platform.OS === 'web') {
      return Promise.resolve(globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) || null);
    }

    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
      return Promise.resolve();
    }

    return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(ACCESS_TOKEN_KEY);
      return Promise.resolve();
    }

    return SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};

