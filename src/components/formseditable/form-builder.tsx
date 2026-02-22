"use client"

import { useState } from "react"
import type { DragEndEvent } from "@dnd-kit/core"
import { FormBuilderHeader } from "./components/FormBuilderHeader"
import { FieldsList } from "./components/FieldsList"
import { FieldEditor } from "./field-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface FormBuilderProps {
  config: any
  formTitle?: string
  formDescription?: string
  onAddField: (field: any) => void
  onUpdateField?: (id: string, updates: any) => void
  onRemoveField?: (id: string) => void
  onReorderFields?: (fields: any[]) => void
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
  TEXT: "bg-blue-light-100 text-blue-light-700 dark:bg-blue-light-900/30 dark:text-blue-light-400",
  NUMBER: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  SELECT: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  OPTION: "bg-theme-pink-100 text-theme-pink-700 dark:bg-theme-pink-900/30 dark:text-theme-pink-400",
  CHECKBOX: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
}

export function FormBuilder({ config, formTitle, formDescription, onAddField, onUpdateField, onRemoveField, onReorderFields, onSaveForm }: FormBuilderProps) {
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-lg overflow-hidden">
        <FormBuilderHeader
          title={formTitle}
          description={formDescription}
          version={config.version}
          fieldsCount={sortedFields.length}
          onAddField={() => setIsCreating(true)}
          onSaveForm={onSaveForm}
        />

        <div className="p-6">
          <div className="bg-gradient-to-r from-[#15409c]/10 to-[#15409c]/5 dark:from-[#15409c]/3 dark:to-[#15409c]/20 border border-[#15409c]/30 dark:border-[#15409c]/40 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-[#15409c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#15409c] dark:text-[#15409c]">
                  Como usar o editor
                </p>
                <p className="text-xs text-[#15409c]/80 dark:text-[#15409c]/90 leading-relaxed">
                  Use as opções de reorganizar, editar e excluir para gerenciar os campos.
                </p>
              </div>
            </div>
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
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <div className="w-10 h-10 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              Excluir campo?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Tem certeza que deseja excluir o campo <span className="font-semibold text-gray-900 dark:text-white">"{fieldToDelete?.title}"</span>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteFieldId(null)}
                className="px-4 py-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-error-500 hover:bg-error-600 text-white font-medium"
              >
                Excluir Campo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}