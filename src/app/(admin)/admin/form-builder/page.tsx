"use client"

import { useEffect, useState } from "react"
import { FormCreatorModal } from "@/components/formseditable/FormCreatorModal"
import { FormBuilderContainer } from "@/components/formseditable/FormBuilderContainer"
import { FormTemplateManagementService } from "@/api/services/formTemplateManagement.service"

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

const templateService = new FormTemplateManagementService()

export default function FormBuilderPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentForm, setCurrentForm] = useState<{
    template: FormTemplate
    version: FormTemplateVersion
  } | null>(null)
  const [templatesLoaded, setTemplatesLoaded] = useState(false)

  useEffect(() => {
   
    templateService.getFormTemplates()
      .then(async (templates: FormTemplate[]) => {
        if (templates.length === 0) {
        
          setIsModalOpen(true)
        } else {
     
          const template = templates[0] 
          const version = await templateService.createFormTemplateVersion({ templateId: template.id })
          setCurrentForm({ template, version })
        }
      })
      .catch((err: any) => {
        console.error(err)
      })
      .finally(() => setTemplatesLoaded(true))
  }, [])

  const handleFormCreated = (template: FormTemplate, version: FormTemplateVersion) => {
 
    setCurrentForm({ template, version })
    setIsModalOpen(false)
  }

  const handleBackToModal = () => {
    setCurrentForm(null)
    setIsModalOpen(true)
  }

  if (!templatesLoaded) {
 
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (currentForm) {
    return (
      <FormBuilderContainer 
        template={currentForm.template}
        version={currentForm.version}
        onBack={handleBackToModal}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <FormCreatorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormCreated={handleFormCreated}
      />
    </div>
  )
}
