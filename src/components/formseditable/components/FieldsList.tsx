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
      <div className="flex justify-center items-center py-12">
        <span className="text-blue dark:text-blue-400">Ainda não há nenhum campo configurado.</span>
      </div>
    )
  }

  return (
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
  )
}
