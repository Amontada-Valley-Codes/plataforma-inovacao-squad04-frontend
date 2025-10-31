"use client"
import { ChallengeService } from "@/api/services/challenge.service";
import { cn } from "@/lib/utils"

type DisapproveButtonProps = {
  className?: string;
  challengeId: string;
}

export default function DisapproveButton({ className, challengeId }: DisapproveButtonProps) {
  const disapproveChallenge = async (challengeId: string) => {
    try {
      await ChallengeService.changeStatus(challengeId, { status: "DISAPPROVE" })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button
      className={cn("flex w-20 justify-center px-1 py-2",
        "rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold",
        "text-[12px] cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation()
        disapproveChallenge(challengeId)
      }}
    >
      Desaprovar
    </button>
  )
}