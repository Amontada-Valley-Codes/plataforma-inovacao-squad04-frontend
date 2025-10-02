"use client";
import React from "react";
import { X, Building2, SlidersHorizontal, Menu, CalendarDays } from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterChallengeForm( { onClose, isOpen }: Props) {
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
              <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">Cadastro Desafio</h2>
              <button onClick={onClose}>
                <X className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]" size={20} />
              </button>
            </div>


            <div className="space-y-3">

              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
                <Building2 className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Título do Desafio"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
                <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Setor"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Alinhamento estratégico"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Potencial inovador"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Relevância para o negócio"
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20 dark:border-gray-800 dark:bg-gray-900">
                <Menu className="text-[#98A2B3] mr-2 mt-1" size={18} />
                <textarea
                  placeholder="Descrição"
                  className="w-full bg-transparent text-sm outline-none resize-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Datas */}
                <div className="flex space-x-2 flex-1">

                  <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-8 flex-1 dark:border-gray-800 dark:bg-gray-900">
                    <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                    <input
                      type="date"
                      placeholder="Data início"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => (e.target.type = "date")}
                      className="w-full bg-transparent text-sm outline-none dark:text-[#ced3db] text-[#344054] placeholder:text-[#98A2B3]"
                    />
                  </div>

                  <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-8 flex-1 dark:border-gray-800 dark:bg-gray-900">
                    <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                    <input
                      type="text"
                      placeholder="Data final"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => (e.target.type = "date")}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
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
                Adicionar Empresa
                </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
