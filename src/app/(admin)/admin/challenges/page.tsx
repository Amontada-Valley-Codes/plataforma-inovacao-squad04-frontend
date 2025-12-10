import ChallengeCard from "@/components/challenge/ChallengeCard";
import { Suspense } from "react";

export default function Challenges() {
  return(
    <Suspense fallback={<p>carregando...</p>}>
        <ChallengeCard />
    </Suspense>
  );
}