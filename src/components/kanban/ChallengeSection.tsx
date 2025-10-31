import { CardContentsHeader } from "./CardsContents"
import { Menu, Building2, Lightbulb, BriefcaseBusiness } from "lucide-react"

type CardChallangeContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  strategicAlignment: string;
  innovativePotential: string;
  businessRelevance: string;
  startDate: string;
  endDate: string;
  creator: string;
}

export const ChallengeSection = ({ challangeTitle, category, description, strategicAlignment, innovativePotential, businessRelevance, startDate, endDate, creator }: CardChallangeContentProps) => {
  return (
    //conteudo do card de desafio
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
        {/* descrição */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
            <Menu size={16}/>
            Descrição
          </h1>
          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
            {description}
          </p>
        </div>

        {/* alinhamento estrategico */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
            <Building2 size={16}/>
            Alinhamento Estratégico
          </h1>
          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
            {strategicAlignment}
          </p>
        </div>

        {/* potencial inovador */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
            <Lightbulb size={16}/>
            Potência Inovador
          </h1>
          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
            {innovativePotential}
          </p>
        </div>

        {/* relevancia do negocio */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg">
            <BriefcaseBusiness size={16}/>
            Relevância para o negócio
          </h1>
          <p className="text-sm text-gray-600 dark:text-white font-medium text-justify">
            {businessRelevance}
          </p>
        </div>
      </div>
    </div>
  )
}