// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: productAccountStore.ts - src/accounts/productAccountStore.ts
// =====================================================
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PRODUCT_ACCOUNT_ASSIGNMENTS_KEY = 'bismel1.productAccountAssignments';

export type ProductAccountAssignments = Record<string, string>;

const parseAssignments = (value: string | null): ProductAccountAssignments => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as ProductAccountAssignments : {};
  } catch {
    return {};
  }
};

export const productAccountStore = {
  async getAssignments() {
    if (Platform.OS === 'web') {
      return parseAssignments(globalThis.localStorage?.getItem(PRODUCT_ACCOUNT_ASSIGNMENTS_KEY) || null);
    }

    return parseAssignments(await SecureStore.getItemAsync(PRODUCT_ACCOUNT_ASSIGNMENTS_KEY));
  },
  async setAssignments(assignments: ProductAccountAssignments) {
    const value = JSON.stringify(assignments);

    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(PRODUCT_ACCOUNT_ASSIGNMENTS_KEY, value);
      return;
    }

    await SecureStore.setItemAsync(PRODUCT_ACCOUNT_ASSIGNMENTS_KEY, value);
  },
};
