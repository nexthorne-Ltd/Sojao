"use client";

import { useCallback, useEffect, useState } from "react";

import { api, ApiError } from "@/lib/marketing-api";

/** Minimal GET hook: data, error, loading, reload. */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!path);

  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await api<T>(path));
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.readable : "Can't reach the Sojao API. Is it running?");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}

export function errorText(e: unknown) {
  return e instanceof ApiError ? e.readable : "Something went wrong. Try again.";
}
