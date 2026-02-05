"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FieldEditorForm } from "./components/FieldEditorForm"

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

interface FieldEditorProps {
  field: QuestionForm | null
  isOpen: boolean
  onClose: () => void
  onSave: (field: any) => void
}

type FieldType = 'TEXT' | 'NUMBER' | 'SELECT' | 'OPTION' | 'CHECKBOX'

const FIELD_TYPES: { value: FieldType; label: string; description: string }[] = [
  { value: "TEXT", label: "Texto", description: "Campo de texto simples" },
  { value: "NUMBER", label: "Número", description: "Apenas valores numéricos" },
  { value: "SELECT", label: "Seleção Única", description: "Dropdown com uma opção" },
  { value: "OPTION", label: "Múltipla Escolha", description: "Checkbox com várias opções" },
  { value: "CHECKBOX", label: "Checkbox", description: "Campo de checkbox" },
]

function getInitialFormData(field: QuestionForm | null): any {
  if (field) {
    return {
      id: field.id,
      label: field.title,
      type: field.type,
      required: field.required,
      options: field.options?.options || []
    }
  }
  return {
    label: "",
    type: "TEXT",
    required: false,
    options: [],
  }
}

export function FieldEditor({ field, isOpen, onClose, onSave }: FieldEditorProps) {
  const isEditing = !!field
  const [formData, setFormData] = useState<any>(getInitialFormData(field))
  const [newOption, setNewOption] = useState("")

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(field))
      setNewOption("")
    }
  }, [isOpen, field])

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      handleChange("options", [...(formData.options || []), newOption.trim()])
      setNewOption("")
    }
  }

  const handleRemoveOption = (index: number) => {
    handleChange(
      "options",
      (formData.options || []).filter((_: any, i: number) => i !== index),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Campo" : "Adicionar Novo Campo"}
          </DialogTitle>
        </DialogHeader>
        <FieldEditorForm
          formData={formData}
          isEditing={isEditing}
          newOption={newOption}
          onFormDataChange={handleChange}
          onNewOptionChange={setNewOption}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onSubmit={handleSubmit}
          onCancel={onClose}
          fieldTypes={FIELD_TYPES}
        />
      </DialogContent>
    </Dialog>
  )
}
