// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: AccountProvider.tsx - src/accounts/AccountProvider.tsx
// =====================================================
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { customerSafeMessage } from '@/api/errors';
import { useAuth } from '@/auth/useAuth';
import { productAccountStore, ProductAccountAssignments } from '@/accounts/productAccountStore';
import { asArray, asRecord, firstString } from '@/utils/records';

export type ManagedAccount = {
  id: string;
  label: string;
  broker: string;
  status: string;
  pathValue?: string;
  raw: Record<string, unknown>;
};

type AccountContextValue = {
  accounts: ManagedAccount[];
  selectedAccount: ManagedAccount | null;
  selectedAccountId: string | null;
  productAccountAssignments: ProductAccountAssignments;
  isLoadingAccounts: boolean;
  accountsError: string | null;
  selectAccount: (accountId: string) => void;
  assignProductAccount: (productKey: string, accountId: string) => Promise<void>;
  getProductAccount: (productKey: string) => ManagedAccount | null;
  refreshAccounts: () => Promise<void>;
};

export const AccountContext = createContext<AccountContextValue | undefined>(undefined);

const accountIdentity = (account: Record<string, unknown>, index: number) =>
  firstString(
    account,
    ['broker_account_ref', 'account_ref', 'uuid', 'id', 'broker_account_id'],
    `account-${index + 1}`,
  );

const accountPathValue = (account: Record<string, unknown>, index: number) =>
  firstString(
    account,
    ['account_slot', 'slot_number', 'slot', 'accountSlot', 'automation_account_slot'],
    '',
  );

const normalizeAccounts = (response: unknown): ManagedAccount[] => {
  const record = asRecord(response);
  const rows = asArray(record.accounts || record.broker_accounts || response).map(asRecord);

  return rows.map((account, index) => {
    const id = accountIdentity(account, index);
    return {
      id,
      label: firstString(account, ['account_label', 'label', 'name', 'nickname'], `Account ${index + 1}`),
      broker: firstString(account, ['broker', 'provider'], 'Broker'),
      status: firstString(account, ['status', 'connection_status'], 'Status unavailable'),
      pathValue: accountPathValue(account, index),
      raw: account,
    };
  });
};

export function AccountProvider({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [productAccountAssignments, setProductAccountAssignments] = useState<ProductAccountAssignments>({});
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAssignments = async () => {
      const storedAssignments = await productAccountStore.getAssignments();

      if (mounted) {
        setProductAccountAssignments(storedAssignments);
      }
    };

    loadAssignments();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshAccounts = useCallback(async () => {
    if (!isAuthenticated) {
      setAccounts([]);
      setSelectedAccountId(null);
      return;
    }

    setIsLoadingAccounts(true);
    setAccountsError(null);
    try {
      const nextAccounts = normalizeAccounts(await api.get<unknown>(endpoints.brokerAccounts));
      setAccounts(nextAccounts);
      setSelectedAccountId((current) => {
        if (current && nextAccounts.some((account) => account.id === current)) {
          return current;
        }

        return nextAccounts[0]?.id || null;
      });
      setProductAccountAssignments((currentAssignments) => {
        const validAssignments = Object.fromEntries(
          Object.entries(currentAssignments).filter(([, accountId]) => nextAccounts.some((account) => account.id === accountId)),
        );

        if (Object.keys(validAssignments).length !== Object.keys(currentAssignments).length) {
          productAccountStore.setAssignments(validAssignments);
        }

        return validAssignments;
      });
    } catch (error) {
      setAccountsError(customerSafeMessage(error));
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) || accounts[0] || null,
    [accounts, selectedAccountId],
  );

  const assignProductAccount = useCallback(async (productKey: string, accountId: string) => {
    const nextAssignments = {
      ...productAccountAssignments,
      [productKey]: accountId,
    };

    setProductAccountAssignments(nextAssignments);
    await productAccountStore.setAssignments(nextAssignments);
  }, [productAccountAssignments]);

  const getProductAccount = useCallback(
    (productKey: string) => {
      const accountId = productAccountAssignments[productKey];
      return accounts.find((account) => account.id === accountId) || accounts[0] || null;
    },
    [accounts, productAccountAssignments],
  );

  const value = useMemo(
    () => ({
      accounts,
      selectedAccount,
      selectedAccountId,
      productAccountAssignments,
      isLoadingAccounts,
      accountsError,
      selectAccount: setSelectedAccountId,
      assignProductAccount,
      getProductAccount,
      refreshAccounts,
    }),
    [
      accounts,
      selectedAccount,
      selectedAccountId,
      productAccountAssignments,
      isLoadingAccounts,
      accountsError,
      assignProductAccount,
      getProductAccount,
      refreshAccounts,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
