"use client"
import { ChallengeService } from "@/api/services/challenge.service";
import { cn } from "@/lib/utils"
import { toast } from "sonner";

type ApproveButtonProps = {
  className?: string;
  challengeId: string;
}

export default function ApproveButton({ className, challengeId }: ApproveButtonProps) {
  const approveChallenge = async (challengeId: string) => {
    try {
      await ChallengeService.changeStatus(challengeId, { status: "APPROVE" })
      toast.success("Desafio aprovado!")
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Erro ao aprovar desafio.")
    }
  }

  return (
    <button
      className={cn("flex justify-center w-20 px-1 py-2", 
      "rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold",
      "text-[12px] cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation()
        approveChallenge(challengeId)
      }}
    >
      Aprovar
    </button>
  )
}