import { CardContentsHeader } from "./CardsContents"
import { Menu,  Clock, Wrench, TrendingUp, Hash } from "lucide-react"

type CardChallangeContentProps = {
  challangeTitle: string;
  ideaIdentifier?: string;
  category: string;
  description: string;
  strategicAlignment: string | null;
  innovativePotential: string | null;
  businessRelevance: string | null;
  problemDuration?: string;
  currentSolution?: string;
  problemRelevance?: string;
  startDate: string;
  endDate?: string;
  creator: string;
  visibility?: string;
}

export const ChallengeSection = ({
  challangeTitle,
  ideaIdentifier,
  category,
  description,
  strategicAlignment,
  innovativePotential,
  businessRelevance,
  problemDuration,
  currentSolution,
  problemRelevance,
  startDate,
  endDate,
  creator,
  visibility,
}: CardChallangeContentProps) => {
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

   
      {ideaIdentifier && (
        <div className="flex items-center gap-2 mb-6">
          <Hash size={14} className="text-gray-400"/>
          <span className="text-xs text-gray-400 font-semibold tracking-widest">
            {ideaIdentifier}
          </span>
        </div>
      )}

     
      <div>
        
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

        
        
      </div>
    </div>
  )
}