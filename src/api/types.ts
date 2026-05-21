// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: types.ts - src/api/types.ts
// =====================================================
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
