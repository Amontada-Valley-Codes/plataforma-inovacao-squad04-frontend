// src/app/(startup)/startup/my-startup/page.tsx
"use client";

import React from "react";
import { useStartupMe } from "@/hooks/useStartupMe";
import StartupProfileContent from "@/components/startup/StartupProfileContent";

export default function MyStartupPage() {
  const { data, isLoading, error, mutate } = useStartupMe();

  if (isLoading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">Erro ao carregar.</div>;
  if (!data) return <div className="p-6">Nenhuma startup vinculada.</div>;

  return (
    <div className="p-0">
      <StartupProfileContent data={data} isPage onMutateMe={mutate} />
    </div>
  );
}
