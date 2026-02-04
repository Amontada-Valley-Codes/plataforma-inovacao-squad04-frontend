"use client"

import { useState } from "react"
import type { DragEndEvent } from "@dnd-kit/core"
import { FormBuilderHeader } from "./components/FormBuilderHeader"
import { FieldsList } from "./components/FieldsList"
import { FieldEditor } from "./field-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FormBuilderProps {
  config: any
  formTitle?: string
  formDescription?: string
  onAddField: (field: any) => void
  onUpdateField?: (id: string, updates: any) => void
  onRemoveField?: (id: string) => void
  onReorderFields?: (fields: any[]) => void
  onPreview?: () => void
  onSaveForm?: () => void
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  TEXT: "Texto",
  NUMBER: "Número",
  SELECT: "Seleção",
  OPTION: "Múltipla Escolha",
  CHECKBOX: "Checkbox",
}

const FIELD_TYPE_COLORS: Record<string, string> = {
  TEXT: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  NUMBER: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  SELECT: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  OPTION: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  CHECKBOX: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
}

export function FormBuilder({ config, formTitle, formDescription, onAddField, onUpdateField, onRemoveField, onReorderFields, onPreview, onSaveForm }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null)

  const sortedFields = [...config.fields].sort((a: any, b: any) => a.order - b.order)
  const fieldToDelete = sortedFields.find((f: any) => f.id === deleteFieldId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !onReorderFields) return

    const oldIndex = sortedFields.findIndex((f: any) => f.id === active.id)
    const newIndex = sortedFields.findIndex((f: any) => f.id === over.id)

    const newFields = [...sortedFields]
    const [removed] = newFields.splice(oldIndex, 1)
    newFields.splice(newIndex, 0, removed)

    onReorderFields(newFields)
  }

  const handleSaveField = (field: any) => {
    if (editingField && onUpdateField) {
      onUpdateField(field.id, field)
    } else {
      onAddField(field)
    }
    setEditingField(null)
    setIsCreating(false)
  }

  const handleConfirmDelete = () => {
    if (deleteFieldId && onRemoveField) {
      onRemoveField(deleteFieldId)
      setDeleteFieldId(null)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <FormBuilderHeader
          title={formTitle}
          description={formDescription}
          version={config.version}
          fieldsCount={sortedFields.length}
          onAddField={() => setIsCreating(true)}
          onPreview={onPreview}
          onSaveForm={onSaveForm}
        />

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-sm text-blue-800 dark:text-blue-200">
            <strong className="font-semibold">Dica:</strong> Arraste os campos pelo ícone para reordená-los. Clique no lápis para editar ou na lixeira para excluir.
          </div>

          <FieldsList
            fields={sortedFields}
            onEdit={setEditingField}
            onDelete={setDeleteFieldId}
            onReorder={handleDragEnd}
            typeLabels={FIELD_TYPE_LABELS}
            typeColors={FIELD_TYPE_COLORS}
          />
        </div>
      </div>

      <FieldEditor
        field={editingField}
        isOpen={isCreating || !!editingField}
        onClose={() => {
          setEditingField(null)
          setIsCreating(false)
        }}
        onSave={handleSaveField}
      />

      <Dialog open={!!deleteFieldId} onOpenChange={() => setDeleteFieldId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir campo?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tem certeza que deseja excluir o campo "{fieldToDelete?.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteFieldId(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}