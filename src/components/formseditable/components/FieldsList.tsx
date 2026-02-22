"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { FieldCard } from "./FieldCard"
import { FileText, Sparkles } from "lucide-react"

interface FieldsListProps {
  fields: any[]
  onEdit: (field: any) => void
  onDelete: (fieldId: string) => void
  onReorder: (event: DragEndEvent) => void
  typeLabels: Record<string, string>
  typeColors: Record<string, string>
}

export function FieldsList({ fields, onEdit, onDelete, onReorder, typeLabels, typeColors }: FieldsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-[#15409c]/10 dark:bg-[#15409c]/20 rounded-2xl flex items-center justify-center">
            <FileText className="w-10 h-10 text-[#15409c] dark:text-[#15409c]" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum campo configurado
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed">
          Comece adicionando campos ao seu formulário. Você pode arrastar e soltar para reordenar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Campos do Formulário ({fields.length})
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
          Arraste para reordenar
        </div>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onReorder}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={() => onEdit(field)}
                onDelete={() => onDelete(field.id)}
                typeLabel={typeLabels[field.type]}
                typeColor={typeColors[field.type]}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
