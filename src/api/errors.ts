export class ApiError extends Error {
  code: string;
  status?: number;
  details?: unknown;

  constructor(message: string, code = 'api_error', status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const customerSafeMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Unable to complete the request. Please try again.';
};

