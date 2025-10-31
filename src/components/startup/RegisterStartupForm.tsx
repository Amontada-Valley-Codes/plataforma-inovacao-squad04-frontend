/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  FileText,
  User,
  MapPin,
  AlignLeft,
  Cpu,
  ChevronDown,
  Mail,
} from "lucide-react";

export default function RegisterStartup() {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    industry_segment: "",
    problems_solved: "",
    technologies_used: "",
    maturity_stage: "",
    location: "",
    founders: "",
    pitch: "",
    description: "",
    lider: "",
    liderEmail: "",
    github: "",
    linkedin: "",
    website: "",
    phone: "",
  });

  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTechnologyOpen, setIsTechnologyOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isProblemsOpen, setIsProblemsOpen] = useState(false);
  const [isMaturityOpen, setIsMaturityOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.industry_segment.trim())
      newErrors.industry_segment = "Segmento de indústria é obrigatório";
    if (!formData.problems_solved.trim())
      newErrors.problems_solved = "Problema resolvido é obrigatório";
    if (!formData.technologies_used.trim())
      newErrors.technologies_used = "Tecnologia é obrigatória";
    if (!formData.maturity_stage.trim())
      newErrors.maturity_stage = "Estágio de maturidade é obrigatório";
    if (!formData.founders.trim()) newErrors.founders = "Fundadores são obrigatórios";
    if (!formData.pitch.trim()) newErrors.pitch = "Pitch é obrigatório";
    if (!formData.location.trim()) newErrors.location = "Endereço é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.liderEmail.trim()) newErrors.liderEmail = "Email do líder é obrigatório";
    if (!formData.lider.trim()) newErrors.lider = "Nome do líder é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("✅ Dados enviados:", formData);
    }
  };

  const inputClass = (field: string) =>
    `flex items-center h-10 rounded-lg border px-3 text-sm transition-all duration-200 
      ${
        errors[field]
          ? "border-red-500 bg-red-50"
          : "bg-[#F9FAFB] border-[#E5E7EB]"
      }`;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] text-white px-4 md:border-l-2 border-[#C7E6FE]">
      <div className="relative w-[100px] h-[90px] mb-">
        <Image src="/images/logo/ninna-logo.svg" alt="ninna-logo" fill className="object-contain" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Cadastro Startup</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        {/* Nome */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Nome da Startup"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Building2 className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* CNPJ */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleChange("cnpj", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <FileText className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Email Startup */}
        <div className="relative w-full mb-3">
          <input
            type="email"
            placeholder="Email da Startup"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Mail className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Grid de selects */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Tecnologia usada */}
          <div>
            <div className={`${inputClass("technologies_used")} relative`}>
              <Cpu className="text-[#98A2B3] mr-2" size={16} />
              <select
                value={formData.technologies_used}
                onChange={(e) => handleChange("technologies_used", e.target.value)}
                onFocus={() => setIsTechnologyOpen(true)}
                onBlur={() => setIsTechnologyOpen(false)}
                className="w-full bg-transparent text-black text-sm outline-none appearance-none"
              >
                <option value="">Tecnologia Utilizada</option>
                <option value="AI">AI</option>
                <option value="BLOCKCHAIN">Blockchain</option>
                <option value="IOT">IoT</option>
                <option value="CLOUD">Cloud</option>
                <option value="BIG_DATA">Big Data</option>
                <option value="BIOTECH">Biotech</option>
                <option value="OTHER">Outra</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${
                  isTechnologyOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>

          {/* Segmento de indústria */}
          <div>
            <div className={`${inputClass("industry_segment")} relative`}>
              <Building2 className="text-[#98A2B3] mr-2" size={16} />
              <select
                value={formData.industry_segment}
                onChange={(e) => handleChange("industry_segment", e.target.value)}
                onFocus={() => setIsIndustryOpen(true)}
                onBlur={() => setIsIndustryOpen(false)}
                className="w-full bg-transparent text-black text-sm outline-none appearance-none"
              >
                <option value="">Segmento de indústria</option>
                <option value="TECHNOLOGY">Tecnologia</option>
                <option value="FINANCE">Finanças</option>
                <option value="HEALTH">Saúde</option>
                <option value="EDUCATION">Educação</option>
                <option value="TOURISM">Turismo</option>
                <option value="SECURITY">Segurança</option>
                <option value="OTHER">Outros</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${
                  isIndustryOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>

          {/* Problema Resolvido */}
          <div>
            <div className={`${inputClass("problems_solved")} relative`}>
              <User className="text-[#98A2B3] mr-2" size={16} />
              <select
                value={formData.problems_solved}
                onChange={(e) => handleChange("problems_solved", e.target.value)}
                onFocus={() => setIsProblemsOpen(true)}
                onBlur={() => setIsProblemsOpen(false)}
                className="w-full bg-transparent text-black text-sm outline-none appearance-none"
              >
                <option value="">Problema Resolvido</option>
                <option value="HEALTHCARE">Saúde</option>
                <option value="EDUCATION">Educação</option>
                <option value="FINANCE">Finanças</option>
                <option value="ENVIRONMENT">Ambiental</option>
                <option value="TRANSPORT">Transporte</option>
                <option value="OTHER">Outros</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${
                  isProblemsOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>

          {/* Estágio de Maturidade */}
          <div>
            <div className={`${inputClass("maturity_stage")} relative`}>
              <User className="text-[#98A2B3] mr-2" size={16} />
              <select
                value={formData.maturity_stage}
                onChange={(e) => handleChange("maturity_stage", e.target.value)}
                onFocus={() => setIsMaturityOpen(true)}
                onBlur={() => setIsMaturityOpen(false)}
                className="w-full bg-transparent text-black text-sm outline-none  appearance-none"
              >
                <option value="">Estágio de Maturidade</option>
                <option value="IDEATION">Ideação</option>
                <option value="OPERATION">Operação</option>
                <option value="TRACTION">Tração</option>
                <option value="SCALE">Escala</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform ${
                  isMaturityOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Líder */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Nome do Líder"
            value={formData.lider}
            onChange={(e) => handleChange("lider", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Mail className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Email do Líder */}
        <div className="relative w-full mb-3">
          <input
            type="email"
            placeholder="Email do Líder"
            value={formData.liderEmail}
            onChange={(e) => handleChange("liderEmail", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Mail className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Endereço */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Endereço"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <MapPin className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Pitch */}
        <div className="relative w-full mb-2">
          <textarea
            placeholder="Pitch"
            value={formData.pitch}
            onChange={(e) => handleChange("pitch", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-2 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none h-16 resize-none"
          />
          <AlignLeft className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Descrição */}
        <div className="relative w-full mb-2">
          <textarea
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-2 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none h-16 resize-none"
          />
          <AlignLeft className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full h-10 rounded-xl bg-[#15358D] hover:bg-[#0f39af] text-white text-base font-semibold shadow transition-all duration-300"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
