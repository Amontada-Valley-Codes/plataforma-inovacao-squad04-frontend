"use client";
import React, { useState } from "react";
import {
  X,
  Building2,
  SlidersHorizontal,
  Menu,
  CalendarDays,
} from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterChallengeForm({ onClose, isOpen }: Props) {
  const [formData, setFormData] = useState({
    titulo: "",
    setor: "",
    alinhamento: "",
    potencial: "",
    relevancia: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // limpa erro ao digitar
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.titulo.trim()) newErrors.titulo = "Informe o título do desafio";
    if (!formData.setor.trim()) newErrors.setor = "Informe o setor";
    if (!formData.alinhamento.trim())
      newErrors.alinhamento = "Informe o alinhamento estratégico";
    if (!formData.potencial.trim())
      newErrors.potencial = "Informe o potencial inovador";
    if (!formData.relevancia.trim())
      newErrors.relevancia = "Informe a relevância";
    if (!formData.descricao.trim())
      newErrors.descricao = "Descreva o desafio";
    if (!formData.dataInicio.trim())
      newErrors.dataInicio = "Informe a data de início";
    if (!formData.dataFim.trim()) newErrors.dataFim = "Informe a data final";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Dados salvos:", formData);
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `flex items-center rounded-lg border px-3 h-12 transition-colors ${
      hasError
        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/30"
        : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
    }`;

  const textareaClass = (hasError: boolean) =>
    `flex items-start rounded-lg border px-3 py-2 h-20 transition-colors ${
      hasError
        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/30"
        : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
    }`;

  const dateInputClass = (hasError: boolean) =>
    `flex items-center rounded-lg border px-3 h-10 flex-1 transition-colors ${
      hasError
        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/30"
        : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
    }`;

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">
                Cadastro Desafio
              </h2>
              <button onClick={onClose}>
                <X
                  className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]"
                  size={20}
                />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              {/* Campo título */}
              <div>
                <div className={inputClass(!!errors.titulo)}>
                  <Building2 className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Título do Desafio"
                    value={formData.titulo}
                    onChange={(e) => handleChange("titulo", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.titulo && (
                  <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
                )}
              </div>

              {/* Setor */}
              <div>
                <div className={inputClass(!!errors.setor)}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Setor"
                    value={formData.setor}
                    onChange={(e) => handleChange("setor", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.setor && (
                  <p className="text-red-500 text-xs mt-1">{errors.setor}</p>
                )}
              </div>

              {/* Alinhamento Estratégico */}
              <div>
                <div className={textareaClass(!!errors.alinhamento)}>
                  <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <input
                    type="text"
                    placeholder="Alinhamento estratégico"
                    value={formData.alinhamento}
                    onChange={(e) =>
                      handleChange("alinhamento", e.target.value)
                    }
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.alinhamento && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.alinhamento}
                  </p>
                )}
              </div>

              {/* Potencial inovador */}
              <div>
                <div className={textareaClass(!!errors.potencial)}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <input
                    type="text"
                    placeholder="Potencial inovador"
                    value={formData.potencial}
                    onChange={(e) => handleChange("potencial", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.potencial && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.potencial}
                  </p>
                )}
              </div>

              {/* Relevância */}
              <div>
                <div className={textareaClass(!!errors.relevancia)}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <input
                    type="text"
                    placeholder="Relevância para o negócio"
                    value={formData.relevancia}
                    onChange={(e) => handleChange("relevancia", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.relevancia && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.relevancia}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <div className={textareaClass(!!errors.descricao)}>
                  <Menu className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <textarea
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none resize-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.descricao && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.descricao}
                  </p>
                )}
              </div>

              {/* Datas */}
              <div className="flex space-x-2">
                <div className={dateInputClass(!!errors.dataInicio)}>
                  <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type={formData.dataInicio ? "date" : "text"}
                    placeholder="Data início"
                    value={formData.dataInicio}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => handleChange("dataInicio", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>

                <div className={dateInputClass(!!errors.dataFim)}>
                  <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type={formData.dataFim ? "date" : "text"}
                    placeholder="Data final"
                    value={formData.dataFim}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => handleChange("dataFim", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
              </div>

              {(errors.dataInicio || errors.dataFim) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dataInicio || errors.dataFim}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="w-1/2 mr-2 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium transition-colors ease-in-out border dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db] hover:bg-[#E5E7EB]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="w-1/2 ml-2 bg-[#15358D] dark:bg-blue-800 dark:hover:bg-blue-900 text-white py-2 rounded-lg font-medium transition-colors ease-in-out hover:bg-[#0f2a6d]"
              >
                Adicionar Desafio
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
