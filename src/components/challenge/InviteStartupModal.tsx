"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Button from "../ui/button/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  startupName: string;
  onConfirm: () => Promise<void>;
};

export default function InviteStartupModal({
  isOpen,
  onClose,
  challengeName,
  startupName,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Enviar Convite
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Você deseja convidar a startup <strong>{startupName}</strong> para participar do
          desafio <strong>{challengeName}</strong>?
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-[#15358D] hover:bg-[#112c75] text-white"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Convite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
