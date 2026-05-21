// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: colors.ts - src/theme/colors.ts
// =====================================================
export type ThemeMode = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  accentAlt: string;
  accentMuted: string;
  cyan: string;
  purple: string;
  magenta: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  white: string;
  black: string;
  glow: string;
  grid: string;
};

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: '#04070D',
    backgroundAlt: '#07111D',
    surface: '#0B1420',
    surfaceElevated: '#101D2D',
    surfaceMuted: '#152436',
    border: '#22334A',
    borderStrong: '#2FCEFF',
    text: '#F6FAFF',
    textMuted: '#9FB0C5',
    textSoft: '#C7D3E2',
    accent: '#2FCEFF',
    accentAlt: '#A855F7',
    accentMuted: '#0E3148',
    cyan: '#24F2FF',
    purple: '#8B5CF6',
    magenta: '#FF3DF2',
    success: '#19E6A6',
    successMuted: '#0B3D35',
    warning: '#FFCB45',
    warningMuted: '#3F3213',
    danger: '#FF5C7A',
    dangerMuted: '#44202C',
    white: '#FFFFFF',
    black: '#02040A',
    glow: 'rgba(47, 206, 255, 0.22)',
    grid: 'rgba(47, 206, 255, 0.08)',
  },
  light: {
    background: '#EEF7FF',
    backgroundAlt: '#F8FCFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F2F8FF',
    surfaceMuted: '#E4F0FC',
    border: '#BCD2E8',
    borderStrong: '#0087D7',
    text: '#08111F',
    textMuted: '#50647A',
    textSoft: '#223247',
    accent: '#0078D8',
    accentAlt: '#7C3AED',
    accentMuted: '#D8F0FF',
    cyan: '#00A9D6',
    purple: '#7C3AED',
    magenta: '#D11BCE',
    success: '#058A6C',
    successMuted: '#D8F9EF',
    warning: '#B77900',
    warningMuted: '#FFF3C4',
    danger: '#C72E4A',
    dangerMuted: '#FFE0E7',
    white: '#FFFFFF',
    black: '#02040A',
    glow: 'rgba(0, 120, 216, 0.16)',
    grid: 'rgba(0, 120, 216, 0.09)',
  },
};

export const colors = themes.dark;
