"use client"
import { useState, useEffect } from "react"
import { CardContentsHeader } from "./CardsContents"
import { Building2, Lightbulb, BriefcaseBusiness } from "lucide-react"
import { Rating, ProgressBarActions } from "./CardsContents"
import { ChallengeService } from "@/api/services/challenge.service"
import { CreateVotePreScreeningPayload, ShowPercentageVoteResponse } from "@/api/payloads/challenge.payload"

type CardPreScreeningContentProps = {
  challangeTitle: string;
  challengeId: string;
  category: string;
  strategicAlignment: string;
  innovativePotential: string;
  businessRelevance: string;
  startDate: string;
  endDate: string;
  creator: string;
}

export const PreScreening = ({ challangeTitle, challengeId, category, startDate, endDate, creator, businessRelevance, innovativePotential, strategicAlignment }: CardPreScreeningContentProps) => {
  const [votes, setVotes] = useState<CreateVotePreScreeningPayload>({
    strategicAlignment: 0,
    innovativePotential: 0,
    businessRelevance: 0
  });
  const [results, setResults] = useState<ShowPercentageVoteResponse | null>(null);
  const [isVoting, setIsVoting] = useState(false)

  async function fetchResults() {
    try {
      const response = await ChallengeService.ShowPercentage(challengeId);
      setResults(response);
    } catch (error) {
      console.error("Falha ao buscar resultados da votação:", error);
    }
  }

  useEffect(() => {
    if (challengeId) fetchResults()
  }, [challengeId])

  const handleRatingChange = (field: keyof CreateVotePreScreeningPayload, value: number) => {
    setVotes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVote = async () => {
    if (votes.strategicAlignment === 0 || votes.innovativePotential === 0 || votes.businessRelevance === 0) {
      alert("Por favor, preencha todas as três notas (de 1 a 5).");
      return;
    }

    setIsVoting(true);
    try {
      await ChallengeService.createVote(challengeId, votes);
      
      alert("Voto registrado com sucesso!");
      fetchResults();

    } catch (error: any) {
      console.error("Erro ao votar:", error.response?.data || error.message);
      alert(`Erro ao votar: ${error.response?.data?.message || 'Tente novamente.'}`);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        endDate={endDate}
        creator={creator}
      />

      {/* conteudo */}
      <div>
        {/* alinhamento estrategico */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Building2 size={16}/>
            Alinhamento Estratégico
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {strategicAlignment}
          </p>
          <Rating
            value={votes.strategicAlignment}
            onChange={(v) => handleRatingChange('strategicAlignment', v)}
          />
        </div>

        {/* potencial inovador */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Lightbulb size={16}/>
            Potência Inovador
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {innovativePotential}
          </p>
          <Rating
            value={votes.innovativePotential}
            onChange={(v) => handleRatingChange('innovativePotential', v)}
          />
        </div>

        {/* relevancia do negocio */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <BriefcaseBusiness size={16}/>
            Relevância para o negócio
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {businessRelevance}
          </p>
          <Rating
            value={votes.businessRelevance}
            onChange={(v) => handleRatingChange('businessRelevance', v)}
          />
        </div>
      </div>

      <ProgressBarActions percentage={results ? results.percentage : 0}/>

      <button
        onClick={handleVote}
        disabled={isVoting}
        className="mt-2 mb-6 px-4 py-2 bg-[#0B2B72] text-white text-sm rounded-md self-end disabled:opacity-50 disabled:cursor-wait"
      >
        {isVoting ? "Votando..." : "Registrar Voto"}
      </button>
    </div>
  )
}