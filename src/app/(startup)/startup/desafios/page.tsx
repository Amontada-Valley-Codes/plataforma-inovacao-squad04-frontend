/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import PublicChallengeCard from "@/components/challenge/PublicChallengeCard";
import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";

export default function StartupPublicChallengesPage() {
  const user = getCurrentUser();
  const startupId = user?.startupId ?? undefined;

  return (
    <div className="space-y-6">
      <Suspense fallback={<p>Carregando...</p>}>
        <PublicChallengeCard startupId={startupId} />
      </Suspense>
    </div>
  );
}