"use client"

import { Button } from "@/components/ui/button"
import { Plus, History, Eye, Save } from "lucide-react"

interface FormBuilderHeaderProps {
  title?: string
  description?: string
  version: number
  fieldsCount: number
  onAddField: () => void
  onPreview?: () => void
  onSaveForm?: () => void
}

export function FormBuilderHeader({ title, description, version, fieldsCount, onAddField, onPreview, onSaveForm }: FormBuilderHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-blue dark:text-white text-lg sm:text-xl lg:text-[22px] mb-1">
            {title || "Novo Formulário"}
          </h4>
        
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            Versão {version} - {fieldsCount} campo{fieldsCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onPreview && (
            <Button onClick={onPreview} variant="outline" className="gap-2 px-4 sm:px-6 text-sm">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Visualizar</span>
            </Button>
          )}
          <Button onClick={onAddField} className="gap-2 px-4 sm:px-6 text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Campo</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
          {onSaveForm && (
            <Button onClick={onSaveForm} className="gap-2 px-4 sm:px-6 text-sm">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Salvar Formulário</span>
              <span className="sm:hidden">Salvar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
