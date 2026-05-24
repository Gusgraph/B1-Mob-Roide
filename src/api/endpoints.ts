// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: endpoints.ts - src/api/endpoints.ts
// =====================================================
export const endpoints = {
  appConfig: '/app-config',
  plans: '/plans',
  homeLivePerformance: '/home/live-performance',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/me',
  },
  dashboard: '/dashboard',
  alertDismiss: (alertKey: string) => `/alerts/${encodeURIComponent(alertKey)}/dismiss`,
  profileSettings: '/profile/settings',
  profilePassword: '/profile/password',
  products: '/products',
  productOverview: (product: string | number) => `/products/${product}/overview`,
  accounts: '/accounts',
  accountSnapshot: (account: string | number) => `/accounts/${account}/snapshot`,
  brokers: '/brokers',
  brokerAccounts: '/brokers/accounts',
  connectAlpaca: '/brokers/alpaca/connect',
  disconnectBroker: (brokerAccount: string | number) => `/brokers/${brokerAccount}/disconnect`,
  brokerStatus: (brokerAccount: string | number) => `/brokers/${brokerAccount}/status`,
  automation: (product: string | number, accountSlot: string | number) =>
    `/automation/${product}/${accountSlot}`,
  automationSymbols: (product: string | number, accountSlot: string | number) =>
    `/automation/${product}/${accountSlot}/symbols`,
  automationSymbolSearch: (product: string | number, accountSlot: string | number, query: string) =>
    `/automation/${product}/${accountSlot}/symbols/search?q=${encodeURIComponent(query)}`,
  automationSymbol: (product: string | number, accountSlot: string | number, symbol: string) =>
    `/automation/${product}/${accountSlot}/symbols/${encodeURIComponent(symbol)}`,
  automationSymbolToggle: (product: string | number, accountSlot: string | number, symbol: string) =>
    `/automation/${product}/${accountSlot}/symbols/${encodeURIComponent(symbol)}/toggle`,
  automationToggle: (product: string | number, accountSlot: string | number) =>
    `/automation/${product}/${accountSlot}/toggle`,
  positions: '/positions',
  position: (symbol: string) => `/positions/${encodeURIComponent(symbol)}`,
  manualClosePosition: (symbol: string) => `/positions/${encodeURIComponent(symbol)}/manual-close`,
  orders: '/orders',
  order: (order: string | number) => `/orders/${order}`,
  tradeActivity: '/activity/trades',
  systemActivity: '/activity/system',
  performanceSummary: '/performance/summary',
  performanceCurve: '/performance/curve',
  billingSummary: '/billing/summary',
  billingPortal: '/billing/portal',
  supportTickets: '/support/tickets',
  supportTicket: (ticket: string | number) => `/support/tickets/${ticket}`,
  supportTicketReply: (ticket: string | number) => `/support/tickets/${ticket}/reply`,
  affiliateSummary: '/affiliate/summary',
  affiliateReferrals: '/affiliate/referrals',
  affiliatePayouts: '/affiliate/payouts',
} as const;

