"use client";
import React, { useState } from "react";
import {
  Menu,
} from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CandidatarForm({ onClose, isOpen }: Props) {
  const [formData, setFormData] = useState({
    descricaoSolucao: "",
    experiencias: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.descricaoSolucao.trim())
      newErrors.descricaoSolucao = "Descreva a solução proposta";
    if (!formData.experiencias.trim())
      newErrors.experiencias = "Informe suas experiências relevantes";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Dados enviados:", formData);
    onClose();
  };

  const textareaClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 h-28 text-base outline-none resize-none transition-all duration-200
    ${
      hasError
        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
        : "border-[#E2E8F0] focus:border-[#1E3A8A] bg-[#F8FAFC] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400"
    } text-[#1E293B] dark:text-gray-100 placeholder:text-[#94A3B8] dark:placeholder:text-gray-400`;



  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">
            {/* Título */}
        <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800 mb-3">
          Desafio Tal
        </h2>

        {/* Descrição da Solução */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#1E293B] dark:text-gray-100 mb-2 flex items-center gap-2">
             <Menu className="text-[#98A2B3]  mt-1" size={18} />
             <span className="font-medium text-lg mt-1">Descrição da Solução</span>
          </h3>
          <textarea
            placeholder="Como sua startup pensa em resolver?"
            value={formData.descricaoSolucao}
            onChange={(e) => handleChange("descricaoSolucao", e.target.value)}
            className={textareaClass(!!errors.descricaoSolucao)}
          />
          {errors.descricaoSolucao && (
            <p className="text-red-500 text-sm mt-1">{errors.descricaoSolucao}</p>
          )}
        </div>

        {/* Experiências Relevantes */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#1E293B] dark:text-gray-100 mb-2 flex items-center gap-2">
             <Menu className="text-[#98A2B3]  mt-1" size={18} />
             <span className="font-medium text-lg mt-1">Experiências Relevantes</span>
          </h3>
          <textarea
            placeholder="Já participamos de X, desenvolvemos Y, tivemos resultados Z."
            value={formData.experiencias}
            onChange={(e) => handleChange("experiencias", e.target.value)}
            className={textareaClass(!!errors.experiencias)}
          />
          {errors.experiencias && (
            <p className="text-red-500 text-sm mt-1">{errors.experiencias}</p>
          )}
        </div>

        {/* Botão de anexos */}
        <button
          type="button"
          className="p-6 bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg py-2.5 mb-6 text-sm font-medium hover:bg-[#E2E8F0] transition"
        >
          + Anexos Complementares
        </button>

        {/* Botões de ação */}
        <div className="flex justify-between gap-4">
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
            Solicitar
          </button>
        </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}
