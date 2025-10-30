/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect } from "react";
import { useStartupMe } from "@/hooks/useStartupMe";
import StartupProfileContent from "@/components/startup/StartupProfileContent";

export default function MyStartupPage() {
  const { data, isLoading, error, mutate } = useStartupMe();

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data) {
      console.log("StartupMe (fresh):", {
        coverImageUrl: (data as any)?.coverImageUrl ?? (data as any)?.cover ?? (data as any)?.bannerUrl,
        profileImageUrl: (data as any)?.profileImageUrl ?? (data as any)?.avatar ?? (data as any)?.photo_url,
      });
    }
  }, [data]);

  if (isLoading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6">Falha ao carregar sua startup.</div>;
  if (!data) return <div className="p-6">Nenhuma startup encontrada.</div>;

  return <StartupProfileContent data={data} isPage />;
}
