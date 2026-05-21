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
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondary]} onPress={onCancel} disabled={isLoading}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.danger]} onPress={onConfirm} disabled={isLoading}>
              <Text style={styles.primaryText}>{isLoading ? 'Working' : confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    padding: spacing.md,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
  primaryText: {
    color: colors.white,
    fontWeight: '700',
  },
});
