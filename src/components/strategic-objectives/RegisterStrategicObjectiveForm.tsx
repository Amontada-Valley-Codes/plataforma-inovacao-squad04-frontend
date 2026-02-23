"use client";

import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";

type StrategicObjective = {
  id: string;
  title: string;
  description?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterObjectiveForm({ isOpen, onClose }: Props) {
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<StrategicObjective | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchObjectives = async () => {
    setLoading(true);
    const response = await StrategicObjectivesService.getAllObjectives();
    setObjectives(response);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchObjectives();
  }, [isOpen]);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (editing) {
      await StrategicObjectivesService.UpdateObjective(editing.id, {
        title,
        description,
      });
    } else {
      await StrategicObjectivesService.createObjective({ title, description });
    }
    resetForm();
    fetchObjectives();
  };

  const handleEdit = (objective: StrategicObjective) => {
    setEditing(objective);
    setTitle(objective.title);
    setDescription(objective.description ?? "");
  };

  const handleDelete = async (id: string) => {
    await StrategicObjectivesService.DeleteObjective(id);
    fetchObjectives();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-2xl p-6 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0B2B70] dark:text-white">
            Objetivos Estratégicos
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X />
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium text-[#0B2B70] dark:text-white">
            {editing ? "Editar Objetivo" : "Novo Objetivo"}
          </h3>

          <input 
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
            placeholder="Título do objetivo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none resize-none"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-1 bg-[#0B2B70] text-white hover:opacity-90"
            >
              <Plus size={16} />
              {editing ? "Salvar" : "Adicionar"}
            </Button>

            {editing && (
              <Button
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl max-h-64 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-gray-600 dark:text-gray-300">
              Carregando...
            </p>
          ) : objectives.length === 0 ? (
            <p className="p-4 text-gray-600 dark:text-gray-300">
              Nenhum objetivo cadastrado.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {objectives.map((objective) => (
                <li
                  key={objective.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {objective.title}
                    </p>

                    {objective.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {objective.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(objective)}
                      className="bg-blue text-blue-700 hover:bg-blue/20 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDelete(objective.id)}
                      className="bg-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
