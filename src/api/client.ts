// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: client.ts - src/api/client.ts
// =====================================================
import Constants from 'expo-constants';
import { endpoints } from '@/api/endpoints';
import { ApiEnvelope, RefreshResponse } from '@/api/types';
import { ApiError } from '@/api/errors';
import { tokenStore } from '@/auth/tokenStore';

const configuredBaseUrl =
  process.env.BISMEL1_API_BASE_URL ||
  process.env.EXPO_PUBLIC_BISMEL1_API_BASE_URL ||
  Constants.expoConfig?.extra?.bismel1ApiBaseUrl;

export const API_BASE_URL = configuredBaseUrl || 'https://bismel1.com/api/mobile/v1';

let onUnauthorized: (() => Promise<void> | void) | undefined;

export const registerUnauthorizedHandler = (handler: () => Promise<void> | void) => {
  onUnauthorized = handler;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  retrying?: boolean;
};

const REQUEST_TIMEOUT_MS = 15000;

const fetchWithTimeout = async (url: string, init: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const parseEnvelope = async <T>(response: Response): Promise<T> => {
  let payload: unknown;
  let responseText = '';

  try {
    responseText = await response.text();
  } catch {
    throw new ApiError('The server returned an unreadable response.', 'invalid_json', response.status);
  }

  try {
    payload = JSON.parse(responseText) as unknown;
  } catch {
    if (response.status === 404) {
      throw new ApiError(
        'The mobile API route is not available on the server yet.',
        'mobile_route_not_found',
        response.status,
      );
    }

    throw new ApiError('The server returned an unreadable response.', 'invalid_json', response.status);
  }

  if (!payload || typeof payload !== 'object') {
    throw new ApiError('The server returned an unexpected response.', 'invalid_envelope', response.status);
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.ok !== 'boolean') {
    const message = typeof record.message === 'string' ? record.message : '';

    if (response.status === 404 && message.includes('route')) {
      throw new ApiError(
        'The mobile API route is not available on the server yet.',
        'mobile_route_not_found',
        response.status,
      );
    }

    throw new ApiError('The server returned an unexpected response.', 'invalid_envelope', response.status);
  }

  const envelope = payload as ApiEnvelope<T>;

  if (!envelope.ok) {
    throw new ApiError(
      envelope.error?.message || 'Unable to complete the request.',
      envelope.error?.code || 'api_error',
      response.status,
      envelope.error?.details,
    );
  }

  return envelope.data;
};

const extractToken = (response: RefreshResponse) =>
  response.token || response.access_token || response.bearer_token;

const refreshAccessToken = async () => {
  const currentToken = await tokenStore.getAccessToken();
  if (!currentToken) {
    return null;
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoints.auth.refresh}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await parseEnvelope<RefreshResponse>(response);
  const nextToken = extractToken(data);

  if (!nextToken) {
    return null;
  }

  await tokenStore.setAccessToken(nextToken);
  return nextToken;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = options.auth === false ? null : await tokenStore.getAccessToken();
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(
      'The mobile API could not be reached from this device.',
      'network_unavailable',
    );
  }

  if (response.status === 401 && options.auth !== false && !options.retrying) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      return apiRequest<T>(path, { ...options, retrying: true });
    }

    await tokenStore.clear();
    await onUnauthorized?.();
    throw new ApiError('Please log in again to continue.', 'unauthorized', 401);
  }

  if (!response.ok && response.status !== 422) {
    return parseEnvelope<T>(response);
  }

  return parseEnvelope<T>(response);
};

export const api = {
  get: <T>(path: string, auth = true) => apiRequest<T>(path, { method: 'GET', auth }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    apiRequest<T>(path, { method: 'POST', body, auth }),
  delete: <T>(path: string, auth = true) => apiRequest<T>(path, { method: 'DELETE', auth }),
};
