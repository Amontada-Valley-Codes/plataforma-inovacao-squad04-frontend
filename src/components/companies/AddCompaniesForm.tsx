  "use client";
  import React, { useState } from "react";
  import {
    X,
    Building2,
    SlidersHorizontal,
    Mail,
    User,
    ChevronDown,
    CheckCircle2,
    Loader2,
  } from "lucide-react";
  import { createPortal } from "react-dom";
  import { enterpriseService } from "@/api/services/enterprise.service";
  import { useStore } from "../../../store";

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
      numeroGestor: "",
      address: "",
      description: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFuncOpen, setIsFuncOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { triggerReload } = useStore();

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async () => {
      const newErrors: { [key: string]: string } = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (!value.trim()) newErrors[key] = "Campo obrigatório";
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setLoading(true);
      try {
        console.log(formData)
        const data = await enterpriseService.createEnterprise(formData);
        console.log("✅ Dados enviados:", data.token.message);

        const to = formData.numeroGestor;
        const message = `Olá! Sua empresa foi cadastrada com sucesso.\nConclua seu cadastro aqui: ${data.token.zap}\n`;
        const encodedMessage = encodeURIComponent(message)
        const whatsappURL = `https://wa.me/55${to}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");

        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            triggerReload();
            onClose();
          }, 2000);
        }, 1500);
      } catch (err) {
        console.log(formData)
        console.error("❌ Erro ao enviar:", err);
        setLoading(false);
      }
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
      errors[field] ? "bg-red dark:bg-red-900" : "bg-[#F9FAFB] dark:bg-gray-900";

    if (!isOpen) return null;

    function formatPhone(value: string) {
      value = value.replace(/\D/g, "");
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      return value;
    }

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="relative w-[95%] max-w-[600px] max-h-[100vh] scrollbar-none bg-white dark:bg-gray-900 rounded-2xl shadow-lg sm:max-w-[400px] p-5 md:p-8 border dark:border-gray-800">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 z-50">
              <Loader2 className="animate-spin text-blue-700 dark:text-blue-500" size={40} />
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                Cadastrando empresa...
              </p>
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 z-50 animate-fade-in">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
              <p className="mt-3 text-lg font-semibold text-green-700 dark:text-green-300">
                Empresa cadastrada com sucesso!
              </p>
            </div>
          )}

          {/* Cabeçalho */}
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
            <div>
              <div
                className={`relative ${inputBase} ${getBorderColor("sector")} ${getBgColor("sector")} items-center`}
              >
                <SlidersHorizontal className={iconStyle} size={18} />
                <select
                  name="sector"
                  onFocus={() => setIsFuncOpen(true)}
                  onBlur={() => setIsFuncOpen(false)}
                  value={formData.sector}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFuncOpen(false);
                  }}
                  className="w-full bg-transparent dark:text-[#ced3db] dark:bg-gray-900 text-sm outline-none text-[#344054] font-semibold appearance-none"
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

            {[
              { name: "name", placeholder: "Nome da Empresa", icon: <Building2 className={iconStyle} size={18} /> },
              { name: "cnpj", placeholder: "CNPJ", icon: <SlidersHorizontal className={iconStyle} size={18} /> },
              { name: "email", placeholder: "E-mail", icon: <Mail className={iconStyle} size={18} />, type: "email" },
              { name: "gestorEmail", placeholder: "Email do Gestor", icon: <User className={iconStyle} size={18} />, type: "email" },
              { name: "address", placeholder: "Endereço", icon: <Building2 className={`${iconStyle} mt-1`} size={18} /> },
              { name: "description", placeholder: "Descrição", icon: <Building2 className={`${iconStyle} mt-1`} size={18} />, textarea: true },
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

            <div>
              <div
                className={`${inputBase} ${getBorderColor("gestorPhone")} ${getBgColor("gestorPhone")}`}
              >
                <User className={iconStyle} size={18} />
                <input
                  name="gestorPhone"
                  type="tel"
                  value={formatPhone(formData.numeroGestor)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numeroGestor: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="WhatsApp do gestor (Ex: (88) 99999-9999)"
                  maxLength={15}
                  className={inputText}
                />
              </div>
              {errors["gestorPhone"] && (
                <p className="text-red-500 text-xs mt-1">{errors["gestorPhone"]}</p>
              )}
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
              onClick={handleSubmit}
              disabled={loading}
              className="w-1/2 ml-2 bg-[#15358D] dark:bg-blue-800 dark:hover:bg-blue-900 text-white py-2 rounded-lg font-medium transition-colors ease-in-out dark:text-[#ced3db] hover:bg-[#0f2a6d] disabled:opacity-50"
            >
              Adicionar Empresa
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }
