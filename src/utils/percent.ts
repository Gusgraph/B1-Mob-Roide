// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: percent.ts - src/utils/percent.ts
// =====================================================
export const formatPercent = (value: unknown) => {
  const amount = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(amount)) {
    return 'Unavailable';
  }

  return `${amount.toFixed(2)}%`;
};

export const formatSignedPercent = (value: unknown) => {
  const amount = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(amount)) {
    return 'Unavailable';
  }

  const prefix = amount > 0 ? '+' : '';

  return `${prefix}${amount.toFixed(2)}%`;
};

export const formatRatioPercent = (value: unknown) => {
  const amount = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(amount)) {
    return 'Unavailable';
  }

  return formatSignedPercent(amount * 100);
};

