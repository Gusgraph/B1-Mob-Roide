import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { Bismel1Card } from '@/components/Bismel1Card';

export function EmptyState({ message }: { message: string }) {
  return (
    <Bismel1Card>
      <Text style={styles.text}>{message}</Text>
    </Bismel1Card>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
});

