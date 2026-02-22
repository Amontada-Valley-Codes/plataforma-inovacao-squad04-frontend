"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FieldEditorFormProps {
  formData: any
  isEditing: boolean
  newOption: string
  onFormDataChange: (key: string, value: unknown) => void
  onNewOptionChange: (value: string) => void
  onAddOption: () => void
  onRemoveOption: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  fieldTypes: { value: string; label: string; description: string }[]
}

export function FieldEditorForm({
  formData,
  isEditing,
  newOption,
  onFormDataChange,
  onNewOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
  onCancel,
  fieldTypes,
}: FieldEditorFormProps) {
  const showOptions = formData.type === "SELECT" || formData.type === "OPTION"

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="type">Tipo de Campo *</Label>
          <Select value={formData.type} onValueChange={(value) => onFormDataChange("type", value)}>
  <SelectTrigger id="type" className="w-full h-10">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {fieldTypes.map((type) => (
      <SelectItem key={type.value} value={type.value}>
        {type.label} - {type.description}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="label">Rótulo (Pergunta) *</Label>
          <Input
            id="label"
            value={formData.label || ""}
            onChange={(e) => onFormDataChange("label", e.target.value)}
            placeholder="Ex: Qual o título da sua ideia?"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">O texto que será exibido para o usuário</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <Label htmlFor="required" className="font-medium text-sm">
              Campo Obrigatório
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">O usuário precisa preencher para enviar</p>
          </div>
          <Switch
            id="required"
            checked={formData.required || false}
            onCheckedChange={(checked) => onFormDataChange("required", checked)}
          />
        </div>

        {showOptions && (
          <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <div>
              <Label className="font-medium">Opções de Resposta</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Adicione as opções que o usuário poderá escolher</p>
            </div>
            <div className="flex gap-2">
              <Input
                value={newOption}
                onChange={(e) => onNewOptionChange(e.target.value)}
                placeholder="Digite uma opção e pressione Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    onAddOption()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={onAddOption} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.options && formData.options.length > 0 ? (
              <div className="space-y-2">
                {formData.options.map((option: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveOption(index)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">Nenhuma opção adicionada</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6">
          Cancelar
        </Button>
        <Button type="submit" variant="default" className="px-6 bg-[#15409c] hover:bg-[#15409c]/90">
          {isEditing ? "Salvar Alterações" : "Adicionar Campo"}
        </Button>
      </div>
    </form>
  )
}
