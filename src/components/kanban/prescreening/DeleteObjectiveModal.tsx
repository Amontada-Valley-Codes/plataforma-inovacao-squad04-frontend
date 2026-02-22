"use client"

import { AlertTriangle, X } from "lucide-react";

type StrategicObjective = {
  id: string;
  name: string;
  description: string;
};

type DeleteObjectiveModalProps = {
  objective: StrategicObjective;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteObjectiveModal = ({ objective, onClose, onConfirm }: DeleteObjectiveModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-[90vw] max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar Exclusão
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Tem certeza que deseja excluir este objetivo estratégico?
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-[#0B2B70] dark:text-white mb-1">
              {objective.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {objective.description}
            </p>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-3">
            Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
