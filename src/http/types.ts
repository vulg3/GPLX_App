export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export class AppError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  isNetworkError?: boolean;
  constructor(message: string, init?: Partial<AppError>) {
    super(message);
    Object.assign(this, init);
  }
}
