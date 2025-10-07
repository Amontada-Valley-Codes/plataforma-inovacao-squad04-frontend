import { cn } from "@/lib/utils"

type ForwardButtonProps = {
  className?: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export default function ForwardButton({ className, handleApproveAndMove, featureId }: ForwardButtonProps) {
  return (
    <button
      className={cn("flex justify-center w-20 px-1 py-2", 
      "rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold",
      "text-[12px] cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation()
        handleApproveAndMove(featureId)
      }}
    >
      Avançar
    </button>
  )
}