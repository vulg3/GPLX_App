import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./tokenStorage";
import { AppError } from "./types";

const API_BASE_URL = process.env.BASEURL;

const TIMEOUT = Number(process.env.TIMEOUT ?? 15000);
const REFRESH_ENDPOINT = "/auth/refresh";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let queuedResolvers: Array<(token: string) => void> = [];
let queuedRejectors: Array<(err: unknown) => void> = [];

function queueRequest(
  resolve: (t: string) => void,
  reject: (e: unknown) => void
) {
  queuedResolvers.push(resolve);
  queuedRejectors.push(reject);
}

function flushQueue(err: unknown, token: string | null) {
  if (token) queuedResolvers.forEach((res) => res(token));
  else queuedRejectors.forEach((rej) => rej(err));
  queuedResolvers = [];
  queuedRejectors = [];
}

async function performRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken)
    throw new AppError("Missing refresh token", { code: "NO_REFRESH" });

  const client = axios.create({ baseURL: API_BASE_URL, timeout: TIMEOUT });
  const { data } = await client.post(REFRESH_ENDPOINT, {
    refresh_token: refreshToken,
  });
  const newAccess = data?.access_token ?? data?.accessToken;
  const newRefresh = data?.refresh_token ?? data?.refreshToken ?? refreshToken;

  if (!newAccess)
    throw new AppError("Refresh failed: no access token", {
      code: "REFRESH_BAD_PAYLOAD",
    });

  await saveTokens({ accessToken: newAccess, refreshToken: newRefresh });
  return newAccess;
}

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  const ax = err as AxiosError<any>;
  if (ax?.isAxiosError) {
    const status = ax.response?.status;
    const msg = ax.response?.data?.message || ax.message || "Request failed";
    const isNetwork = ax.code === "ERR_NETWORK" || ax.code === "ECONNABORTED";
    return new AppError(msg, {
      status,
      code: ax.code,
      details: ax.response?.data,
      isNetworkError: isNetwork,
    });
  }
  return new AppError((err as any)?.message ?? "Unknown error");
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config: any) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

http.interceptors.response.use(
  (res: any) => res,
  async (error: any) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error?.response?.status;

    if (
      status === 401 &&
      !original?._retry &&
      !String(original?.url || "").includes(REFRESH_ENDPOINT)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queueRequest(
            (t) => {
              if (!original.headers) original.headers = {};
              (original.headers as any).Authorization = `Bearer ${t}`;
              resolve(http(original));
            },
            (err) => reject(toAppError(err))
          );
        });
      }

      original._retry = true;
      isRefreshing = true;
      refreshPromise = performRefresh();

      try {
        const newToken = await refreshPromise;
        flushQueue(null, newToken);
        if (!original.headers) original.headers = {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (e) {
        flushQueue(e, null);
        await clearTokens();
        return Promise.reject(toAppError(e));
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Normalize error
    return Promise.reject(toAppError(error));
  }
);

if (__DEV__) {
  http.interceptors.request.use((c: any) => {
    // eslint-disable-next-line no-console
    console.log(`[HTTP] → ${c.method?.toUpperCase()} ${c.baseURL}${c.url}`);
    return c;
  });
  http.interceptors.response.use(
    (r: any) => {
      // eslint-disable-next-line no-console
      console.log(`[HTTP] ← ${r.status} ${r.config.url}`);
      return r;
    },
    (e: any) => {
      // eslint-disable-next-line no-console
      console.log(
        `[HTTP] ✕ ${e?.response?.status ?? e.code} ${e?.config?.url}`
      );
      return Promise.reject(e);
    }
  );
}
