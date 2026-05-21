import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Activity as ActivityIcon } from 'lucide-react-native';
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
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';
import { formatDateTime } from '@/utils/dates';

type ActivityTab = 'trades' | 'system';

export default function ActivityScreen() {
  const [tab, setTab] = useState<ActivityTab>('trades');
  const [trades, setTrades] = useState<Record<string, unknown>[]>([]);
  const [system, setSystem] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const [tradeResponse, systemResponse] = await Promise.all([
          api.get<unknown>(endpoints.tradeActivity),
          api.get<unknown>(endpoints.systemActivity),
        ]);
        setTrades(asArray(asRecord(tradeResponse).trades || tradeResponse).map(asRecord));
        setSystem(asArray(asRecord(systemResponse).activity || systemResponse).map(asRecord));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const rows = tab === 'trades' ? trades : system;

  return (
    <AppShell title="Activity" subtitle="Trade and system activity from the mobile API.">
      <View style={styles.segment}>
        <Pressable onPress={() => setTab('trades')} style={[styles.segmentButton, tab === 'trades' && styles.active]}>
          <Text style={styles.segmentText}>Trade Activity</Text>
        </Pressable>
        <Pressable onPress={() => setTab('system')} style={[styles.segmentButton, tab === 'system' && styles.active]}>
          <Text style={styles.segmentText}>System Activity</Text>
        </Pressable>
      </View>
      {isLoading ? <LoadingState label="Loading activity" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && rows.length === 0 ? <EmptyState message="No activity returned." /> : null}
      {rows.map((item, index) => (
        <Bismel1Card key={String(item.id || index)}>
          <ActivityIcon color={tab === 'trades' ? colors.cyan : colors.purple} size={19} />
          <Text style={styles.title}>{firstString(item, ['symbol', 'title', 'type', 'event'], 'Activity')}</Text>
          <Text style={styles.text}>{firstString(item, ['message', 'description', 'status'], '')}</Text>
          <Text style={styles.time}>{formatDateTime(item.created_at || item.timestamp || item.time)}</Text>
        </Bismel1Card>
      ))}
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  segment: {
    backgroundColor: colors.surface,
    borderRadius: 9,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 7,
    flex: 1,
    padding: spacing.md,
  },
  active: {
    backgroundColor: colors.accentMuted,
  },
  segmentText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
});
