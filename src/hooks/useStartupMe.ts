// src/hooks/useStartupMe.ts
import useSWR from "swr";
import { startupService } from "@/api/services/startup.service";
import type { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";

const KEY = "/startup/user/startupMe";

export function useStartupMe() {
  const { data, error, isLoading, mutate } = useSWR<ShowAllStartupsResponse>(
    KEY,
    () => startupService.getMyStartup(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate, // use para revalidar após updates
  };
}
