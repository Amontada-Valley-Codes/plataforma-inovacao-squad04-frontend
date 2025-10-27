import ChallengeCard from "@/components/challenge/ChallengeCard";
import { Suspense } from "react";

export default function challenges() {
  return(
    <Suspense fallback={<p>carregando...</p>}>
        <ChallengeCard />
    </Suspense>
  );
}