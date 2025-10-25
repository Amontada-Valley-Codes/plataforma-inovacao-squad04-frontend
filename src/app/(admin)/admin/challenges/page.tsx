import ChallengeCard from "@/components/challenge/ChallengeCard";
import { Suspense } from "react";

export default function challenges() {
  return(
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <ChallengeCard />
      </Suspense>
    </div>
  );
}