import { CircleCheck, ListCheck } from "lucide-react"
import { CardContentsHeader, Checklist, Ideias, Tags } from "./CardsContents"

type CardIdeationContentProps = {
  challengeTitle: string;
  challengeId: string;
  visibility: string;
  creator: string;
  category: string;
  endDate: string;
  startDate: string;
}

export const Ideation = ({ challengeTitle, category, visibility, challengeId, creator, endDate, startDate }: CardIdeationContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <CardContentsHeader
        challengeTitle={challengeTitle}
        visibility={visibility} 
        creator={creator}
        endDate={endDate}
        startDate={startDate}
      />

      <div className="w-full flex flex-col mb-4 gap-4">
        <Tags category={category} challengeId={challengeId}/> 

        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#D9D9D9] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <CircleCheck fill="#666" size={16}/>
            <p className="text-[#666]">SUGESTÕES</p>
          </div>
          <div className="w-full">
            <Ideias challengeId={challengeId}/>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#666] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <ListCheck strokeWidth={3} size={16}/>
            <p className="text-[#666]">CHECKLIST</p>
          </div>
          <Checklist challengeId={challengeId}/>
        </div>
      </div>
    </div>
  )
}