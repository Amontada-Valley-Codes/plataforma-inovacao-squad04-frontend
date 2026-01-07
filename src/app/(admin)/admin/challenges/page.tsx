'use client'

import ChallengeCard from "@/components/challenge/ChallengeCard";
import { Suspense } from "react";

export default function Challenges() {
  return(
    <Suspense>
      <ChallengeCard />
    </Suspense>
  );
}