"use client"

import { useState } from "react";
import { X } from "lucide-react";

type StrategicObjective = {
  id: string;
  name: string;
  description: string;
};

type EditObjectiveModalProps = {
  objective: StrategicObjective;
  onClose: () => void;
  onSave: (id: string, title: string, description: string) => void;
};

export const EditObjectiveModal = ({ objective, onClose, onSave }: EditObjectiveModalProps) => {
  const [title, setTitle] = useState(objective.name);
  const [description, setDescription] = useState(objective.description);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      return;
    }
    onSave(objective.id, title, description);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-[90vw] max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar Objetivo Estratégico
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
              Título <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B2B72]/30"
              placeholder="Digite o título do objetivo"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
              Descrição <span className="text-red-600">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B2B72]/30 resize-none h-24"
              placeholder="Digite a descrição do objetivo"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !description.trim()}
            className="flex-1 px-4 py-2 bg-[#0B2B72] text-white rounded-lg text-sm font-medium hover:bg-[#09245e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
