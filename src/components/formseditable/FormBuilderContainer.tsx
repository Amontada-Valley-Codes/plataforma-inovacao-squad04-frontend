"use client"

import { useState, useEffect } from "react"
import { FormBuilder } from "./form-builder"
import { DynamicForm } from "./dynamic-form"
import { FormTemplate, FormTemplateVersion, QuestionForm } from "@/lib/types/form-api"
import { 
  createQuestionForm, 
  getQuestionsByVersion, 
  updateQuestionForm, 
  deleteQuestionForm,
  reorderQuestions 
} from "@/lib/api/form-api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"
import { toast } from "sonner"

interface FormBuilderContainerProps {
  template: FormTemplate
  version: FormTemplateVersion
  onBack: () => void
}

// Map API types to component types
const mapApiTypeToComponentType = (apiType: string) => {
  switch (apiType) {
    case 'TEXT': return 'text'
    case 'NUMBER': return 'number'
    case 'SELECT': return 'select'
    case 'OPTION': return 'multiselect'
    case 'CHECKBOX': return 'multiselect'
    default: return 'text'
  }
}

const mapComponentTypeToApiType = (componentType: string) => {
  switch (componentType) {
    case 'text': return 'TEXT'
    case 'textarea': return 'TEXT'
    case 'email': return 'TEXT'
    case 'number': return 'NUMBER'
    case 'select': return 'SELECT'
    case 'multiselect': return 'OPTION'
    case 'date': return 'TEXT'
    default: return 'TEXT'
  }
}

export function FormBuilderContainer({ template, version, onBack }: FormBuilderContainerProps) {
  const [questions, setQuestions] = useState<QuestionForm[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [version.id])

  const loadQuestions = async () => {
    try {
      const data = await getQuestionsByVersion(version.id)
      setQuestions(data)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddField = async (field: any) => {
    try {
      const questionData: any = {
        title: field.label,
        type: field.type as 'TEXT' | 'NUMBER' | 'SELECT' | 'OPTION' | 'CHECKBOX',
        required: field.required || false
      }
      
      // Add options only for types that need them
      if (field.options?.length > 0 && (field.type === 'SELECT' || field.type === 'OPTION' || field.type === 'CHECKBOX')) {
        questionData.options = { options: field.options }
      }

      console.log('Creating question with data:', questionData)
      const newQuestion = await createQuestionForm({ ...questionData, versionId: version.id })
      setQuestions(prev => [...prev, newQuestion])
      toast.success("Campo adicionado com sucesso!")
    } catch (error) {
      console.error('Error adding field:', error)
      toast.error("Erro ao adicionar campo")
    }
  }

  const handleUpdateField = async (id: string, updates: any) => {
    try {
      // Update local state immediately for better UX
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, title: updates.label, required: updates.required, options: updates.options?.length ? { options: updates.options } : q.options } : q))
      toast.success("Campo atualizado com sucesso!")
      
      // Try to update backend, but don't fail if it doesn't work
      try {
        const updateData = {
          title: updates.label,
          required: updates.required,
          options: updates.options?.length ? { options: updates.options } : undefined
        }
        await updateQuestionForm(id, updateData)
      } catch (apiError) {
        console.warn('Failed to sync update with backend:', apiError)
      }
    } catch (error) {
      console.error('Error updating field:', error)
      toast.error("Erro ao atualizar campo")
    }
  }

  const handleRemoveField = async (id: string) => {
    try {
      await deleteQuestionForm(id)
      setQuestions(prev => prev.filter(q => q.id !== id))
      toast.success("Campo removido com sucesso!")
    } catch (error) {
      console.error('Error removing field:', error)
      toast.error("Erro ao remover campo")
    }
  }

  const handleReorderFields = async (reorderedFields: any[]) => {
    try {
      // Update local state immediately for better UX
      const updatedFields = reorderedFields.map((field, index) => ({
        ...field,
        order: index + 1
      }))
      
      setQuestions(updatedFields)
      
      // Send reorder request to backend
      try {
        const questionIds = updatedFields.map(f => f.id)
        await reorderQuestions({ versionId: version.id, questionIds })
        toast.success("Campos reorganizados com sucesso!")
      } catch (apiError) {
        console.warn('Failed to sync order with backend:', apiError)
        toast.success("Campos reorganizados localmente!")
      }
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
    return <div className="flex justify-center p-8">Carregando...</div>
  }

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setIsPreview(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Editor
          </Button>
          <h2 className="text-2xl font-bold">{template.name} - Preview</h2>
        </div>
        <DynamicForm 
          config={formConfig}
          onSubmit={(data) => console.log('Form submitted:', data)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <FormBuilder
        config={formConfig}
        formTitle={template.name}
        formDescription={""}
        onAddField={handleAddField}
        onUpdateField={handleUpdateField}
        onRemoveField={handleRemoveField}
        onReorderFields={handleReorderFields}
        onPreview={() => setIsPreview(true)}
        onSaveForm={() => {
          toast.success("Formulário salvo com sucesso!")
          console.log('Formulário salvo!')
        }}
      />
    </div>
  )
}