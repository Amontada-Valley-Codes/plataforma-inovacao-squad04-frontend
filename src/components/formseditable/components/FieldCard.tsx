"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { QuestionForm } from "@/lib/types/form-api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldCardProps {
  field: QuestionForm & { label?: string }
  onEdit: () => void
  onDelete: () => void
  typeLabel: string
  typeColor: string
}

export function FieldCard({ field, onEdit, onDelete, typeLabel, typeColor }: FieldCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all hover:border-gray-300 dark:hover:border-gray-600",
        isDragging && "opacity-50 shadow-lg ring-2 ring-blue-500",
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
        title="Arraste para reordenar"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 dark:text-white">{field.title}</span>
          {field.required && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5">
              Obrigatório
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge className={cn("text-xs border-0 px-2 py-0.5", typeColor)}>
            {typeLabel}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit} title="Editar campo" className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Excluir campo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
