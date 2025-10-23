"use client";
import React, { useState } from "react";
import {
  X,
  Building2,
  FileText,
  Cpu,
  ChevronDown,
  User,
  MapPin,
  Paperclip,
  Github,
  Linkedin,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { createPortal } from "react-dom";
import { startupService } from "@/api/services/startup.service";
import { CreateStartupPayload } from "@/api/payloads/startup.payload";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStartupForm({ onClose, isOpen }: Props) {
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isMaturityOpen, setIsMaturityOpen] = useState(false);
  const [isProblemsOpen, setIsProblemsOpen] = useState(false);
  const [isTechnologyOpen, setIsTechnologyOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    github: "",
    linkedin: "",
    website: "",
    description: "",
    liderEmail: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const showCustomToast = (message: string, type: "success" | "error") => {
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/20 
        text-white font-medium transition-all duration-300 transform ${
          t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        } ${
          type === "success"
            ? "bg-[linear-gradient(135deg,#0C0869_0%,#15358D_60%,#66B132_100%)]"
            : "bg-[linear-gradient(135deg,#A00_0%,#C62828_60%,#EF5350_100%)]"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="text-green-300" size={22} />
        ) : (
          <XCircle className="text-red-300" size={22} />
        )}
        <span>{message}</span>
      </div>
    ));
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email da startup é obrigatório";
    if (!formData.industry_segment.trim())
      newErrors.industry_segment = "Segmento de indústria é obrigatório";
    if (!formData.problems_solved.trim())
      newErrors.problems_solved = "Problema resolvido é obrigatório";
    if (!formData.technologies_used.trim())
      newErrors.technologies_used = "Tecnologias utilizadas são obrigatórias";
    if (!formData.maturity_stage.trim())
      newErrors.maturity_stage = "Selecione o estágio de maturidade";
    if (!formData.founders.trim()) newErrors.founders = "Líder é obrigatório";
    if (!formData.pitch.trim()) newErrors.pitch = "Pitch é obrigatório";
    if (!formData.location.trim()) newErrors.location = "Endereço é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.liderEmail.trim()) newErrors.liderEmail = "Email do líder é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async () => {
      if (!validateForm()) {
        showCustomToast("Preencha todos os campos obrigatórios.", "error");
        return;
      }

      setLoading(true);

      try {
        const payload: CreateStartupPayload = {
          name: formData.name,
          cnpj: formData.cnpj,
          email: formData.email,
          industry_segment: formData.industry_segment,
          problems_solved: [formData.problems_solved],
          technologies_used: formData.technologies_used
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          maturity_stage: formData.maturity_stage,
          location: formData.location,
          founders: formData.founders.split(",").map((f) => f.trim()),
          pitch: formData.pitch,
          description: formData.description,
          liderEmail: formData.liderEmail,
          useful_links: {
            github: formData.github,
            linkedin: formData.linkedin,
            website: formData.website,
          },
        };

        await Promise.all([
          startupService.createStartup(payload),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);

        showCustomToast("Startup cadastrada com sucesso!", "success");
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } catch (error: any) {
        console.error("❌ Erro ao criar startup:", error?.response?.data || error?.message || error);
        showCustomToast("Erro ao cadastrar startup.", "error");
      } finally {
        setLoading(false);
      }
    };

  const inputClass = (field: string) =>
    `flex items-center h-10 rounded-lg border px-3 text-sm transition-all duration-200 
     ${
       errors[field]
         ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
         : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
     }`;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className=" relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg 
    w-full max-w-md p-6 mx-3 md:mx-0 max-h-[calc(100vh-40px)] 
    overflow-y-auto z-50
    [&::-webkit-scrollbar]:w-0
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-transparent
    scrollbar-thin">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 z-50">
            <Loader2 className="animate-spin text-blue-700 dark:text-blue-500" size={40} />
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
              Cadastrando startup...
            </p>
          </div>
        )}

        {success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 z-50 animate-fade-in">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
            <p className="mt-3 text-lg font-semibold text-green-700 dark:text-green-300">
              Startup cadastrada com sucesso!
            </p>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#15358D] dark:text-blue-800">
            Cadastro Startup
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" size={20} />
          </button>
        </div>

        {/* Campos */}
        <div className="space-y-3">
          {/* Nome */}
          <div>
            <div className={inputClass("name")}>
              <Building2 className="text-[#98A2B3] mr-2" size={16} />
              <input
                type="text"
                placeholder="Nome da Startup"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
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

          {/* EMAIL */}
          <div>
            <div className={inputClass("cnpj")}>
              <FileText className="text-[#98A2B3] mr-2" size={16} />
              <input
                type="text"
                placeholder="Email da Startup"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Grid de selects */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tecnologia usada */}
            <div>
              <div className={`${inputClass("technologies_used")} relative`}>
                <Cpu className="text-[#98A2B3] mr-2" size={16} />
                <select
                  value={formData.technologies_used}
                  onChange={(e) => handleChange("technologies_used", e.target.value)}
                  onFocus={() => setIsTechnologyOpen(true)}
                  onBlur={() => setIsTechnologyOpen(false)}
                  className="w-full bg-transparent text-sm outline-none dark:bg-gray-900 dark:text-[#ced3db] appearance-none"
                >
                  <option value=''>Tecnologia Utilizada</option>
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
              {errors.technologies_used && (
                <p className="text-xs text-red-500 mt-1">{errors.technologies_used}</p>
              )}
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
                  className="w-full bg-transparent text-sm outline-none dark:bg-gray-900 dark:text-[#ced3db] appearance-none"
                >
                  <option value=''>Segmento de indústria</option>
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
              {errors.industry_segment && (
                <p className="text-xs text-red-500 mt-1">{errors.industry_segment}</p>
              )}
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
                  className="w-full bg-transparent text-sm outline-none dark:bg-gray-900 dark:text-[#ced3db] appearance-none"
                >
                  <option value=''>Problema Resolvido</option>
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
              {errors.problems_solved && (
                <p className="text-xs text-red-500 mt-1">{errors.problems_solved}</p>
              )}
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
                  className="w-full bg-transparent text-sm outline-none dark:bg-gray-900 dark:text-[#ced3db] appearance-none"
                >
                  <option value=''>Estágio de Maturidade</option>
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
              {errors.maturity_stage && (
                <p className="text-xs text-red-500 mt-1">{errors.maturity_stage}</p>
              )}
            </div>
          </div>

          {/* Líder */}
          <div>
            <div className={inputClass("founders")}>
              <User className="text-[#98A2B3] mr-2" size={16} />
              <input
                type="text"
                placeholder="Líder"
                value={formData.founders}
                onChange={(e) => handleChange("founders", e.target.value)}
                className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.founders && (
              <p className="text-xs text-red-500 mt-1">{errors.founders}</p>
            )}
          </div>

          {/* Líder Email */}
          <div>
            <div className={inputClass("founders")}>
              <User className="text-[#98A2B3] mr-2" size={16} />
              <input
                type="text"
                placeholder="Email do líder"
                value={formData.liderEmail}
                onChange={(e) => handleChange("liderEmail", e.target.value)}
                className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.liderEmail && (
              <p className="text-xs text-red-500 mt-1">{errors.liderEmail}</p>
            )}
          </div>

          {/* Endereço */}
          <div>
            <div className={inputClass("location")}>
              <MapPin className="text-[#98A2B3] mr-2" size={16} />
              <input
                type="text"
                placeholder="Endereço"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-transparent outline-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Pitch */}
          <div>
            <div className={`${inputClass("pitch")} h-20 items-start`}>
              <FileText className="text-[#98A2B3] mr-2 mt-2" size={16} />
              <textarea
                placeholder="Pitch"
                value={formData.pitch}
                onChange={(e) => handleChange("pitch", e.target.value)}
                className="w-full mt-2 bg-transparent outline-none resize-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.pitch && <p className="text-xs text-red-500 mt-1">{errors.pitch}</p>}
          </div>

          {/* Descrição */}
          <div>
            <div className={`${inputClass("pitch")} h-20 items-start`}>
              <FileText className="text-[#98A2B3] mr-2 mt-2" size={16} />
              <textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full mt-2 bg-transparent outline-none resize-none text-[#344054] dark:text-[#ced3db]"
              />
            </div>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

            {/* Links úteis */}
          <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Paperclip size={16} /> Links úteis
              </h3>
              <div className="flex gap-4 justify-center">
                {[
                  { id: "github", icon: Github },
                  { id: "linkedin", icon: Linkedin },
                  { id: "website", icon: Globe },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveLink(activeLink === id ? null : id)}
                    className={`p-2 rounded-lg transition-all ${
                      activeLink === id
                        ? "bg-[#15358D] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>

              {activeLink && (
                <div className="mt-3">
                  <div className={inputClass(activeLink)}>
                    <input
                      type="url"
                      placeholder={`Insira o link do ${activeLink}`}
                      className="bg-transparent w-full outline-none text-sm"
                      value={(formData as any)[activeLink]}
                      onChange={(e) => handleChange(activeLink, e.target.value)}
                    />
                  </div>
                </div>
              )}
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
            disabled={loading}
            className="w-1/2 ml-2 bg-[#15358D] text-white py-2 rounded-lg font-medium hover:bg-[#0f2a6d] dark:bg-blue-800 dark:hover:bg-blue-900 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Cadastrando...
              </>
            ) : (
              "Adicionar Startup"
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
);
}
