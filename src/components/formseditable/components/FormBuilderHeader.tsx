"use client"

import { Button } from "@/components/ui/button"
import { Plus, History, Eye, Save } from "lucide-react"

interface FormBuilderHeaderProps {
  title?: string
  description?: string
  version: string
  fieldsCount: number
  onAddField: () => void
  onSaveForm?: () => void
  onPreview?: () => void
}

export function FormBuilderHeader({ title, description, version, fieldsCount, onAddField, onSaveForm, onPreview }: FormBuilderHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#15409c]/10 to-[#15409c]/5 dark:from-[#15409c]/20 dark:to-[#15409c]/10 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl lg:text-2xl">
              {title || "Novo Formulário"}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-[#15409c]/30 dark:border-[#15409c]/40">
              <History className="h-3.5 w-3.5 text-[#15409c]" />
              <span className="text-xs font-medium text-[#15409c] dark:text-[#15409c]">
                v{version}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#15409c] rounded-full"></div>
              {fieldsCount} campo{fieldsCount !== 1 ? "s" : ""} configurado{fieldsCount !== 1 ? "s" : ""}
            </span>
            {description && (
              <span className="hidden sm:block">• {description}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {onPreview && (
            <Button 
              onClick={onPreview} 
              variant="outline" 
              className="gap-2 px-4 py-2.5 text-sm font-medium border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-600"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Visualizar</span>
              <span className="sm:hidden">Ver</span>
            </Button>
          )}
          
          <Button 
            onClick={onAddField} 
            className="gap-2 px-4 py-2.5 text-sm font-medium bg-[#15409c] hover:bg-[#15409c]/90 text-white shadow-theme-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Campo</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
          
          {onSaveForm && (
            <Button 
              onClick={onSaveForm} 
              className="gap-2 px-4 py-2.5 text-sm font-medium bg-success-500 hover:bg-success-600 text-white shadow-theme-sm"
            >
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