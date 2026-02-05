"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FormBuilder } from "./form-builder"
import { FormTemplateManagementService } from "@/api/services/formTemplateManagement.service"
import { FormFieldsService } from "@/api/services/formFields.service"
import { FormQuestionPayload, UpdateQuestionPayload } from "@/api/payloads/questionForm.payload"
import { ReorderQuestionsPayload } from "@/api/payloads/formTemplateVersion.payload"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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

interface FormBuilderContainerProps {
  template: FormTemplate
  version: FormTemplateVersion
  onBack: () => void
}

const templateService = new FormTemplateManagementService()
const fieldsService = new FormFieldsService()

export function FormBuilderContainer({ template, version, onBack }: FormBuilderContainerProps) {
  const [questions, setQuestions] = useState<QuestionForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadQuestions()
  }, [version.id])

  const loadQuestions = async () => {
    try {
      const data = await fieldsService.getQuestionsByVersion(version.id)
      setQuestions(data)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddField = async (field: any) => {
    try {
      const questionPayload: FormQuestionPayload = {
        title: field.label,
        type: field.type as 'TEXT' | 'NUMBER' | 'SELECT' | 'OPTION' | 'CHECKBOX',
        required: field.required || false
      }
      
      // Add options only for types that need them
      if (field.options?.length > 0 && (field.type === 'SELECT' || field.type === 'OPTION' || field.type === 'CHECKBOX')) {
        questionPayload.options = { options: field.options }
      }

      console.log('Creating question with data:', questionPayload)
      const newQuestion = await fieldsService.createQuestionForm(version.id, questionPayload)
      setQuestions(prev => [...prev, newQuestion])
      toast.success("Campo adicionado com sucesso!")
    } catch (error) {
      console.error('Error adding field:', error)
      toast.error("Erro ao adicionar campo")
    }
  }

  const handleUpdateField = async (id: string, updates: any) => {
    try {
      const updatePayload: UpdateQuestionPayload = {
        title: updates.label,
        required: updates.required,
        options: updates.options?.length ? { options: updates.options } : undefined
      }
      await fieldsService.updateQuestionForm(id, updatePayload)
      
      // Update local state only after successful API call
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, title: updates.label, required: updates.required, options: updates.options?.length ? { options: updates.options } : q.options } : q))
      toast.success("Campo atualizado com sucesso!")
    } catch (error) {
      console.error('Error updating field:', error)
      toast.error("Erro ao atualizar campo")
    }
  }

  const handleRemoveField = async (id: string) => {
    try {
      await fieldsService.deleteQuestionForm(id)
      setQuestions(prev => prev.filter(q => q.id !== id))
      toast.success("Campo removido com sucesso!")
    } catch (error) {
      console.error('Error removing field:', error)
      toast.error("Erro ao remover campo")
    }
  }

  const handleReorderFields = async (reorderedFields: any[]) => {
    try {
      const questionIds = reorderedFields.map(f => f.id)
      const reorderPayload: ReorderQuestionsPayload = { versionId: version.id, questionIds }
      await templateService.reorderQuestions(reorderPayload)
      
      // Update local state only after successful API call
      const updatedFields = reorderedFields.map((field, index) => ({
        ...field,
        order: index + 1
      }))
      setQuestions(updatedFields)
      toast.success("Campos reorganizados com sucesso!")
    } catch (error) {
      console.error('Error reordering fields:', error)
      toast.error("Erro ao reorganizar campos")
    }
  }

  // Convert API questions to component format
  const formConfig = {
    version: version.version.toString(),
    fields: questions.map(q => ({
      id: q.id,
      name: q.title?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || `field_${q.id}`,
      label: q.title || 'Untitled Field',
      title: q.title || 'Untitled Field',
      type: q.type,
      required: q.required,
      order: q.order,
      options: q.options?.options || []
    }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/challenges')}
            className="gap-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <FormBuilder
            config={formConfig}
            formTitle={template.name}
            formDescription={""}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onRemoveField={handleRemoveField}
            onReorderFields={handleReorderFields}
            onSaveForm={() => {
              toast.success("Formulário salvo com sucesso!")
              console.log('Formulário salvo!')
              // Redirect to challenges page after saving
              router.push('/admin/challenges')
            }}
          />
        </div>
      </div>
    </div>
  )
}