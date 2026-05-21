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

const parseEnvelope = async <T>(response: Response): Promise<T> => {
  let payload: ApiEnvelope<T>;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError('The server returned an unreadable response.', 'invalid_json', response.status);
  }

  if (!payload || typeof payload !== 'object' || typeof payload.ok !== 'boolean') {
    throw new ApiError('The server returned an unexpected response.', 'invalid_envelope', response.status);
  }

  if (!payload.ok) {
    throw new ApiError(
      payload.error?.message || 'Unable to complete the request.',
      payload.error?.code || 'api_error',
      response.status,
      payload.error?.details,
    );
  }

  return payload.data;
};

const extractToken = (response: RefreshResponse) =>
  response.token || response.access_token || response.bearer_token;

const refreshAccessToken = async () => {
  const currentToken = await tokenStore.getAccessToken();
  if (!currentToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${endpoints.auth.refresh}`, {
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

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

