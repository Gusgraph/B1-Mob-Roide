import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Headset } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function SupportScreen() {
  const [tickets, setTickets] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.supportTickets);
        setTickets(asArray(asRecord(response).tickets || response).map(asRecord));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Support">
      {isLoading ? <LoadingState label="Loading tickets" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && tickets.length === 0 ? <EmptyState message="No support tickets returned." /> : null}
      {tickets.map((ticket, index) => (
        <Bismel1Card key={String(ticket.id || index)}>
          <Headset color={colors.accent} size={19} />
          <Text style={styles.title}>{firstString(ticket, ['subject', 'title', 'id'], 'Ticket')}</Text>
          <Text style={styles.text}>{firstString(ticket, ['status', 'updated_at'], '')}</Text>
        </Bismel1Card>
      ))}
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});
