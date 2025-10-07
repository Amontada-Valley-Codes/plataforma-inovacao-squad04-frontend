"use client";
import React, { useState } from "react";
import {
  X,
  Building2,
  FileText,
  SlidersHorizontal,
  Cpu,
  ChevronDown,
  User,
  Mail,
  MapPin,
  Paperclip,
} from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStartupForm({ onClose, isOpen }: Props) {
  const [isFuncOpen, setIsFuncOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    setor: "",
    tecnologias: "",
    maturidade: "",
    lider: "",
    pitch: "",
    email: "",
    anexos: [] as File[],
    endereco: "",
    descricao: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setFormData({ ...formData, anexos: Array.from(files) });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório";
    if (!formData.setor.trim()) newErrors.setor = "Setor é obrigatório";
    if (!formData.tecnologias.trim()) newErrors.tecnologias = "Tecnologias são obrigatórias";
    if (!formData.maturidade.trim()) newErrors.maturidade = "Selecione o estágio de maturidade";
    if (!formData.lider.trim()) newErrors.lider = "Líder é obrigatório";
    if (!formData.pitch.trim()) newErrors.pitch = "Pitch é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";
    if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("✅ Formulário válido:", formData);
      // Aqui você pode enviar os dados para a API
      onClose();
    }
  };

  const inputClass = (field: string) =>
    `flex items-center h-10 rounded-lg border px-3 text-sm transition-all duration-200 
     ${errors[field]
       ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
       : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"}`;

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-5">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md p-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#15358D] dark:text-blue-800">
                Cadastro Startup
              </h2>
              <button onClick={onClose}>
                <X className="text-gray-400 hover:text-gray-600" size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Nome */}
              <div>
                <div className={inputClass("nome")}>
                  <Building2 className="text-[#98A2B3] mr-2" size={16} />
                  <input
                    type="text"
                    placeholder="Nome da Startup"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>

              {/* CNPJ */}
              <div>
                <div className={inputClass("cnpj")}>
                  <FileText className="text-[#98A2B3] mr-2" size={16} />
                  <input
                    type="text"
                    placeholder="CNPJ"
                    value={formData.cnpj}
                    onChange={(e) => handleChange("cnpj", e.target.value)}
                    className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.cnpj && <p className="text-xs text-red-500 mt-1">{errors.cnpj}</p>}
              </div>

              {/* Setor */}
              <div>
                <div className={inputClass("setor")}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2" size={16} />
                  <input
                    type="text"
                    placeholder="Setor"
                    value={formData.setor}
                    onChange={(e) => handleChange("setor", e.target.value)}
                    className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.setor && <p className="text-xs text-red-500 mt-1">{errors.setor}</p>}
              </div>

              {/* Tecnologias */}
              <div>
                <div className={inputClass("tecnologias")}>
                  <Cpu className="text-[#98A2B3] mr-2" size={16} />
                  <input
                    type="text"
                    placeholder="Tecnologias Utilizadas"
                    value={formData.tecnologias}
                    onChange={(e) => handleChange("tecnologias", e.target.value)}
                    className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.tecnologias && <p className="text-xs text-red-500 mt-1">{errors.tecnologias}</p>}
              </div>

              {/* Estágio */}
              <div>
                <div className={`${inputClass("maturidade")} relative`}>
                  <User className="text-[#98A2B3] mr-2" size={16} />
                  <select
                    value={formData.maturidade}
                    onChange={(e) => handleChange("maturidade", e.target.value)}
                    onFocus={() => setIsFuncOpen(true)}
                    onBlur={() => setIsFuncOpen(false)}
                    className="w-full bg-transparent text-sm outline-none dark:bg-gray-900 dark:text-[#ced3db] appearance-none"
                  >
                    <option value="">Estágio de Maturidade</option>
                    <option value="ideacao">Ideação</option>
                    <option value="tracao">Tração</option>
                    <option value="expansao">Expansão</option>
                    <option value="consolidacao">Consolidação</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${
                      isFuncOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {errors.maturidade && <p className="text-xs text-red-500 mt-1">{errors.maturidade}</p>}
              </div>

              {/* Grid Líder / Pitch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={inputClass("lider")}>
                    <User className="text-[#98A2B3] mr-2" size={16} />
                    <input
                      type="text"
                      placeholder="Líder"
                      value={formData.lider}
                      onChange={(e) => handleChange("lider", e.target.value)}
                      className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.lider && <p className="text-xs text-red-500 mt-1">{errors.lider}</p>}
                </div>

                <div>
                  <div className={inputClass("pitch")}>
                    <FileText className="text-[#98A2B3] mr-2" size={16} />
                    <input
                      type="text"
                      placeholder="Pitch"
                      value={formData.pitch}
                      onChange={(e) => handleChange("pitch", e.target.value)}
                      className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.pitch && <p className="text-xs text-red-500 mt-1">{errors.pitch}</p>}
                </div>
              </div>

              {/* Grid Email / Links Úteis */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={inputClass("email")}>
                    <Mail className="text-[#98A2B3] mr-2" size={16} />
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <label className={`${inputClass("anexos")} cursor-pointer`}>
                  <Paperclip className="text-[#98A2B3] mr-2" size={16} />
                  <span className="text-gray-500 dark:text-[#ced3db] text-sm truncate">
                    {formData.anexos.length > 0
                      ? `${formData.anexos.length} arquivo(s)`
                      : "+ Links Úteis"}
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Endereço */}
              <div>
                <div className={inputClass("endereco")}>
                  <MapPin className="text-[#98A2B3] mr-2" size={16} />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.endereco && <p className="text-xs text-red-500 mt-1">{errors.endereco}</p>}
              </div>

              {/* Descrição */}
              <div>
                <div className={`${inputClass("descricao")} h-20 items-start`}>
                  <FileText className="text-[#98A2B3] mr-2 mt-2" size={16} />
                  <textarea
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    className="w-full bg-transparent outline-none resize-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao}</p>}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="w-1/2 mr-2 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium hover:bg-[#E5E7EB] dark:bg-gray-800 dark:text-[#ced3db]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/2 ml-2 bg-[#15358D] text-white py-2 rounded-lg font-medium hover:bg-[#0f2a6d] dark:bg-blue-800 dark:hover:bg-blue-900"
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
