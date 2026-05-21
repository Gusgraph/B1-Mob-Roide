export type ApiSuccessEnvelope<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorEnvelope = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export type LoginResponse = {
  token?: string;
  access_token?: string;
  bearer_token?: string;
  user?: MobileUser;
};

export type RefreshResponse = {
  token?: string;
  access_token?: string;
  bearer_token?: string;
};

export type MobileUser = {
  id?: string | number;
  name?: string;
  email?: string;
  affiliate_approved?: boolean;
  affiliateApproved?: boolean;
};

export type Plan = Record<string, unknown>;
export type Dashboard = Record<string, unknown>;
export type Product = Record<string, unknown>;
export type Position = Record<string, unknown>;
export type ActivityItem = Record<string, unknown>;
export type BrokerAccount = Record<string, unknown>;
export type Order = Record<string, unknown>;
export type Summary = Record<string, unknown>;
export type SupportTicket = Record<string, unknown>;
