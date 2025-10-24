/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Desafios Públicos",
  description: "Desafios abertos do ecossistema para startups.",
};

export default async function StartupPublicChallengesPage() {
  const me = await getCurrentUser();
  const startupId = Number((me as any)?.startupId ?? 1);

  return (
    <div className="space-y-6">
      <ChallengeCard canApply startupId={startupId} />
    </div>
  );
}
