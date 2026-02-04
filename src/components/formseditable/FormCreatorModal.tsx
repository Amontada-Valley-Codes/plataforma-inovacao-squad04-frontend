"use client"

import { useState } from "react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    setIsCreating(true)
    try {
      const templatePayload: formTemplatePayload = { name: formName.trim() }
      const template = await templateService.createFormTemplate(templatePayload)
      
      const versionPayload: FormTemplateVersionPayload = { templateId: template.id }
      const version = await templateService.createFormTemplateVersion(versionPayload)
      
      toast.success("Formulário criado com sucesso!")
      onFormCreated(template, version)
      setFormName("")
      onClose()
    } catch (error) {
      console.error('Error creating form:', error)
      toast.error("Erro ao criar formulário")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Formulário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formName">Nome do Formulário *</Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ex: Formulário de Inscrição"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !formName.trim()}>
              {isCreating ? "Criando..." : "Criar Formulário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}