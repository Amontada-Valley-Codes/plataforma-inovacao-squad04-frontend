"use client";

import { useModal } from "@/hooks/useModal";
import AddStartupForm from "./AddStartupForm";
import { PlusCircle } from "lucide-react";

export default function RegisterStartupBtn() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button
        onClick={openModal}
        aria-label="Adicionar startup"
        className={[
          // visual
          "inline-flex items-center rounded-[12px] font-medium transition-colors duration-200 bg-[#15358d] hover:bg-[#112c75] text-white",
          "border border-gray-200 dark:border-gray-800 dark:text-[#ced3db] dark:bg-blue-800 dark:hover:bg-blue-900",
          // não deixa quebrar/encolher
          "whitespace-nowrap shrink-0",
          // tamanhos por breakpoint
          "h-9 px-3 text-xs",                                 // <768
          "min-[768px]:h-9 min-[768px]:px-2.5 min-[768px]:text-xs", // 768–839 (mais compacto!)
          "min-[840px]:h-10 min-[840px]:px-3.5 min-[840px]:text-sm", // 840–1127
          "min-[1128px]:h-11 min-[1128px]:px-4"                    // ≥1128
        ].join(" ")}
      >
        <PlusCircle className="mr-1 h-4 w-4 min-[840px]:h-5 min-[840px]:w-5" />

        {/* curto no mobile e no 768–839 */}
        <span className="min-[1128px]:hidden"> Startup</span>
        {/* label completo só no ≥1128 */}
        <span className="hidden min-[1128px]:inline">Adicionar Startup</span>
      </button>

      <AddStartupForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
