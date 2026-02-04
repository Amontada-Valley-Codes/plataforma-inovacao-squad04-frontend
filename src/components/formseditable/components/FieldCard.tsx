"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionForm {
  id: string
  title: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'OPTION' | 'CHECKBOX'
  required: boolean
  options?: {
    options?: string[]
    min?: number
    max?: number
  }
  versionId: string
  order: number
}

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
        "group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-200 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-theme-sm",
        isDragging && "opacity-60 shadow-theme-lg ring-2 ring-brand-500 border-brand-500",
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        title="Arraste para reordenar"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
            {field.title}
          </h3>
          {field.required && (
            <Badge className="bg-error-50 text-error-700 border-error-200 dark:bg-error-900/20 dark:text-error-400 dark:border-error-800 text-xs px-2 py-0.5 font-medium">
              Obrigatório
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs font-medium px-2.5 py-1 border-0 rounded-lg", typeColor)}>
            {typeLabel}
          </Badge>
          {field.options?.options && field.options.options.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {field.options.options.length} opções
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit} 
          title="Editar campo" 
          className="h-9 w-9 p-0 text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 dark:hover:text-brand-400"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-9 w-9 p-0 text-gray-500 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 dark:hover:text-error-400"
          title="Excluir campo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
