import { AppShell } from '@/components/AppShell';
import { EmptyState } from '@/components/EmptyState';

export default function SettingsScreen() {
  return (
    <AppShell title="Settings">
      <EmptyState message="No editable settings returned by the mobile API." />
    </AppShell>
  );
}

