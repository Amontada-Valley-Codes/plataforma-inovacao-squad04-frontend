"use client";
import React, { useState } from "react";
import { X, Building2, SlidersHorizontal, Mail, User, ChevronDown } from "lucide-react";
import { Modal } from "../ui/modal";
import { enterpriseService } from "@/api/services/enterprise.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddCompanieForm({ onClose, isOpen }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    sector: "",
    email: "",
    gestorEmail: "",
    address: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isFuncOpen, setIsFuncOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await enterpriseService.createEnterprise(formData);
      localStorage.setItem("access_token", data?.token?.token ?? "");
      console.log("✅ Dados enviados:", data.token.message);
    } catch (err) {
      console.error("❌ Erro ao enviar:", err);
    }
    onClose();
  };

  const inputBase =
    "flex items-center rounded-lg border px-3 py-2 text-sm outline-none transition-colors";
  const inputText =
    "w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]";
  const iconStyle = "text-[#98A2B3] mr-2";

  const getBorderColor = (field: string) =>
    errors[field]
      ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
      : "bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900";

  const getBgColor = (field: string) =>
    errors[field] ? "bg-red-500 dark:bg-red-900" : "bg-[#F9FAFB] dark:bg-gray-900";

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md p-6 border dark:border-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">
                Cadastrar Empresa
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
              {/* Nome, CNPJ, E-mails, Endereço, Descrição */}
              {[
                { name: "name", placeholder: "Nome da Empresa", icon: <Building2 className={iconStyle} size={18} /> },
                { name: "cnpj", placeholder: "CNPJ", icon: <SlidersHorizontal className={iconStyle} size={18} /> },
                { name: "email", placeholder: "E-mail", icon: <Mail className={iconStyle} size={18} />, type: "email" },
                { name: "gestorEmail", placeholder: "Email do Gestor", icon: <User className={iconStyle} size={18} />, type: "email" },
                { name: "address", placeholder: "Endereço", icon: <Building2 className={`${iconStyle} mt-1`} size={18} /> },
                { name: "description", placeholder: "Descrição", icon: <Building2 className={`${iconStyle} mt-1`} size={18} />, type: "text", textarea: true },
              ].map(({ name, placeholder, icon, type = "text", textarea }) => (
                <div key={name}>
                  <div
                    className={`${inputBase} ${getBorderColor(name)} ${getBgColor(name)} ${
                      textarea ? "items-start" : ""
                    }`}
                  >
                    {icon}
                    {textarea ? (
                      <textarea
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`${inputText} resize-none h-20`}
                      />
                    ) : (
                      <input
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        type={type}
                        placeholder={placeholder}
                        className={inputText}
                      />
                    )}
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}

              {/* Campo SECTOR hardcode com nomes em português */}
              <div>
                <div
                  className={`relative  ${inputBase} ${getBorderColor("sector")} ${getBgColor(
                    "sector"
                  )} items-center`}
                >
                  <SlidersHorizontal className={iconStyle} size={18} />
                  <select
                    name="sector"
                    onFocus={() => setIsFuncOpen(true)}
                    onBlur={() => setIsFuncOpen(false)}
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full bg-transparentdark:text-[#ced3db] hover:bg-[#E5E7EB] text-sm outline-non text-[#344054] dark:text-[#ced3db] dark:border-gray-800 dark:bg-gray-900 font-semibold appearance-none"
                  >
                    <option value="">Selecione o setor</option>
                    <option value="ADMINISTRATIVE">Administrativo</option>
                    <option value="FINANCIAL">Financeiro</option>
                    <option value="ACCOUNTING">Contábil</option>
                    <option value="LEGAL">Jurídico</option>
                    <option value="HUMAN_RESOURCES">Recursos Humanos</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="SALES">Vendas</option>
                    <option value="COMMERCIAL">Comercial</option>
                    <option value="SUPPLY">Suprimentos</option>
                    <option value="LOGISTICS">Logística</option>
                    <option value="PRODUCTION">Produção</option>
                    <option value="TECHNOLOGY">Tecnologia</option>
                    <option value="ENGINEERING">Engenharia</option>
                    <option value="CUSTOMER_SERVICE">Atendimento ao Cliente</option>
                    <option value="QUALITY">Qualidade</option>
                    <option value="RESEARCH_DEVELOPMENT">Pesquisa e Desenvolvimento</option>
                    <option value="HEALTH_SAFETY">Saúde e Segurança</option>
                    <option value="OTHER">Outro</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
                      isFuncOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {errors["sector"] && (
                  <p className="text-red-500 text-xs mt-1">{errors["sector"]}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
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
                onClick={handleSubmit}
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
