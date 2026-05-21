import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});

