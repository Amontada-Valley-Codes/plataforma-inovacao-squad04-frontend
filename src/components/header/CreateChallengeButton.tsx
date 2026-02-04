"use client";
import { BookPlus, PlusCircle } from "lucide-react";
import { useState } from "react";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";
import { FormCreatorModal } from "@/components/formseditable/FormCreatorModal";
import { FormBuilderContainer } from "@/components/formseditable/FormBuilderContainer";

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

export default function CreateChallengeButton() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [currentForm, setCurrentForm] = useState<{
    template: FormTemplate
    version: FormTemplateVersion
  } | null>(null)

  const handleFormCreated = (template: FormTemplate, version: FormTemplateVersion) => {
    setCurrentForm({ template, version })
  }

  const handleBackToList = () => {
    setCurrentForm(null)
  }

  if (currentForm) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="p-6">
          <FormBuilderContainer 
            template={currentForm.template}
            version={currentForm.version}
            onBack={handleBackToList}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button 
        onClick={openModal}
        size="sm"
      >
        <BookPlus />
        Criar Desafio
      </Button>

      <Button 
        className="w-45 rounded h-12" 
        variant="primary"
        onClick={() => setIsFormModalOpen(true)}
      >
        <PlusCircle />
        Criar Formulário
      </Button>

      <RegisterChallengeForm isOpen={isOpen} onClose={closeModal} />
      
      <FormCreatorModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onFormCreated={handleFormCreated}
      />
    </div>
  );
}