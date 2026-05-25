// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: ConfirmSheet.tsx - src/components/ConfirmSheet.tsx
// =====================================================
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  isLoading,
  onCancel,
  onConfirm,
}: ConfirmSheetProps) {
  const { colors, isDark } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, isDark, width, height);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel="Cancel warning"
          accessibilityRole="button"
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.dialog}>
          <View style={styles.edge} />
          <View style={styles.copy}>
            <Text maxFontSizeMultiplier={1.08} style={styles.title}>{title}</Text>
            <Text maxFontSizeMultiplier={1.08} style={styles.message}>{message}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondary]} onPress={onCancel} disabled={isLoading}>
              <Text maxFontSizeMultiplier={1.08} numberOfLines={1} style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.danger, isLoading && styles.disabledButton]} onPress={onConfirm} disabled={isLoading}>
              <Text maxFontSizeMultiplier={1.08} numberOfLines={2} style={styles.primaryText}>{isLoading ? 'Working' : confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: ThemeColors, isDark: boolean, width: number, height: number) => {
  const shortestSide = Math.min(width, height);
  const isCompact = shortestSide < 390;
  const dialogWidth = Math.min(width - (isCompact ? 30 : 42), 481);
  const dialogBackground = isDark ? '#07131F' : '#F7FCFF';

  return StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.61)',
    justifyContent: 'center',
    paddingHorizontal: isCompact ? 15 : spacing.xl,
    paddingVertical: Math.max(23, Math.round(height * 0.05)),
  },
  dialog: {
    backgroundColor: dialogBackground,
    borderColor: colors.warning,
    borderRadius: 11,
    borderWidth: 1,
    gap: spacing.md,
    maxHeight: Math.max(320, height * 0.82),
    overflow: 'hidden',
    padding: isCompact ? spacing.lg : spacing.xl,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.31,
    shadowRadius: 23,
    width: dialogWidth,
  },
  edge: {
    backgroundColor: colors.warning,
    borderRadius: 999,
    height: 3,
    opacity: 0.91,
    width: 57,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: isCompact ? 19 : typography.h3,
    fontWeight: '800',
  },
  message: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minWidth: 129,
    minHeight: 51,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  danger: {
    backgroundColor: colors.dangerMuted,
    borderColor: colors.danger,
  },
  disabledButton: {
    opacity: 0.61,
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  primaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  });
};
