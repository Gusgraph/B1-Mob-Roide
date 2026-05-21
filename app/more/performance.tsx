import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ChartNoAxesCombined } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { MetricCard } from '@/components/MetricCard';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asRecord, firstString } from '@/utils/records';

export default function PerformanceScreen() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [curve, setCurve] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, curveResponse] = await Promise.all([
          api.get<unknown>(endpoints.performanceSummary),
          api.get<unknown>(endpoints.performanceCurve),
        ]);
        setSummary(asRecord(summaryResponse));
        setCurve(asRecord(curveResponse));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Performance">
      {isLoading ? <LoadingState label="Loading performance" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {summary ? (
        <>
          <MetricCard label="Return" value={firstString(summary, ['return', 'total_return', 'pnl'])} />
          <Bismel1Card>
            <ChartNoAxesCombined color={colors.purple} size={19} />
            <Text style={styles.title}>Curve Data</Text>
            <Text style={styles.text}>{firstString(asRecord(curve), ['points_count', 'count'], 'Loaded from API')}</Text>
          </Bismel1Card>
        </>
      ) : null}
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
