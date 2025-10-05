"use client";
import React, { useState } from "react";
import { X, Building2, SlidersHorizontal, Mail, User } from "lucide-react";
import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddCompanieForm({ onClose, isOpen }: Props) {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    setor: "",
    email: "",
    gestor: "",
    endereco: "",
    descricao: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpa erro ao digitar
  };

  const handleSave = () => {
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

    console.log("Dados salvos:", formData);
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
              {[
                { name: "nome", placeholder: "Nome da Empresa", icon: <Building2 className={iconStyle} size={18} /> },
                { name: "cnpj", placeholder: "CNPJ", icon: <SlidersHorizontal className={iconStyle} size={18} /> },
                { name: "setor", placeholder: "Setor", icon: <SlidersHorizontal className={iconStyle} size={18} /> },
                { name: "email", placeholder: "E-mail", icon: <Mail className={iconStyle} size={18} />, type: "email" },
                { name: "gestor", placeholder: "Gestor", icon: <User className={iconStyle} size={18} /> },
                { name: "endereco", placeholder: "Endereço", icon: <Building2 className={`${iconStyle} mt-1`} size={18} /> },
                { name: "descricao", placeholder: "Descrição", icon: <Building2 className={`${iconStyle} mt-1`} size={18} />, type: "text", textarea: true },
              ].map(({ name, placeholder, icon, type = "text", textarea }) => (
                <div key={name}>
                  <div className={`${inputBase} ${getBorderColor(name)} ${getBgColor(name)} ${textarea ? "h-20 items-start" : ""}`}>
                    {icon}
                    <input
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleChange}
                      type={type}
                      placeholder={placeholder}
                      className={inputText}
                    />
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
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
                onClick={handleSave}
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
