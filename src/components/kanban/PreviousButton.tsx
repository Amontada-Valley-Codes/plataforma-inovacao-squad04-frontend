import { cn } from "@/lib/utils"

type PreviousButtonProps = {
  className?: string;
  challengeId: string | undefined;
  handleMoveBack: (featureId: string | undefined) => void;
}

export default function PreviousButton({ className, handleMoveBack, challengeId }: PreviousButtonProps) {
  return (
    <button
      className={cn("flex w-20 justify-center px-1 py-2",
        "rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold",
        "text-[12px] cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation()
        handleMoveBack(challengeId)
      }}
    >
      Voltar
    </button>
  )
}