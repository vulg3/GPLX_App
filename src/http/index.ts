import { useCallback, useMemo } from "react";
import { http } from "./http";
import { clearTokens, restoreTokens, saveTokens } from "./tokenStorage";
export {
  clearTokens as clearAuthTokens,
  http,
  restoreTokens,
  saveTokens as setAuthTokens,
};

type Query = Record<string, any>;
type Config = { headers?: Record<string, string>; params?: Query };

export function useClientHttp() {
  const instance = useMemo(() => http, []);

  const get = useCallback(
    async <T = any>(url: string, cfg?: Config) => {
      const r = await instance.get<T>(url, cfg);
      return r.data;
    },
    [instance]
  );

  const del = useCallback(
    async <T = any>(url: string, cfg?: Config) => {
      const r = await instance.delete<T>(url, cfg);
      return r.data;
    },
    [instance]
  );

  const post = useCallback(
    async <T = any, B = any>(
      url: string,
      body?: B,
      cfg?: Config
    ): Promise<T> => {
      const r = await instance.post<T>(url, body, cfg);
      return r.data;
    },
    [instance]
  );

  const put = useCallback(
    async <T = any, B = any>(
      url: string,
      body?: B,
      cfg?: Config
    ): Promise<T> => {
      const r = await instance.put<T>(url, body, cfg);
      return r.data;
    },
    [instance]
  );

  const upload = useCallback(
    async <T = any>(
      url: string,
      formData: FormData,
      cfg?: Config
    ): Promise<T> => {
      const r = await instance.post<T>(url, formData, {
        ...cfg,
        headers: {
          ...(cfg?.headers ?? {}),
          "Content-Type": "multipart/form-data",
        },
      });
      return r.data;
    },
    [instance]
  );

  return { http: instance, get, post, put, del, upload };
}
