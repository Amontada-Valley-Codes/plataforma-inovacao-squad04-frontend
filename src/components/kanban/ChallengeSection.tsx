import { useEffect, useState } from "react";
import { CardContentsHeader } from "./CardsContents"
import { 
  Menu, Clock, Wrench, TrendingUp, Hash, BarChart, 
  Target, AlertTriangle, Users, CheckCircle, FileText, HelpCircle, Loader2 
} from "lucide-react"
import { ChallengeFullResponse } from "@/api/payloads/challenge.payload";
import { ChallengeService } from "@/api/services/challenge.service";
import { getCategoryLabel } from "./Kanban";

type CardChallangeContentProps = {
  challengeId: string;
  challangeTitle: string;
  ideaIdentifier?: string;
  category: string;
  description: string;
  strategicAlignment?: string | null;
  innovativePotential?: string | null;
  businessRelevance?: string | null;
  problemDuration?: string;
  currentSolution?: string;
  problemRelevance?: string;
  currentIndicators?: string;
  expectedImpacts?: string;
  involvedAreas?: string[];
  initialConstraints?: string;
  proponentParticipation?: string;
  status?: string;
  startDate: string;
  endDate?: string;
  creator: string;
  visibility?: string;
};

export function getParticipation(value?: string) {
  switch (value) {
    case "IDEATOR":
      return "Idealizador"
    case "COLLABORATOR":
      return "Colaborador"
    case "PROJECT_LEAD":
      return "Líder do Projeto"
    case "OBSERVER":
      return "Observador"
    case "NO_PARTICIPATION":
      return "Sem Participação"
    default:
      return "Outro"
  }
}

export const ChallengeSection = ({
  challengeId,
  challangeTitle,
  ideaIdentifier,
  category,
  description,
  problemDuration,
  currentSolution,
  problemRelevance,
  currentIndicators,
  expectedImpacts,
  involvedAreas,
  initialConstraints,
  proponentParticipation,
  strategicAlignment,
  innovativePotential,
  businessRelevance,
  startDate,
  endDate,
  creator,
  visibility,
}: CardChallangeContentProps) => {
  const [extraData, setExtraData] = useState<ChallengeFullResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await ChallengeService.fullChallenge(challengeId);
        setExtraData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (challengeId) loadData();
  }, [challengeId]);

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        endDate={endDate}
        creator={creator}
        visibility={visibility}
      />

      <div>
        {ideaIdentifier && (
          <div className="flex items-center gap-2 mb-6">
            <Hash size={14} className="text-gray-400"/>
            <span className="text-xs text-gray-400 font-semibold tracking-widest">
              {ideaIdentifier}
            </span>
          </div>
        )}

        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
            <Menu size={16}/>
            Descrição
          </h1>
          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
            {description}
          </p>
        </div>

        {problemDuration && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <Clock size={16}/>
              Duração do Problema
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {problemDuration}
            </p>
          </div>
        )}

        {currentSolution && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <Wrench size={16}/>
              Solução Atual
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {currentSolution}
            </p>
          </div>
        )}

        {problemRelevance && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <TrendingUp size={16}/>
              Relevância do Problema
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {problemRelevance}
            </p>
          </div>
        )}

        {currentIndicators && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <BarChart size={16}/>
              Indicadores ou Metas Atuais
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {currentIndicators}
            </p>
          </div>
        )}

        {expectedImpacts && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <Target size={16}/>
              Impactos Esperados
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {expectedImpacts}
            </p>
          </div>
        )}

        {initialConstraints && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <AlertTriangle size={16}/>
              Restrições ou Dependências
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {initialConstraints}
            </p>
          </div>
        )}

        {involvedAreas && involvedAreas.length > 0 && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <Users size={16}/>
              Áreas Envolvidas
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {involvedAreas.map((area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-[#0b2b72] text-white rounded-full font-medium"
                >
                  {getCategoryLabel(area)}
                </span>
              ))}
            </div>
          </div>
        )}

        {proponentParticipation && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <CheckCircle size={16}/>
              Participação do Proponente
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium">
              {getParticipation(proponentParticipation)}
            </p>
          </div>
        )}

        {strategicAlignment && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <Target size={16}/>
              Alinhamento Estratégico
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {strategicAlignment}
            </p>
          </div>
        )}

        {innovativePotential && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <TrendingUp size={16}/>
              Potencial de Inovação
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {innovativePotential}
            </p>
          </div>
        )}

        {businessRelevance && (
          <div className="flex flex-col mb-6">
            <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
              <BarChart size={16}/>
              Relevância para o Negócio
            </h1>
            <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
              {businessRelevance}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
            </div>
          </div>
        ) : (
          <div>
            <hr />
            <h1 className="text-[20px] text-[#0B2B70] dark:text-white font-semibold my-4">
              Respostas do Formulário Personalizado
            </h1>
            {extraData?.forms.map((form) => (
              <div key={form.id} className="flex flex-col">
                {form.version.questions
                  .sort((a, b) => a.order - b.order)
                  .map((q, index) => {  
                    const lastResponse = form.responses[form.responses.length - 1];
                    const answerValue = lastResponse?.answers[index]?.value;

                    if (answerValue) {
                      return (
                        <div key={q.id} className="flex flex-col mb-6">
                          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
                            <HelpCircle size={16} />
                            {q.title}
                          </h1>
                          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
                            {answerValue}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}