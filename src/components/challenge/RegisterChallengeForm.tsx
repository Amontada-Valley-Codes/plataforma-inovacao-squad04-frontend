"use client";
import React, { useState } from "react";
import {
  X,
  Building2,
  SlidersHorizontal,
  Menu,
  CalendarDays,
  ChevronDown,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Modal } from "../ui/modal";
import { ChallengeService } from "@/api/services/challenge.service";
import { useStore } from "../../../store";

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
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { triggerReload } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const dataInicioISO = new Date(formData.dataInicio).toISOString();
      const dataFimISO = new Date(formData.dataFim).toISOString();

      const payload = {
        name: formData.titulo,
        startDate: dataInicioISO,
        endDate: dataFimISO,
        area: formData.setor,
        description: formData.descricao,
        strategic_alignment: formData.alinhamento,
        innovative_potential: formData.potencial,
        business_relevance: formData.relevancia
      }

      const response = await ChallengeService.createChallenge(payload);
      console.log("Desafio criado:", response);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true); 
        setTimeout(() => {
          setSuccess(false);
          onClose();
          triggerReload();
        }, 2000);
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar desafio:", error);
    }
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
          <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-2xl z-50">
                <Loader2 className="animate-spin text-blue-700 dark:text-blue-500" size={40} />
                <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Criando desafio...
                </p>
              </div>
            )}

            {success && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 rounded-2xl z-50 animate-fade-in">
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
                <p className="mt-3 text-lg font-semibold text-green-700 dark:text-green-300">
                  Desafio criado com sucesso!
                </p>
              </div>
            )}
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
                    name="titulo"
                    placeholder="Título do Desafio"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>
                {errors.titulo && (
                  <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
                )}
              </div>

              {/* Setor */}
              <div>
                <div className={`relative ${inputClass(!!errors.setor)}`}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                  <select
                    name="setor"
                    onFocus={() => setIsFuncOpen(true)}
                    onBlur={() => setIsFuncOpen(false)}
                    value={formData.setor}
                    onChange={(e) => {
                      handleChange(e)
                      setIsFuncOpen(false)
                    }}
                    className="w-full bg-transparent dark:text-[#ced3db] dark:bg-gray-900 text-sm outline-none text-[#344054] font-semibold appearance-none"
                  >
                    <option value="">Selecione o setor</option>
                    <option value="TECHNOLOGY">Tecnologia</option>
                    <option value="HEALTH">Saúde</option>
                    <option value="EDUCATION">Educação</option>
                    <option value="ENVIRONMENT">Ambiental</option>
                    <option value="BUSINESS">Negócios</option>
                    <option value="SOCIAL">Social</option>
                    <option value="ENGINEERING">Engenharia</option>
                    <option value="AGRICULTURE">Agricultura</option>
                    <option value="DESIGN">Design</option>
                    <option value="OTHER">Outro</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
                      isFuncOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                    name="alinhamento"
                    type="text"
                    placeholder="Alinhamento estratégico"
                    value={formData.alinhamento}
                    onChange={handleChange}
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
                    name="potencial"
                    type="text"
                    placeholder="Potencial inovador"
                    value={formData.potencial}
                    onChange={handleChange}
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
                    name="relevancia"
                    type="text"
                    placeholder="Relevância para o negócio"
                    value={formData.relevancia}
                    onChange={handleChange}
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
                    name="descricao"
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
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
                    name="dataInicio"
                    type={formData.dataInicio ? "date" : "text"}
                    placeholder="Data início"
                    value={formData.dataInicio}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                  />
                </div>

                <div className={dateInputClass(!!errors.dataFim)}>
                  <CalendarDays className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    name="dataFim"
                    type={formData.dataFim ? "date" : "text"}
                    placeholder="Data final"
                    value={formData.dataFim}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={handleChange}
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
