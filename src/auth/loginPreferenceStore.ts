// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: loginPreferenceStore.ts - src/auth/loginPreferenceStore.ts
// =====================================================
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const REMEMBER_EMAIL_KEY = 'bismel1.rememberedEmail';

export const loginPreferenceStore = {
  getRememberedEmail() {
    if (Platform.OS === 'web') {
      return Promise.resolve(globalThis.localStorage?.getItem(REMEMBER_EMAIL_KEY) || null);
    }

    return SecureStore.getItemAsync(REMEMBER_EMAIL_KEY);
  },
  setRememberedEmail(email: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(REMEMBER_EMAIL_KEY, email);
      return Promise.resolve();
    }

    return SecureStore.setItemAsync(REMEMBER_EMAIL_KEY, email);
  },
  clearRememberedEmail() {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(REMEMBER_EMAIL_KEY);
      return Promise.resolve();
    }

    return SecureStore.deleteItemAsync(REMEMBER_EMAIL_KEY);
  },
};
