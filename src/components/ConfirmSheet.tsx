import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    borderRadius: 8,
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

