"use client";
import React, { useState } from "react";
import { X, Building2, SlidersHorizontal, Menu, CalendarDays, Mail, ChevronDown, User } from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStartupForm( { onClose, isOpen }: Props) {

  const [isFuncOpen, setIsFuncOpen] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    onClose();
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">Cadastrar Startup</h2>
              <button onClick={onClose}>
                <X className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]" size={20} />
              </button>
            </div>


            <div className="space-y-3">

              {/* Nome Startup */}
              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                <Building2 className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Nome da Startup"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              {/* CNPJ */}
              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="CNPJ"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              {/* Setor */}
              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Setor"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              {/* Tecnologias Utilizadas */}
              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Tecnologias Utilizadas"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              {/* Estágio de maturidade */}
              <div className="relative flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                <User className="text-[#98A2B3] mr-2" size={18} />
                <select
                  onFocus={() => setIsFuncOpen(true)}
                  onBlur={() => setIsFuncOpen(false)}
                  className="w-full bg-transparent text-sm outline-non text-[#98A2B3] dark:text-[#60697a] dark:border-gray-800 dark:bg-gray-900 font-semibold appearance-none"
                >
                  <option value="">Estágio de maturidade</option>
                  <option value="ideacao">Ideação</option>
                  <option value="tracao">Tração</option>
                  <option value="expansao">Expansão</option>
                  <option value="consolidacao">Consolidação</option>
                </select>

                <ChevronDown
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
                    isFuncOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {/* Blocos extras (Líder, Pitch, E-mail, Links Úteis) */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Líder */}
                <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900 cursor-pointer">
                  <User className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Líder"
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>

                {/* Pitch */}
                <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900 cursor-pointer">
                  <input
                    type="text"
                    placeholder="Pitch"
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900 cursor-pointer">
                  <Mail className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="E-mail"
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>

                {/* Links úteis */}
                <div className="flex items-center justify-center bg-[#E5E7EB] rounded-lg border border-[#D1D5DB] px-3 py-2 dark:border-gray-800 dark:bg-gray-700 cursor-pointer">
                  <input
                    type="text"
                    placeholder="Links Úteis"
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
              </div>
              
              {/* Endereço */}
              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 dark:border-gray-800 dark:bg-gray-900">  
                <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Endereço"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>
              
              {/* Descrição */}
              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Descrição"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>
            </div>


            <div className="flex justify-between mt-6">
                <button
                onClick={onClose}
                className="w-1/2 mr-2 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium 
                  transition-colors ease-in-out border dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db]
                  hover:bg-[#E5E7EB]"
                >
                Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="w-1/2 ml-2 bg-[#15358D] dark:bg-blue-800 dark:hover:bg-blue-900 text-white py-2 rounded-lg font-medium 
                    transition-colors ease-in-out dark:text-[#ced3db]
                    hover:bg-[#0f2a6d]"
                >
                Adicionar Startup
                </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
