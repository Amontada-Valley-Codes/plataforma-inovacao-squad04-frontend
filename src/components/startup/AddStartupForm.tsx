"use client";
import React, { useState } from "react";
import {
  X,
  Building2,
  SlidersHorizontal,
  Menu,
  Mail,
  ChevronDown,
  User,
  Github,
} from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStartupForm({ onClose, isOpen }: Props) {
  const [isFuncOpen, setIsFuncOpen] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    setor: "",
    tecnologias: "",
    maturidade: "",
    lider: "",
    email: "",
    github: "",
    endereco: "",
    descricao: "",
  });

  // Estado de erros
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // limpa erro ao digitar
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nome.trim()) newErrors.nome = "Informe o nome da startup";
    if (!formData.cnpj.trim()) newErrors.cnpj = "Informe o CNPJ";
    if (!formData.setor.trim()) newErrors.setor = "Informe o setor";
    if (!formData.tecnologias.trim()) newErrors.tecnologias = "Informe as tecnologias utilizadas";
    if (!formData.maturidade.trim()) newErrors.maturidade = "Selecione o estágio de maturidade";
    if (!formData.lider.trim()) newErrors.lider = "Informe o nome do líder";
    if (!formData.email.trim()) newErrors.email = "Informe o e-mail";
    if (!formData.github.trim()) newErrors.github = "Informe o GitHub";
    if (!formData.endereco.trim()) newErrors.endereco = "Informe o endereço";
    if (!formData.descricao.trim()) newErrors.descricao = "Descreva brevemente a startup";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("✅ Dados salvos:", formData);
    onClose();
  };

  // Estilo dinâmico dos inputs
  const inputClass = (field: string) =>
    `flex items-center rounded-lg border px-3 py-2 transition-all duration-200 ${
      errors[field]
        ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
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
                Cadastrar Startup
              </h2>
              <button onClick={onClose}>
                <X
                  className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]"
                  size={20}
                />
              </button>
            </div>

            {/* Campos */}
            <div className="space-y-3">
              {/* Nome */}
              <div>
                <div className={inputClass("nome")}>
                  <Building2 className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Nome da Startup"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              {/* CNPJ */}
              <div>
                <div className={inputClass("cnpj")}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="CNPJ"
                    value={formData.cnpj}
                    onChange={(e) => handleChange("cnpj", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
              </div>

              {/* Setor */}
              <div>
                <div className={inputClass("setor")}>
                  <SlidersHorizontal className="text-[#98A2B3] mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Setor"
                    value={formData.setor}
                    onChange={(e) => handleChange("setor", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.setor && <p className="text-red-500 text-xs mt-1">{errors.setor}</p>}
              </div>

              {/* Tecnologias */}
              <div>
                <div className={`${inputClass("tecnologias")} h-20 items-start`}>
                  <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <input
                    type="text"
                    placeholder="Tecnologias Utilizadas"
                    value={formData.tecnologias}
                    onChange={(e) => handleChange("tecnologias", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.tecnologias && <p className="text-red-500 text-xs mt-1">{errors.tecnologias}</p>}
              </div>

              {/* Maturidade */}
              <div>
                <div className={`${inputClass("maturidade")} relative`}>
                  <User className="text-[#98A2B3] mr-2" size={18} />
                  <select
                    value={formData.maturidade}
                    onChange={(e) => handleChange("maturidade", e.target.value)}
                    onFocus={() => setIsFuncOpen(true)}
                    onBlur={() => setIsFuncOpen(false)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] appearance-none"
                  >
                    <option value="">Estágio de maturidade</option>
                    <option value="ideacao">Ideação</option>
                    <option value="tracao">Tração</option>
                    <option value="expansao">Expansão</option>
                    <option value="consolidacao">Consolidação</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform duration-300 ${
                      isFuncOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {errors.maturidade && <p className="text-red-500 text-xs mt-1">{errors.maturidade}</p>}
              </div>

              {/* Grid (Líder, Email, GitHub) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Líder */}
                <div>
                  <div className={inputClass("lider")}>
                    <User className="text-[#98A2B3] mr-2" size={18} />
                    <input
                      type="text"
                      placeholder="Líder"
                      value={formData.lider}
                      onChange={(e) => handleChange("lider", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.lider && <p className="text-red-500 text-xs mt-1">{errors.lider}</p>}
                </div>

                {/* Email */}
                <div>
                  <div className={inputClass("email")}>
                    <Mail className="text-[#98A2B3] mr-2" size={18} />
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* GitHub */}
                <div className="col-span-2">
                  <div className={inputClass("github")}>
                    <Github className="text-[#98A2B3] mr-2" size={18} />
                    <input
                      type="text"
                      placeholder="GitHub"
                      value={formData.github}
                      onChange={(e) => handleChange("github", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                    />
                  </div>
                  {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
                </div>
              </div>

              {/* Endereço */}
              <div>
                <div className={inputClass("endereco")}>
                  <Building2 className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco}</p>}
              </div>

              {/* Descrição */}
              <div>
                <div className={`${inputClass("descricao")} h-20 items-start`}>
                  <Menu className="text-[#98A2B3] mr-2 mt-1" size={18} />
                  <textarea
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none resize-none text-[#344054] dark:text-[#ced3db]"
                  />
                </div>
                {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
              </div>
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
                Adicionar Startup
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
