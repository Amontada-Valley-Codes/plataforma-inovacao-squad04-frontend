"use client"

import { useState } from "react"
import { FormCreatorModal } from "@/components/formseditable/FormCreatorModal"
import { FormBuilderContainer } from "@/components/formseditable/FormBuilderContainer"

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

export default function FormBuilderPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [currentForm, setCurrentForm] = useState<{
    template: FormTemplate
    version: FormTemplateVersion
  } | null>(null)

  const handleFormCreated = (template: FormTemplate, version: FormTemplateVersion) => {
    setCurrentForm({ template, version })
    setIsModalOpen(false)
  }

  const handleBackToModal = () => {
    setCurrentForm(null)
    setIsModalOpen(true)
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
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Construtor de Formulários
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crie formulários personalizados de forma rápida e intuitiva
          </p>
        </div>
      </div>

      <FormCreatorModal 
        isOpen={isModalOpen}
        onClose={() => window.history.back()}
        onFormCreated={handleFormCreated}
      />
    </div>
  )
}