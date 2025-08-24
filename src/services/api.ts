import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL, DEFAULT_LANGUAGE } from "../utils/constants";
import { getToken } from "../utils/storage";
import { toast } from "react-toastify";

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedCallback(cb: () => void) {
  onUnauthorized = cb;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const isAuthEndpoint = (config.url || "").startsWith("/auth");
  if (token && !isAuthEndpoint) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers || {};
  if (!config.headers["Accept-Language"]) {
    (config.headers as any)["Accept-Language"] = DEFAULT_LANGUAGE;
  }
  // Prevent caches on auth endpoints
  if (isAuthEndpoint) {
    (config.headers as any)["Cache-Control"] =
      "no-store, no-cache, must-revalidate";
    (config.headers as any)["Pragma"] = "no-cache";
  }
  if (process.env.NODE_ENV !== "production" && isAuthEndpoint) {
    // eslint-disable-next-line no-console
    console.log("API request", {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
  }
  return config;
});

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  const anyData = data as any;
  if (anyData.message && typeof anyData.message === "string")
    return anyData.message;
  if (anyData.error && typeof anyData.error === "string") return anyData.error;
  // Look deeper into nested data
  if (anyData.data) {
    const nested = extractErrorMessage(anyData.data, fallback);
    if (nested && nested !== fallback) return nested;
  }
  // Common validation shapes
  if (Array.isArray(anyData.fieldErrors)) {
    const msgs = (
      anyData.fieldErrors as Array<{ field?: string; message?: string }>
    )
      .map((e) => (e?.field ? `${e.field}: ${e?.message || ""}` : e?.message))
      .filter((m): m is string => Boolean(m));
    if (msgs.length) return msgs.join("\n");
  }
  if (Array.isArray(anyData.details)) {
    const msgs = (anyData.details as Array<string | { message?: string }>)
      .map((e) => (typeof e === "string" ? e : e?.message || ""))
      .filter(Boolean);
    if (msgs.length) return msgs.join("\n");
  }
  if (Array.isArray(anyData.violations)) {
    const v = anyData.violations as Array<
      { field?: string; message?: string } | null | undefined
    >;
    const msgs = v
      .map((e) => (e?.field ? `${e.field}: ${e?.message || ""}` : e?.message))
      .filter((m): m is string => Boolean(m));
    if (msgs.length) return msgs.join("\n");
  }
  if (Array.isArray(anyData.errors)) {
    const arr = anyData.errors as Array<
      string | { message?: string } | null | undefined
    >;
    const msgs = arr
      .map((e) => (typeof e === "string" ? e : e?.message || null))
      .filter((v): v is string => Boolean(v));
    if (msgs.length) return msgs.join("\n");
  }
  if (anyData.errors && typeof anyData.errors === "object") {
    const values = Object.values(anyData.errors as Record<string, unknown>);
    const flat = (values as unknown[]).flat() as Array<
      string | { message?: string } | null | undefined
    >;
    const msgs = flat
      .map((e) => (typeof e === "string" ? e : e?.message || null))
      .filter((v): v is string => Boolean(v));
    if (msgs.length) return msgs.join("\n");
  }
  return fallback;
}

api.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    const body = res?.data;
    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      body.success === false
    ) {
      const message = extractErrorMessage(body, "Request failed");
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("API business error", {
          url: res.config.url,
          status: res.status,
          data: body,
        });
      }
      toast.error(message);
      return Promise.reject(new Error(message));
    }
    return res;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (onUnauthorized) onUnauthorized();
      } else {
        const message = extractErrorMessage(error.response.data, error.message);
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("API error", {
            url: error.config?.url,
            status: error.response.status,
            data: error.response.data,
          });
        }
        toast.error(message || "Request failed");
      }
    } else {
      toast.error(error.message || "Network error");
    }
    return Promise.reject(error);
  }
);
