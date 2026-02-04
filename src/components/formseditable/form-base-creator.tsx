"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormBaseCreatorProps {
  onSubmit: (data: FormBaseData) => void
  onCancel: () => void
}

export interface FormBaseData {
  title: string
  description: string
  version: string
  stage: string
}

const STAGES = [
  { value: "GENERATION", label: "Geração" },
  { value: "PRE_SCREENING", label: "Pré-triagem" },
  { value: "DETAILED_SCREENING", label: "Triagem Detalhada" },
  { value: "MATERIALIZATION", label: "Materialização" },
  { value: "EXPERIMENTATION", label: "Experimentação" },
  { value: "SCALE", label: "Escala" },
]

export function FormBaseCreator({ onSubmit, onCancel }: FormBaseCreatorProps) {
  const [formData, setFormData] = useState<FormBaseData>({
    title: "",
    description: "",
    version: "1.0",
    stage: "PRE_SCREENING",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Formulário *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Cadastro de Ideias"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva o objetivo deste formulário"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="version">Versão</Label>
        <Input
          id="version"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          placeholder="1.0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Etapa *</Label>
        <select
          id="stage"
          value={formData.stage}
          onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          {STAGES.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="default">
          Criar Formulário
        </Button>
      </div>
    </form>
  )
}
