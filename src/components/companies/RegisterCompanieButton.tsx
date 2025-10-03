'use client'

import { useModal } from "@/hooks/useModal";
import AddCompanieForm from "./AddStartupForm";

export default function RegisterCOmpanieBtn() {

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button 
        className="flex items-center gap-2 text-white border border-gray-200 dark:border-gray-800 font-medium px-4 py-3 rounded-[12px] dark:text-[#ced3db] bg-blue-700 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-900 transition-colors duration-200"
        onClick={openModal}
      >
          <span className="text-lg">+</span>
          Cadastrar Empresa
      </button>

      <AddCompanieForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}