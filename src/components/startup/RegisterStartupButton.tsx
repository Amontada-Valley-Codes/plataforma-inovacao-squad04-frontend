'use client'

import { useModal } from "@/hooks/useModal";
import AddStartupForm from "./AddStartupForm";
import { PlusCircle } from "lucide-react";

export default function RegisterStartupBtn() {

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button 
        className="flex items-center gap-2 text-white border font-medium border-gray-200 dark:border-gray-800 px-3 py-3 rounded-[12px] dark:text-[#ced3db] bg-[#15358d] hover:bg-[#112c75] dark:bg-blue-800 dark:hover:bg-blue-900 transition-colors duration-200"
        onClick={openModal}
      >
         <span><PlusCircle size={18}/></span>
          Adicionar Startup
      </button>

      <AddStartupForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}