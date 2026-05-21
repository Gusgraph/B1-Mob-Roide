import { StyleSheet, Text } from 'react-native';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { Bismel1Card } from '@/components/Bismel1Card';

export function ErrorState({ message }: { message: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <Bismel1Card>
      <Text style={styles.text}>{message}</Text>
    </Bismel1Card>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  text: {
    color: colors.danger,
    fontSize: typography.body,
    lineHeight: 23,
  },
});
