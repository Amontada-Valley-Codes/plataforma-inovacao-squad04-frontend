"use client";

import { 
  X, 
  Building2, 
  SlidersHorizontal, 
  Menu, 
  CalendarDays,
} from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function RegisterChallenge({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#15358D]">Cadastro Desafio</h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]" size={20} />
          </button>
        </div>


        <div className="space-y-3">

          <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12">
            <Building2 className="text-[#98A2B3] mr-2" size={18} />
            <input
              type="text"
              placeholder="Título do Desafio"
              className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12">
            <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
            <input
              type="text"
              placeholder="Setor"
              className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20">
            <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
            <input
              type="text"
              placeholder="Alinhamento estratégico"
              className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20">
            <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
            <input
              type="text"
              placeholder="Potencial inovador"
              className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20">
            <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
            <input
              type="text"
              placeholder="Relevância para o negócio"
              className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-start bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 py-2 h-20">
            <Menu className="text-[#98A2B3] mr-2 mt-1" size={18} />
            <textarea
              placeholder="Descrição"
              className="w-full bg-transparent text-sm outline-none resize-none text-[#344054] placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Datas */}
            <div className="flex space-x-2 flex-1">

              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-8 flex-1">
                <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Data início"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
                />
              </div>

              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-8 flex-1">
                <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Data final"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  className="w-full bg-transparent text-sm outline-none text-[#344054] placeholder:text-[#98A2B3]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibilidade"
                  value="privado"
                  defaultChecked
                  className="peer hidden"
                />
                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 peer-checked:bg-[#15358D] peer-checked:text-white transition duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                  Privado
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibilidade"
                  value="publico"
                  className="peer hidden"
                />
                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 peer-checked:bg-[#15358D] peer-checked:text-white transition duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                  Público
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
            <button
            onClick={onClose}
            className="w-1/2 mr-2 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium 
               transition duration-300 ease-in-out 
               hover:bg-[#E5E7EB] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
            Cancelar
            </button>
            <button
            className="w-1/2 ml-2 bg-[#15358D] text-white py-2 rounded-lg font-medium 
               transition duration-300 ease-in-out 
               hover:bg-[#0f2a6d] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
            Adicionar Empresa
            </button>
        </div>
      </div>
    </div>
  );
}