// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: products.tsx - app/more/products.tsx
// =====================================================
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Package } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { DataRow } from '@/components/DataRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { asArray, asRecord, firstString } from '@/utils/records';

export default function ProductsScreen() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<unknown>(endpoints.products);
        setItems(asArray(asRecord(response).products || response).map(asRecord));
      } catch (loadError) {
        setError(customerSafeMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppShell title="Products" showAccountNav>
      {isLoading ? <LoadingState label="Loading products" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? <EmptyState message="No products returned." /> : null}
      <ResponsiveGrid maxColumns={3}>
        {items.map((item, index) => (
          <Bismel1Card key={String(item.id || item.slug || index)}>
            <Package color={colors.accent} size={19} />
            <Text style={styles.title}>{firstString(item, ['product_name', 'name', 'title', 'slug'], 'Product')}</Text>
            <StatusBadge label={firstString(item, ['status_label', 'status', 'state'], 'Status unavailable')} status={firstString(item, ['status'], '') === 'active' ? 'success' : 'neutral'} />
            <DataRow label="Automation" value={item.automation_allowed === true ? 'Allowed' : 'Unavailable'} tone={item.automation_allowed === true ? 'success' : 'warning'} />
            <DataRow label="Trading Account" value={firstString(item, ['trading_account_requirement_label'], 'Trading account required')} />
            <DataRow label="Accounts" value={firstString(item, ['accounts_count'], '0')} />
          </Bismel1Card>
        ))}
      </ResponsiveGrid>
    </AppShell>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
  },
});
