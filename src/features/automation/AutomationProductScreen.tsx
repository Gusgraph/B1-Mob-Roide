// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: AutomationProductScreen.tsx - src/features/automation/AutomationProductScreen.tsx
// =====================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowUp, Bot, Check, ChevronDown, Power, RadioTower, Search, X } from 'lucide-react-native';
import { api } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { ApiError, customerSafeMessage } from '@/api/errors';
import { ManagedAccount } from '@/accounts/AccountProvider';
import { useAccounts } from '@/accounts/useAccounts';
import { AppShell } from '@/components/AppShell';
import { Bismel1Card } from '@/components/Bismel1Card';
import { ConfirmSheet } from '@/components/ConfirmSheet';
import { DataRow } from '@/components/DataRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatDateTime } from '@/utils/dates';
import { formatMoney } from '@/utils/money';
import { asArray, asRecord, firstNumber, firstString } from '@/utils/records';

type AutomationProductScreenProps = {
  productKey: string;
  title: string;
};

export function AutomationProductScreen({ productKey, title }: AutomationProductScreenProps) {
  const [automation, setAutomation] = useState<Record<string, unknown> | null>(null);
  const [symbols, setSymbols] = useState<Record<string, unknown>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
  const [pendingRemove, setPendingRemove] = useState<Record<string, unknown> | null>(null);
  const [pendingSymbolToggle, setPendingSymbolToggle] = useState<Record<string, unknown> | null>(null);
  const [removeApiWarning, setRemoveApiWarning] = useState<string | null>(null);
  const [pendingAutomationConfirm, setPendingAutomationConfirm] = useState<{ enabled: boolean; message: string; confirmLive: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSymbols, setIsLoadingSymbols] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbolError, setSymbolError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const { accounts, accountsError, assignProductAccount, getProductAccount, isLoadingAccounts } = useAccounts();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const assignedAccount = getProductAccount(productKey);

  const loadProduct = useCallback(async () => {
    if (!assignedAccount?.pathValue) {
      setAutomation(null);
      setSymbols([]);
      setIsLoading(false);
      setIsLoadingSymbols(false);
      return;
    }

    setIsLoading(true);
    setIsLoadingSymbols(false);
    setError(null);
    setSymbolError(null);

    try {
      const automationResponse = asRecord(await api.get<unknown>(endpoints.automation(productKey, assignedAccount.pathValue)));
      setAutomation(automationResponse);
      setSymbols(asArray(automationResponse.symbols).map(asRecord));
      setIsLoading(false);
      setIsLoadingSymbols(false);
    } catch (loadError) {
      setError(customerSafeMessage(loadError));
      setIsLoading(false);
      setIsLoadingSymbols(false);
    }
  }, [assignedAccount?.pathValue, productKey]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const product = asRecord(automation?.product);
  const accountSlot = asRecord(automation?.account_slot);
  const brokerStatus = asRecord(automation?.broker_status);
  const systemState = asRecord(automation?.system_state);
  const strategyStatus = asRecord(automation?.strategy_status);
  const runtimeWindow = asRecord(automation?.runtime_window);
  // TODO: Keep the honest empty state until Laravel always returns runtime_window.work_feed.
  const workFeed = asArray(runtimeWindow.work_feed).map(asRecord);
  const automationEnabled = automation?.automation_enabled === true || accountSlot.automation_enabled === true;
  const canUseControls = Boolean(assignedAccount?.pathValue && automation);
  const removeWarning = firstString(
    asRecord(asRecord(asRecord(pendingRemove).actions).remove),
    ['warning', 'message'],
    removeApiWarning || `Remove ${firstString(asRecord(pendingRemove), ['symbol'], 'this symbol')} from ${title}.`,
  );
  const pendingToggleCode = firstString(asRecord(pendingSymbolToggle), ['symbol'], 'this symbol');
  const pendingToggleActive = asRecord(pendingSymbolToggle).active !== false;
  const pendingRemoveHasWarning = pendingRemove ? symbolNeedsRemoveWarning(asRecord(pendingRemove)) : false;
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setShowBackTop(false);
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextVisible = event.nativeEvent.contentOffset.y > 271;

    setShowBackTop((currentVisible) => currentVisible === nextVisible ? currentVisible : nextVisible);
  };
  const backTopControl = !isLoading && !error && Boolean(automation) && showBackTop ? (
    <Pressable accessibilityLabel="Back to top" accessibilityRole="button" onPress={scrollToTop} style={styles.backTopButton}>
      <ArrowUp color={colors.cyan} size={15} />
      <Text style={styles.backTopText}>Top</Text>
    </Pressable>
  ) : null;

  useEffect(() => {
    const query = searchQuery.trim().toUpperCase();

    const pathValue = assignedAccount?.pathValue;

    if (!pathValue || query.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSymbolError(null);

      try {
        const response = asRecord(await api.get<unknown>(endpoints.automationSymbolSearch(productKey, pathValue, query)));
        if (active) {
          setSearchResults(asArray(response.results || response.symbols || response.items || response).map(asRecord));
        }
      } catch (searchError) {
        if (active) {
          setSymbolError(customerSafeMessage(searchError));
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 473);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [assignedAccount?.pathValue, productKey, searchQuery]);

  return (
    <AppShell
      floatingAction={backTopControl}
      onRefresh={loadProduct}
      onScroll={handleScroll}
      refreshing={isLoading && Boolean(automation)}
      scrollRef={scrollRef}
      showAccountNav
      title={title}
    >
      <Bismel1Card>
        <View style={styles.assignmentHeader}>
          <Text style={styles.assignmentLabel}>Assigned Account</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAccountDropdownOpen((open) => !open)}
            style={styles.assignmentButton}
          >
            <View style={styles.assignmentCopy}>
              <Text numberOfLines={1} style={styles.assignmentTitle}>{assignedAccount?.label || 'Assign Account'}</Text>
              <Text numberOfLines={1} style={styles.assignmentMeta}>
                {assignedAccount ? `${assignedAccount.broker} / ${assignedAccount.status}` : 'Select account for this product'}
              </Text>
            </View>
            <ChevronDown color={colors.cyan} size={17} />
          </Pressable>
        </View>
        {accountDropdownOpen ? (
          <View style={styles.dropdown}>
            {accounts.length ? (
              accounts.map((account) => {
                const active = assignedAccount?.id === account.id;
                return (
                  <Pressable
                    key={account.id}
                    onPress={() => assignAccount(account)}
                    style={[styles.dropdownItem, active && styles.activeDropdownItem]}
                  >
                    <View style={styles.assignmentCopy}>
                      <Text numberOfLines={1} style={[styles.dropdownTitle, active && styles.activeDropdownTitle]}>{account.label}</Text>
                      <Text numberOfLines={1} style={styles.assignmentMeta}>{account.broker} / {account.status}</Text>
                    </View>
                    {active ? <Check color={colors.success} size={17} /> : null}
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.text}>{isLoadingAccounts ? 'Loading accounts' : accountsError || 'No connected accounts available.'}</Text>
            )}
          </View>
        ) : null}
      </Bismel1Card>

      {isLoading && !automation ? <LoadingState label="Loading product" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && !assignedAccount ? <EmptyState message="Assign an account to this product." /> : null}
      {!isLoading && !error && assignedAccount && !assignedAccount.pathValue ? <EmptyState message="This account is not available for automation yet." /> : null}
      {!isLoading && !error && assignedAccount?.pathValue && !automation ? <EmptyState message="No automation data returned." /> : null}

      {automation ? (
        <>
          <Bismel1Card>
            <View style={styles.cardHeader}>
              <Bot color={colors.accent} size={19} />
              <Text style={styles.title}>{firstString(product, ['product_name', 'name'], title)}</Text>
              <StatusBadge label={automationEnabled ? 'Automation On' : 'Automation Off'} status={automationEnabled ? 'success' : 'warning'} />
            </View>
            <View style={styles.metricsGrid}>
              <DataRow label="Broker status" value={brokerStatus.ready === true ? 'Ready' : 'Needs setup'} tone={brokerStatus.ready === true ? 'success' : 'warning'} />
              <Text style={styles.cardBody}>{brokerStatus.ready === true ? 'Trading account is connected and available for this product lane.' : 'Connect and verify a trading account before enabling automation.'}</Text>
              <DataRow label="System state" value={automationEnabled ? 'Automation On' : 'Automation Off'} tone={automationEnabled ? 'success' : 'warning'} />
              <Text style={styles.cardBody}>{automationEnabled ? 'B1 is monitoring the selected symbols for this product lane.' : 'Automation is off. Symbols remain saved, but B1 is not actively monitoring this slot.'}</Text>
              <DataRow label="Strategy status" value={formatStrategyStatus(firstString(strategyStatus, ['status'], 'Waiting for runtime'))} />
              <DataRow label="Automation Mode" value={firstString(accountSlot, ['mode'], 'Unavailable')} />
              <DataRow label="Last System Update" value={formatDateTime(systemState.settings_updated_at || systemState.last_runtime_at)} />
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={!canUseControls || isWorking}
              onPress={toggleAutomation}
              style={[styles.powerButton, !automationEnabled && styles.powerButtonOff, isWorking && styles.disabledAction]}
            >
              <Power color={colors.white} size={13} />
              <Text style={styles.powerText}>{automationEnabled ? 'Pause automation' : 'Resume automation'}</Text>
            </Pressable>
            {actionMessage ? <Text style={styles.successText}>{actionMessage}</Text> : null}
          </Bismel1Card>

          <B1RuntimeWindow
            accountReady={runtimeWindow.account_ready === true || brokerStatus.ready === true}
            automationEnabled={automationEnabled}
            colors={colors}
            runtimeWindow={runtimeWindow}
            styles={styles}
            workFeed={workFeed}
          />

          <Bismel1Card>
            <View style={styles.cardHeader}>
              <Search color={colors.cyan} size={19} />
              <Text style={styles.title}>Add Symbol</Text>
            </View>
            <View style={styles.searchRow}>
              <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchSymbols}
                placeholder="Search symbol"
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
                value={searchQuery}
              />
              <Pressable disabled={!canUseControls || isSearching} onPress={searchSymbols} style={[styles.searchButton, isSearching && styles.disabledAction]}>
                <Search color={colors.white} size={17} />
              </Pressable>
            </View>
            {searchResults.length ? (
              <View style={styles.searchResults}>
                {searchResults.slice(0, 7).map((result, index) => {
                  const symbol = firstString(result, ['symbol'], '');
                  const canAdd = result.can_add !== false && result.already_added !== true;
                  return (
                    <Pressable
                      disabled={!canAdd || isWorking}
                      key={`${symbol}-${index}`}
                      onPress={() => addSymbol(symbol)}
                      style={[styles.searchResult, !canAdd && styles.disabledAction]}
                    >
                      <View style={styles.assignmentCopy}>
                        <Text style={styles.dropdownTitle}>{symbol}</Text>
                        <Text style={styles.assignmentMeta}>{firstString(result, ['name', 'asset_type', 'status'], '')}</Text>
                      </View>
                      <Text style={styles.addText}>{result.already_added === true ? 'Added' : 'Add'}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </Bismel1Card>

          <Bismel1Card>
            <View style={styles.cardHeader}>
              <RadioTower color={colors.purple} size={19} />
              <Text style={styles.title}>Watched Symbols</Text>
              <StatusBadge label={isLoadingSymbols ? 'Loading' : String(symbols.length)} status="neutral" />
            </View>
            <Text style={styles.cardBody}>Symbols selected for this product and account.</Text>
            {symbolError ? <Text style={styles.errorText}>{symbolError}</Text> : null}
            {isLoadingSymbols && !symbols.length ? <LoadingState label="Loading symbols" /> : null}
            {symbols.length ? (
              symbols.map((symbol, index) => {
                const symbolCode = firstString(symbol, ['symbol'], 'Symbol');
                const symbolStrategy = asRecord(symbol.strategy_status);
                const active = symbol.active !== false;
                const canToggle = asRecord(asRecord(symbol.actions).toggle).enabled !== false;
                const canRemove = asRecord(symbol.actions_allowed).remove !== false;
                const latestDecision = firstString(symbol, ['latest_decision'], firstString(symbolStrategy, ['direction', 'status'], 'Unavailable'));
                const changePercent = firstNumber(symbol, ['change_percent']);
                const marketTone = typeof changePercent === 'number' && changePercent < 0 ? styles.marketDown : styles.marketUp;
                const marketGauge = asRecord(symbol.market_hours_gauge || automation.market_hours_gauge || asRecord(runtimeWindow).market_hours_gauge);
                const marketGaugeProgress = clampGaugeProgress(firstNumber(marketGauge, ['progress_percent']));
                const marketGaugeTone = marketGaugeToneStyle(colors, firstString(marketGauge, ['status', 'tone'], 'closed'));

                return (
                  <View key={symbolCode} style={[styles.symbolCard, index % 2 === 0 ? styles.symbolCardCyan : styles.symbolCardGreen]}>
                    <View style={styles.symbolTop}>
                      <View style={styles.symbolCopy}>
                        <Text style={styles.symbol}>{symbolCode}</Text>
                        <Text numberOfLines={2} style={styles.symbolName}>{formatSymbolName(symbol)}</Text>
                      </View>
                      <View style={styles.symbolStatusStack}>
                        <Text style={styles.statusMicro}>{formatStatus(firstString(symbol, ['status'], 'Status'))}</Text>
                      </View>
                    </View>

                    <View style={styles.symbolCompactGrid}>
                      <View style={styles.symbolMarketBlock}>
                        <View style={styles.marketGaugeHeader}>
                          <View style={styles.marketGaugeDots} accessibilityLabel={firstString(marketGauge, ['display', 'status'], 'Market hours unavailable')}>
                            <View style={[styles.marketGaugeDot, marketGaugeTone]} />
                            <View style={[styles.marketGaugeDot, styles.marketGaugeDotMid, marketGaugeTone]} />
                            <View style={[styles.marketGaugeDot, styles.marketGaugeDotSmall, marketGaugeTone]} />
                          </View>
                          <Text numberOfLines={1} style={[styles.marketGaugeText, marketGaugeTone, styles.marketGaugeTextClear]}>
                            {formatMarketGaugeLabel(marketGauge)}
                          </Text>
                        </View>
                        <View style={styles.marketGaugeTrack}>
                          <View style={[styles.marketGaugeFill, marketGaugeTone, { width: `${marketGaugeProgress}%` }]} />
                        </View>
                        <Text style={[styles.symbolGridValue, marketTone]}>{formatMarketLine(symbol)}</Text>
                        <Text style={styles.symbolGridTime}>{formatDateTime(symbol.market_data_at)}</Text>
                      </View>
                    </View>

                    <View style={styles.runtimePanel}>
                      <View style={styles.runtimeHeader}>
                        <Text style={styles.runtimeStatus}>{formatStrategyStatus(firstString(symbolStrategy, ['status', 'state']))}</Text>
                        <Text style={styles.runtimeTime}>{formatDateTime(symbolStrategy.generated_at)}</Text>
                      </View>
                      <Text numberOfLines={2} style={styles.runtimeSummary}>
                        {formatRuntimeSummary(symbol, symbolStrategy)}
                      </Text>
                      <Text style={styles.runtimeMeta}>{formatRuntimeActionLine(symbol, symbolStrategy, latestDecision)}</Text>
                      <Text style={styles.runtimeMeta}>Last bar: {formatDateTime(symbol.market_data_at)}</Text>
                    </View>

                    <View style={styles.symbolActions}>
                      <View style={styles.symbolToggleGroup}>
                        <Text style={styles.symbolToggleState}>{active ? 'Pause' : 'Resume'}</Text>
                        <Pressable
                          accessibilityRole="switch"
                          accessibilityState={{ checked: active, disabled: isWorking || !canToggle }}
                          disabled={isWorking || !canToggle}
                          onPress={() => setPendingSymbolToggle(symbol)}
                          style={[styles.symbolSwitch, active && styles.symbolSwitchActive, (isWorking || !canToggle) && styles.disabledAction]}
                        >
                          <View style={[styles.symbolSwitchThumb, active && styles.symbolSwitchThumbActive]} />
                        </Pressable>
                      </View>
                      <Pressable
                        disabled={isWorking || !canRemove}
                        onPress={() => setPendingRemove(symbol)}
                        style={[styles.removeAction, (isWorking || !canRemove) && styles.disabledAction]}
                      >
                        <X color={colors.danger} size={13} />
                        <Text style={styles.removeActionText}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            ) : !isLoadingSymbols && !symbolError ? (
              <Text style={styles.text}>No symbols added yet.{'\n'}Search and add symbols to start monitoring this product lane.</Text>
            ) : null}
          </Bismel1Card>
        </>
      ) : null}

      <ConfirmSheet
        confirmLabel="Remove"
        isLoading={isWorking}
        message={pendingRemoveHasWarning ? 'This symbol has an open position or pending order. Review positions and orders before removing it.' : removeWarning}
        onCancel={() => {
          setPendingRemove(null);
          setRemoveApiWarning(null);
        }}
        onConfirm={removeSymbol}
        title="Confirm Remove"
        visible={Boolean(pendingRemove)}
      />
      <ConfirmSheet
        confirmLabel={pendingAutomationConfirm?.enabled ? 'Turn On' : 'Turn Off'}
        isLoading={isWorking}
        message={pendingAutomationConfirm?.message || 'Confirm automation change.'}
        onCancel={() => setPendingAutomationConfirm(null)}
        onConfirm={confirmToggleAutomation}
        title="Confirm Automation"
        visible={Boolean(pendingAutomationConfirm)}
      />
      <ConfirmSheet
        confirmLabel={pendingToggleActive ? 'Pause' : 'Resume'}
        isLoading={isWorking}
        message={`${pendingToggleActive ? 'Pause' : 'Resume'} ${pendingToggleCode}. Open positions stay open. This only changes whether the symbol is included in future automation checks.`}
        onCancel={() => setPendingSymbolToggle(null)}
        onConfirm={confirmToggleSymbol}
        title="Confirm Symbol Mode"
        visible={Boolean(pendingSymbolToggle)}
      />
    </AppShell>
  );

  async function assignAccount(account: ManagedAccount) {
    await assignProductAccount(productKey, account.id);
    setAccountDropdownOpen(false);
  }

  async function searchSymbols() {
    const query = searchQuery.trim().toUpperCase();

    if (!assignedAccount?.pathValue || !query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSymbolError(null);

    try {
      const response = asRecord(await api.get<unknown>(endpoints.automationSymbolSearch(productKey, assignedAccount.pathValue, query)));
      setSearchResults(asArray(response.results || response.symbols || response.items || response).map(asRecord));
    } catch (searchError) {
      setSymbolError(customerSafeMessage(searchError));
    } finally {
      setIsSearching(false);
    }
  }

  async function addSymbol(symbol: string) {
    if (!assignedAccount?.pathValue || !symbol) {
      return;
    }

    setIsWorking(true);
    setActionMessage(null);

    try {
      await api.post<unknown>(endpoints.automationSymbols(productKey, assignedAccount.pathValue), { symbol, mode: 'active' });
      setSearchQuery('');
      setSearchResults([]);
      setActionMessage(`${symbol} added.`);
      await loadProduct();
    } catch (addError) {
      setSymbolError(customerSafeMessage(addError));
    } finally {
      setIsWorking(false);
    }
  }

  async function toggleAutomation() {
    if (!assignedAccount?.pathValue) {
      return;
    }

    setActionMessage(null);
    setPendingAutomationConfirm({
      enabled: !automationEnabled,
      confirmLive: false,
      message: `${automationEnabled ? 'Turn automation off' : 'Turn automation on'} for ${title}. Open positions stay open. This does not close positions or place broker orders directly.`,
    });
  }

  async function confirmToggleSymbol() {
    if (!assignedAccount?.pathValue) {
      return;
    }

    const symbol = asRecord(pendingSymbolToggle);
    const symbolCode = firstString(symbol, ['symbol'], '');

    if (!symbolCode) {
      return;
    }

    setIsWorking(true);
    setActionMessage(null);

    try {
      await api.patch<unknown>(endpoints.automationSymbolToggle(productKey, assignedAccount.pathValue, symbolCode), {
        active: symbol.active === false,
      });
      setActionMessage(`${symbolCode} updated.`);
      setPendingSymbolToggle(null);
      await loadProduct();
    } catch (toggleError) {
      setSymbolError(customerSafeMessage(toggleError));
    } finally {
      setIsWorking(false);
    }
  }

  async function removeSymbol() {
    if (!assignedAccount?.pathValue || !pendingRemove) {
      return;
    }

    const symbolCode = firstString(pendingRemove, ['symbol'], '');

    if (!symbolCode) {
      return;
    }

    setIsWorking(true);
    setActionMessage(null);

    try {
      await api.delete<unknown>(endpoints.automationSymbol(productKey, assignedAccount.pathValue, symbolCode));
      setActionMessage(`${symbolCode} removed.`);
      setPendingRemove(null);
      setRemoveApiWarning(null);
      await loadProduct();
    } catch (removeError) {
      if (removeError instanceof ApiError && removeError.status === 409 && removeError.code === 'symbol_remove_warning_required') {
        setRemoveApiWarning(removeError.message);
        return;
      }

      setSymbolError(customerSafeMessage(removeError));
    } finally {
      setIsWorking(false);
    }
  }

  async function confirmToggleAutomation() {
    if (!assignedAccount?.pathValue || !pendingAutomationConfirm) {
      return;
    }

    setIsWorking(true);
    setActionMessage(null);

    try {
      await api.post<unknown>(endpoints.automationToggle(productKey, assignedAccount.pathValue), {
        enabled: pendingAutomationConfirm.enabled,
        confirm_live: pendingAutomationConfirm.confirmLive,
      });
      setPendingAutomationConfirm(null);
      setActionMessage('Automation updated.');
      await loadProduct();
    } catch (confirmError) {
      if (confirmError instanceof ApiError && confirmError.status === 409 && confirmError.code === 'live_account_warning_required') {
        setPendingAutomationConfirm({
          enabled: pendingAutomationConfirm.enabled,
          confirmLive: true,
          message: confirmError.message,
        });
        return;
      }

      setError(customerSafeMessage(confirmError));
    } finally {
      setIsWorking(false);
    }
  }
}

type RuntimeWindowProps = {
  accountReady: boolean;
  automationEnabled: boolean;
  colors: ThemeColors;
  runtimeWindow: Record<string, unknown>;
  styles: ReturnType<typeof makeStyles>;
  workFeed: Record<string, unknown>[];
};

function B1RuntimeWindow({
  accountReady,
  automationEnabled,
  colors,
  runtimeWindow,
  styles,
  workFeed,
}: RuntimeWindowProps) {
  const [workFeedOffset, setWorkFeedOffset] = useState(0);
  const state = firstString(runtimeWindow, ['state', 'status'], '');
  const setupRequired = !accountReady || state.toLowerCase().includes('setup');
  const emptyMessage = setupRequired
    ? 'Finish setup before automation can run.'
    : automationEnabled
      ? 'Bismel1 is watching this account. No recent background activity is available yet.'
      : 'Automation is off. Turn it on to start watching symbols.';
  const groupedWorkFeed = groupRuntimeWorkFeed(workFeed);
  const visibleWorkFeed = getRotatingWindowRows(groupedWorkFeed, workFeedOffset, 3);

  useEffect(() => {
    if (groupedWorkFeed.length <= 3) {
      setWorkFeedOffset(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setWorkFeedOffset((current) => (current + 1) % groupedWorkFeed.length);
    }, 2100);

    return () => clearInterval(interval);
  }, [groupedWorkFeed.length]);

  return (
    <View style={styles.workFeed}>
      {groupedWorkFeed.length ? (
        visibleWorkFeed.map((row, index) => {
          const stage = formatRuntimeStage(firstString(row, ['stage', 'stage_label', 'status'], 'Needs Review'));
          const message = formatRuntimeMessage(firstString(row, ['message', 'safe_result', 'result', 'summary'], 'Needs Review'));
          const status = formatRuntimeStatus(firstString(row, ['status', 'tone'], 'completed'));
          const tone = runtimeStatusTone(status);

          return (
            <View key={firstString(row, ['key', 'id'], `${index}-${firstString(row, ['symbol'], 'ACCOUNT')}`)} style={styles.workFeedRow}>
              <View style={[styles.workFeedDot, workFeedToneStyle(colors, tone)]} />
              <View style={styles.workFeedSymbolBlock}>
                <Text numberOfLines={1} style={styles.workFeedSymbol}>{formatRuntimeSymbol(firstString(row, ['symbol', 'scope'], 'ACCOUNT'))}</Text>
                <Text numberOfLines={1} style={styles.workFeedTime}>{formatFeedTime(row)}</Text>
              </View>
              <View style={styles.workFeedBody}>
                <Text numberOfLines={1} style={styles.workFeedStage}>{stage}</Text>
                <Text numberOfLines={2} style={styles.workFeedMessage}>{message}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.workFeedStatus, workFeedStatusTextStyle(colors, tone)]}>{status}</Text>
            </View>
          );
        })
      ) : (
        <View style={styles.workFeedEmpty}>
          <Text style={styles.workFeedEmptyTitle}>Background work feed is not available yet.</Text>
          <Text style={styles.workFeedEmptyText}>{emptyMessage}</Text>
        </View>
      )}
    </View>
  );
}

const formatStatus = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatStrategyStatus = (value: string) => {
  const status = value.toLowerCase();

  if (status.includes('wait')) {
    return 'Waiting for runtime';
  }

  if (status.includes('complete')) {
    return 'Completed';
  }

  if (status.includes('block')) {
    return 'Blocked';
  }

  if (status.includes('skip')) {
    return 'Checked';
  }

  if (status.includes('check')) {
    return 'Checked';
  }

  return formatStatus(value);
};

const formatLastAction = (symbol: Record<string, unknown>, fallback: string) => {
  const raw = firstString(symbol, ['last_action', 'latest_action', 'latest_decision'], fallback).toLowerCase();

  if (raw.includes('buy')) {
    return 'BUY';
  }

  if (raw.includes('sell')) {
    return 'SELL';
  }

  if (raw.includes('hold')) {
    return 'No action yet';
  }

  if (raw.includes('no action') || raw.includes('no_action') || raw.includes('skip') || raw.includes('none') || raw.includes('unavailable')) {
    return 'No action yet';
  }

  return 'No action yet';
};

const formatRuntimeSummary = (symbol: Record<string, unknown>, strategyStatus: Record<string, unknown>) => {
  const message = firstString(
    strategyStatus,
    ['summary', 'message', 'status_message', 'description', 'note'],
    firstString(symbol, ['runtime_summary', 'summary', 'runtime_message', 'latest_runtime_message', 'status_message']),
  );

  if (message !== 'Unavailable') {
    return message;
  }

  return strategyStatus.generated_at || symbol.runtime_checked_at ? 'Included in latest runtime cycle' : message;
};

const formatRuntimeActionLine = (
  symbol: Record<string, unknown>,
  strategyStatus: Record<string, unknown>,
  fallback: string,
) => {
  const timestamp = formatDateTime(
    strategyStatus.generated_at ||
      symbol.strategy_generated_at ||
      symbol.runtime_checked_at ||
      symbol.market_data_at,
  );

  return `${timestamp} - ${formatActionSentence(formatLastAction(symbol, fallback))}`;
};

const formatActionSentence = (action: string) => {
  if (action === 'BUY') {
    return 'Buy';
  }

  if (action === 'SELL') {
    return 'Sell';
  }

  if (action === 'HOLD') {
    return 'Hold';
  }

  return 'No action';
};

const symbolNeedsRemoveWarning = (symbol: Record<string, unknown>) => {
  const blockers = asRecord(symbol.disconnect_blockers || symbol.remove_blockers || symbol.blockers);
  const openPositions = firstNumber(blockers, ['open_positions_count']) || firstNumber(symbol, ['open_positions_count']);
  const pendingOrders = firstNumber(blockers, ['pending_orders_count']) || firstNumber(symbol, ['pending_orders_count']);

  return Boolean((openPositions && openPositions > 0) || (pendingOrders && pendingOrders > 0));
};

const formatMarketLine = (symbol: Record<string, unknown>) => {
  const price = formatMoney(firstNumber(symbol, ['latest_price']));
  const percent = firstNumber(symbol, ['change_percent']);
  const percentText = typeof percent === 'number' && Number.isFinite(percent) ? ` (${formatSignedPercent(percent)})` : '';

  return `${price}${percentText}`;
};

const formatSignedPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

const formatSymbolName = (symbol: Record<string, unknown>) => {
  const name = firstString(symbol, ['name'], '');
  const assetType = firstString(symbol, ['asset_type'], '');

  return [name, assetType].filter(Boolean).join(' / ');
};

const formatRuntimeSymbol = (value: string) => {
  const symbol = value.trim().toUpperCase();

  return symbol || 'ACCOUNT';
};

const groupRuntimeWorkFeed = (rows: Record<string, unknown>[]) => {
  const grouped = new Map<string, { count: number; row: Record<string, unknown> }>();

  rows.forEach((row) => {
    const symbol = formatRuntimeSymbol(firstString(row, ['symbol', 'scope'], 'ACCOUNT'));
    const stage = formatRuntimeStage(firstString(row, ['stage', 'stage_label', 'status'], 'Needs Review'));
    const key = `${symbol}:${stage}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
      existing.row = row;
      return;
    }

    grouped.set(key, { count: 1, row });
  });

  return Array.from(grouped.values()).map(({ count, row }) => {
    if (count <= 1) {
      return row;
    }

    return {
      ...row,
      message: `Reviewed ${count} times today. Latest result: ${formatRuntimeMessage(firstString(row, ['message', 'safe_result', 'result', 'summary'], 'Needs Review'))}.`,
    };
  });
};

const getRotatingWindowRows = <T,>(rows: T[], offset: number, count: number) => {
  if (rows.length <= count) {
    return rows;
  }

  return Array.from({ length: count }, (_, index) => rows[(offset + index) % rows.length]);
};

const formatRuntimeStage = (value: string) => {
  const stage = value.toLowerCase().replace(/_/g, ' ');

  if (stage.includes('market')) {
    return 'Market Data';
  }

  if (stage.includes('candidate') || stage.includes('review')) {
    return 'Candidate Review';
  }

  if (stage.includes('risk') || stage.includes('exposure')) {
    return 'Risk Check';
  }

  if (stage.includes('account') || stage.includes('ready')) {
    return 'Account Check';
  }

  if (stage.includes('order')) {
    return 'Order Review';
  }

  if (stage.includes('position')) {
    return 'Position Review';
  }

  if (stage.includes('profit') || stage.includes('target')) {
    return 'Profit Target Review';
  }

  if (stage.includes('sync')) {
    return 'Sync';
  }

  if (stage.includes('wait')) {
    return 'Watching';
  }

  if (stage.includes('submit')) {
    return 'Submitted';
  }

  if (stage.includes('fill')) {
    return 'Filled';
  }

  if (stage.includes('skip')) {
    return 'Skipped';
  }

  if (stage.includes('scan') || stage.includes('symbol')) {
    return 'Scanning';
  }

  return 'Needs Review';
};

const formatRuntimeMessage = (value: string) => {
  if (value.startsWith('Reviewed ')) {
    return value;
  }

  const message = value.toLowerCase().replace(/_/g, ' ');

  if (message.includes('no setup')) {
    return 'No Trading Setup found';
  }

  if (message.includes('confirm')) {
    return 'Waiting for confirmation';
  }

  if (message.includes('fresh') || message.includes('market data')) {
    return 'Fresh data confirmed';
  }

  if (message.includes('refresh')) {
    return 'Data needs refresh';
  }

  if (message.includes('exposure') || message.includes('risk')) {
    return 'Exposure reviewed';
  }

  if (message.includes('ready')) {
    return 'Account ready';
  }

  if (message.includes('submitted')) {
    return 'Order submitted';
  }

  if (message.includes('filled')) {
    return 'Order filled';
  }

  if (message.includes('position')) {
    return 'Position monitored';
  }

  if (message.includes('target reached')) {
    return 'Target reached';
  }

  if (message.includes('target')) {
    return 'Target not reached';
  }

  if (message.includes('sync') || message.includes('activity')) {
    return 'Activity synced';
  }

  if (message.includes('setup')) {
    return 'Trading Setup needed';
  }

  if (message.includes('off') || message.includes('paused')) {
    return 'Automation is off';
  }

  return 'Needs review';
};

const formatRuntimeStatus = (value: string) => {
  const status = value.toLowerCase().replace(/_/g, ' ');

  if (status.includes('submit')) {
    return 'Submitted';
  }

  if (status.includes('fill')) {
    return 'Filled';
  }

  if (status.includes('skip')) {
    return 'Skipped';
  }

  if (status.includes('wait')) {
    return 'Watching';
  }

  if (status.includes('review') || status.includes('need') || status.includes('warning')) {
    return 'Needs Review';
  }

  return 'Completed';
};

const runtimeStatusTone = (status: string) => {
  if (status === 'Submitted' || status === 'Filled' || status === 'Completed') {
    return 'up';
  }

  if (status === 'Watching' || status === 'Skipped') {
    return 'warning';
  }

  return 'down';
};

const formatFeedTime = (row: Record<string, unknown>) => {
  const label = firstString(row, ['timestamp', 'time_label'], '');

  if (label) {
    return label;
  }

  return formatDateTime(row.created_at || row.updated_at);
};

const formatMarketGaugeLabel = (gauge: Record<string, unknown>) => {
  const display = formatStatus(firstString(gauge, ['display', 'status'], 'Unavailable'));

  return display.toLowerCase().startsWith('market') ? display : `Market ${display}`;
};

const clampGaugeProgress = (value: number | undefined) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
};

const workFeedToneStyle = (colors: ThemeColors, tone: string) => {
  if (tone === 'up') {
    return { backgroundColor: colors.success, shadowColor: colors.success };
  }

  if (tone === 'warning') {
    return { backgroundColor: colors.warning, shadowColor: colors.warning };
  }

  return { backgroundColor: colors.danger, shadowColor: colors.danger };
};

const workFeedStatusTextStyle = (colors: ThemeColors, tone: string) => {
  if (tone === 'up') {
    return { color: colors.success };
  }

  if (tone === 'warning') {
    return { color: colors.warning };
  }

  return { color: colors.danger };
};

const marketGaugeToneStyle = (colors: ThemeColors, status: string) => {
  const normalized = status.toLowerCase();

  if (normalized.includes('open') || normalized.includes('up')) {
    return { backgroundColor: colors.success, color: colors.success, shadowColor: colors.success };
  }

  if (normalized.includes('pre') || normalized.includes('after') || normalized.includes('warning')) {
    return { backgroundColor: colors.warning, color: colors.warning, shadowColor: colors.warning };
  }

  if (normalized.includes('closed') || normalized.includes('down')) {
    return { backgroundColor: colors.danger, color: colors.danger, shadowColor: colors.danger };
  }

  return { backgroundColor: colors.textMuted, color: colors.textMuted, shadowColor: colors.textMuted };
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  successText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  assignmentHeader: {
    gap: 9,
  },
  assignmentLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  assignmentButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    minHeight: 57,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  assignmentCopy: {
    flex: 1,
    gap: 3,
  },
  assignmentTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  assignmentMeta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  dropdown: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    gap: 7,
    padding: 7,
  },
  dropdownItem: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 9,
  },
  activeDropdownItem: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.cyan,
  },
  dropdownTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  activeDropdownTitle: {
    color: colors.cyan,
  },
  metricsGrid: {
    gap: 9,
  },
  powerButton: {
    alignItems: 'center',
    backgroundColor: colors.success,
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 33,
    paddingHorizontal: 13,
  },
  powerButtonOff: {
    backgroundColor: colors.warning,
  },
  powerText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  disabledAction: {
    opacity: 0.57,
  },
  workFeed: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    gap: 3,
    maxHeight: 211,
    minHeight: 211,
    overflow: 'hidden',
    padding: 9,
  },
  workFeedRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 7,
    minHeight: 57,
    paddingVertical: 7,
  },
  workFeedDot: {
    borderRadius: 999,
    height: 7,
    shadowOpacity: 0.57,
    shadowRadius: 7,
    width: 7,
  },
  workFeedSymbolBlock: {
    gap: 3,
    width: 67,
  },
  workFeedSymbol: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  workFeedTime: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  workFeedBody: {
    flex: 1,
    gap: 3,
  },
  workFeedStage: {
    color: colors.cyan,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  workFeedMessage: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  workFeedStatus: {
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'right',
    width: 59,
  },
  workFeedEmpty: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    gap: 5,
    padding: 11,
  },
  workFeedEmptyTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  workFeedEmptyText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 17,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  searchInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    minHeight: 47,
    paddingHorizontal: 13,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 11,
    height: 47,
    justifyContent: 'center',
    width: 47,
  },
  searchResults: {
    gap: 7,
  },
  searchResult: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 9,
  },
  addText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '900',
  },
  symbolCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.cyan,
    borderRadius: 15,
    borderWidth: 2,
    gap: 11,
    padding: 11,
  },
  symbolCardCyan: {
    borderColor: colors.cyan,
  },
  symbolCardGreen: {
    borderColor: colors.success,
  },
  symbolTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
  },
  symbolCopy: {
    flex: 1,
    gap: 3,
  },
  symbol: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  symbolName: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  symbolStatusStack: {
    alignItems: 'flex-end',
    gap: 5,
  },
  statusMicro: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  symbolCompactGrid: {
    flexDirection: 'row',
    gap: 7,
  },
  symbolMarketBlock: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    flex: 1,
    gap: 3,
    minHeight: 73,
    padding: 9,
  },
  marketGaugeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'flex-start',
  },
  marketGaugeDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    minHeight: 15,
  },
  marketGaugeDot: {
    borderRadius: 9,
    height: 11,
    shadowOpacity: 0.57,
    shadowRadius: 7,
    width: 11,
  },
  marketGaugeDotMid: {
    height: 7,
    opacity: 0.73,
    width: 7,
  },
  marketGaugeDotSmall: {
    height: 5,
    opacity: 0.47,
    width: 5,
  },
  marketGaugeText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  marketGaugeTextClear: {
    backgroundColor: 'transparent',
  },
  marketGaugeTrack: {
    backgroundColor: colors.surface,
    borderRadius: 9,
    height: 5,
    overflow: 'hidden',
  },
  marketGaugeFill: {
    borderRadius: 9,
    height: 5,
    minWidth: 5,
  },
  symbolGridLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  symbolGridValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  marketUp: {
    color: colors.success,
  },
  marketDown: {
    color: colors.danger,
  },
  symbolGridTime: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  runtimePanel: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 1,
    gap: 5,
    padding: 9,
  },
  runtimeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'space-between',
  },
  runtimeStatus: {
    color: colors.cyan,
    fontSize: 13,
    fontWeight: '900',
  },
  runtimeTime: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  runtimeSummary: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  runtimeMeta: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 13,
  },
  symbolActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  symbolToggleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'flex-start',
  },
  symbolToggleState: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    minWidth: 57,
  },
  symbolSwitch: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.cyan,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    height: 23,
    justifyContent: 'flex-start',
    paddingHorizontal: 3,
    width: 43,
  },
  symbolSwitchActive: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
  },
  symbolSwitchThumb: {
    backgroundColor: colors.warning,
    borderRadius: 999,
    height: 15,
    width: 15,
  },
  symbolSwitchThumbActive: {
    backgroundColor: colors.success,
    transform: [{ translateX: 21 }],
  },
  removeAction: {
    alignItems: 'center',
    backgroundColor: colors.dangerMuted,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 31,
    paddingHorizontal: 9,
  },
  removeActionText: {
    color: colors.danger,
    fontSize: 9,
    fontWeight: '900',
  },
  backTopButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.31,
    shadowRadius: 15,
  },
  backTopText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  removeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
});
