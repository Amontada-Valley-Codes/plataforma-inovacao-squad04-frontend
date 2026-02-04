"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createFormTemplate, createFormTemplateVersion } from "@/lib/api/form-api"
import { FormTemplate, FormTemplateVersion } from "@/lib/types/form-api"
import { toast } from "sonner"

interface FormCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  onFormCreated: (template: FormTemplate, version: FormTemplateVersion) => void
}

export function FormCreatorModal({ isOpen, onClose, onFormCreated }: FormCreatorModalProps) {
  const [formName, setFormName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    setIsCreating(true)
    try {
      const template = await createFormTemplate({ name: formName.trim() })
      const version = await createFormTemplateVersion({ templateId: template.id })
      
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