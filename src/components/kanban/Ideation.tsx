import { Tag, CircleCheck, ListCheck } from "lucide-react"
import { Checklist, Tags } from "./CardsContents"
import { ideationCommentSections } from "./commentsData"
import { Comment } from "./Comment"

type CardIdeationContentProps = {
  challangeTitle: string;
  challengeId: string;
  category: string;
}

export const Ideation = ({ challangeTitle, category, challengeId }: CardIdeationContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <div className="flex gap-4">
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
          + Tag
          </button>
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
            + Sugestões
          </button>
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
            + Checklist
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4 gap-4">
        <Tags category={category} challengeId={challengeId}/> 

        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#D9D9D9] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <CircleCheck fill="#666" size={16}/>
            <p className="text-[#666]">SUGESTÕES</p>
          </div>
          <div>
            {ideationCommentSections
            .find((section) => section.id === "sugestoes")
            ?.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full">
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