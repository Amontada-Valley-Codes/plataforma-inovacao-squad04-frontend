import { CardContentsHeader } from "./CardsContents"
import { Building2, Lightbulb, BriefcaseBusiness } from "lucide-react"
import { Rating, ProgressBarActions } from "./CardsContents"

type CardPreScreeningContentProps = {
  challangeTitle: string;
  category: string;
  strategicAlignment: string;
  innovativePotential: string;
  businessRelevance: string;
  startDate: string;
  endDate: string;
  creator: string;
}

export const PreScreening = ({ challangeTitle, category, startDate, endDate, creator, businessRelevance, innovativePotential, strategicAlignment }: CardPreScreeningContentProps) => {
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
          <Rating/>
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
          <Rating/>
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
          <Rating/>
        </div>
      </div>

      <ProgressBarActions percentage={66}/>
    </div>
  )
}