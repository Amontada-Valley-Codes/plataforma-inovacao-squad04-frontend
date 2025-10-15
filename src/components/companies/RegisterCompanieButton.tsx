"use client";

import { useModal } from "@/hooks/useModal";
import AddCompanieForm from "./AddStartupForm"; // mantido como está
import { PlusCircle } from "lucide-react";

export default function RegisterCOmpanieBtn() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button
        onClick={openModal}
        className="flex items-center gap-2 whitespace-nowrap shrink-0
              text-white font-medium rounded-[12px]
              border border-gray-200 dark:border-gray-800
              bg-[#15358d] hover:bg-[#112c75] dark:bg-blue-800 dark:hover:bg-blue-900
              h-9 md:h-11 px-3 md:px-4 text-xs md:text-sm transition-colors duration-200
              max-[832px]:h-9 max-[832px]:px-2.5 max-[832px]:text-[11px] max-[832px]:gap-1.5 max-[832px]:scale-[0.94]"
      >
        <PlusCircle className="h-4 w-4 md:h-5 md:w-5 max-[832px]:h-4 max-[832px]:w-4" />

{/* curto até 832px */}
<span className="hidden max-[832px]:inline">+ Empresa</span>

{/* completo a partir de 833px */}
<span className="hidden min-[833px]:inline">Adicionar Empresa</span>
      </button>


      <AddCompanieForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
