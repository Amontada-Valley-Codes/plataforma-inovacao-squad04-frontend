"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormTemplateManagementService } from "@/api/services/formTemplateManagement.service"
import { formTemplatePayload } from "@/api/payloads/formTemplate.payload"
import { FormTemplateVersionPayload } from "@/api/payloads/formTemplateVersion.payload"
import { toast } from "sonner"

interface FormTemplate {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface FormTemplateVersion {
  id: string
  templateId: string
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  onFormCreated: (template: FormTemplate, version: FormTemplateVersion) => void
}

const templateService = new FormTemplateManagementService()

export function FormCreatorModal({ isOpen, onClose, onFormCreated }: FormCreatorModalProps) {
  const [formName, setFormName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [existingTemplates, setExistingTemplates] = useState<FormTemplate[]>([])

  useEffect(() => {
  if (isOpen) {
    templateService.getFormTemplates() 
      .then((templates: FormTemplate[]) => setExistingTemplates(templates))
      .catch((error) => console.error(error))
  }
}, [isOpen])
  


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const trimmedName = formName.trim()
  if (!trimmedName) return

  
  const alreadyExists = existingTemplates.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())
  if (alreadyExists) {
    toast.error("Já existe um formulário com esse nome!")
    return
  }

  setIsCreating(true)
  try {
    const templatePayload: formTemplatePayload = { name: trimmedName }
    const template = await templateService.createFormTemplate(templatePayload)
    
    const versionPayload: FormTemplateVersionPayload = { templateId: template.id }
    const version = await templateService.createFormTemplateVersion(versionPayload)
    
    toast.success("Formulário criado com sucesso!")
    onFormCreated(template, version)
    setFormName("")
   
    setExistingTemplates(prev => [...prev, template])
  } catch (error) {
    console.error('Error creating form:', error)
    toast.error("Erro ao criar formulário")
  } finally {
    setIsCreating(false)
  }
}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-theme-lg">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Criar Novo Formulário
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label htmlFor="formName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Formulário *
            </Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ex: Formulário de Inscrição"
              className="h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-brand-500 focus:ring-brand-500"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2.5 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !formName.trim()}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Criando..." : "Criar Formulário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}