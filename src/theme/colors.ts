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
    background: '#02060B',
    backgroundAlt: '#05101B',
    surface: 'rgba(7, 19, 31, 0.19)',
    surfaceElevated: 'rgba(11, 27, 43, 0.19)',
    surfaceMuted: 'rgba(16, 36, 58, 0.19)',
    border: '#17344F',
    borderStrong: '#00D9FF',
    text: '#D9E6F2',
    textMuted: '#8FA3B8',
    textSoft: '#BFD0E2',
    accent: '#00D9FF',
    accentAlt: '#007BFF',
    accentMuted: '#062D43',
    cyan: '#00F2FF',
    purple: '#008BFF',
    magenta: '#1FE7A4',
    success: '#26F29F',
    successMuted: '#073D2D',
    warning: '#FFCF47',
    warningMuted: '#3B2D0B',
    danger: '#FF4D43',
    dangerMuted: '#431A17',
    white: '#FFFFFF',
    black: '#010407',
    glow: 'rgba(0, 217, 255, 0.23)',
    grid: 'rgba(0, 123, 255, 0.09)',
  },
  light: {
    background: '#EAF7FF',
    backgroundAlt: '#F7FCFF',
    surface: 'rgba(255, 255, 255, 0.19)',
    surfaceElevated: 'rgba(237, 248, 255, 0.19)',
    surfaceMuted: 'rgba(223, 240, 250, 0.19)',
    border: '#A8CDE3',
    borderStrong: '#008DDF',
    text: '#071B33',
    textMuted: '#38516B',
    textSoft: '#102D4F',
    accent: '#008DDF',
    accentAlt: '#006CE8',
    accentMuted: '#D7F3FF',
    cyan: '#00BFE6',
    purple: '#006CE8',
    magenta: '#00B989',
    success: '#009B6F',
    successMuted: '#D9F8ED',
    warning: '#B67D00',
    warningMuted: '#FFF2C7',
    danger: '#D63532',
    dangerMuted: '#FFE2E0',
    white: '#FFFFFF',
    black: '#010407',
    glow: 'rgba(0, 141, 223, 0.17)',
    grid: 'rgba(0, 108, 232, 0.09)',
  },
};

export const colors = themes.dark;
