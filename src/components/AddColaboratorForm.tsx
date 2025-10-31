/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown, Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { inviteService } from "../api/services/invite.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddColaboratorForm({ isOpen, onClose }: Props) {
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  function formatPhone(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  }

  const handleSave = async () => {
    if (!email || !role || !phone) {
      console.log("Preencha email, telefone e função");
      return;
    }

    try {
      const response = await inviteService.sendInvite({
        email,
        type_user: role,
        phone,
      });

      console.log("Convite enviado:", response);

      const to = phone;
      const message = `Olá! Você foi convidado para a empresa.\nConclua seu cadastro aqui: ${response.zap}\n`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/55${to}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");

      onClose();
    } catch (error: any) {
      console.error("Erro ao enviar convite:", error.response?.data || error.message);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">
            Adicionar Colaborador
          </h2>
          <button onClick={onClose}>
            <X
              className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]"
              size={20}
            />
          </button>
        </div>

        {/* CAMPOS */}
        <div className="space-y-3">
          {/* EMAIL */}
          <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
            <Mail className="text-[#98A2B3] mr-2" size={18} />
            <input
              type="email"
              placeholder="Email do colaborador"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#d8d8d8] placeholder:text-[#98A2B3]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* TELEFONE */}
          <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
            <Phone className="text-[#98A2B3] mr-2" size={18} />
            <input
              type="tel"
              placeholder="Telefone do colaborador"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#d8d8d8] placeholder:text-[#98A2B3]"
              value={formatPhone(phone)}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* FUNÇÃO */}
          <div className="relative flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
            <User className="text-[#98A2B3] mr-2" size={18} />
            <select
              onFocus={() => setIsFuncOpen(true)}
              onBlur={() => setIsFuncOpen(false)}
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] font-semibold appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Função
              </option>
              <option value="EVALUATOR">Avaliador</option>
              <option value="COMMON">Usuário</option>
            </select>

            <ChevronDown
              size={20}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
                isFuncOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>

        {/* BOTÕES */}
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
            Adicionar Colaborador
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
