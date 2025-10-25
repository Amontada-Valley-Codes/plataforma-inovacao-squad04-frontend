/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Desafios Públicos",
  description: "Desafios abertos do ecossistema para startups.",
};

export default async function StartupPublicChallengesPage() {
  const me = await getCurrentUser();
  const startupId = Number((me as any)?.startupId ?? 1);

  return (
    <div className="space-y-6">
      <Suspense fallback={<p>Carregando...</p>}>
        <ChallengeCard canApply startupId={startupId} />
      </Suspense>
    </div>
  );
}
