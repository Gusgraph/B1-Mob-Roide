// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: textScale.ts - src/theme/textScale.ts
// =====================================================
import { StyleSheet } from 'react-native';

const TEXT_SCALE = 0.55;
const MIN_TEXT_SIZE = 5;

type StyleSheetWithPreprocessor = typeof StyleSheet & {
  setStyleAttributePreprocessor?: (property: string, processor: (value: unknown) => unknown) => void;
};

const scaleTextValue = (value: unknown) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return value;
  }

  return Math.max(MIN_TEXT_SIZE, Math.round(value * TEXT_SCALE));
};

const styleSheet = StyleSheet as StyleSheetWithPreprocessor;

styleSheet.setStyleAttributePreprocessor?.('fontSize', scaleTextValue);
styleSheet.setStyleAttributePreprocessor?.('lineHeight', scaleTextValue);
