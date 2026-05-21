// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: automation.tsx - app/(tabs)/automation.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bot, RadioTower } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function AutomationScreen() {
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [automation, setAutomation] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.products);
        const products = asArray(asRecord(response).products || response).map(asRecord);
        const firstProduct = products[0];
        setProduct(firstProduct || null);

        const productId = firstProduct?.id || firstProduct?.slug;
        const accountSlot = firstProduct?.account_slot || firstProduct?.accountSlot || firstProduct?.slot || 1;

        if (productId) {
          setAutomation(asRecord(await api.get<unknown>(endpoints.automation(String(productId), String(accountSlot)))));
        }
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const symbols = asArray(automation?.symbols);

  return (
    <AppShell title="Automation" subtitle="Product automation state returned by Laravel.">
      {isLoading ? <LoadingState label="Loading automation" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && !product ? <EmptyState message="No automation product is available." /> : null}
      {product ? (
        <Bismel1Card>
          <Bot color={colors.accent} size={19} />
          <Text style={styles.title}>{firstString(product, ['name', 'title', 'slug'], 'Product')}</Text>
          <StatusBadge label={firstString(asRecord(automation), ['status', 'state'], 'Status unavailable')} />
          <View style={styles.symbolRow}>
            <RadioTower color={colors.purple} size={15} />
            <Text style={styles.text}>Symbols returned: {symbols.length}</Text>
          </View>
        </Bismel1Card>
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
  symbolRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
});
