"use client"

import { useState } from "react"
import CardDesafio from "@/components/challenge/CardDesafios"
import Button from "@/components/ui/button/Button"
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

export default function DesafiosPage(){
    const [isModalOpen, setIsModalOpen] = useState(false)
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
            <div className="p-6">
                <FormBuilderContainer 
                    template={currentForm.template}
                    version={currentForm.version}
                    onBack={handleBackToList}
                />
            </div>
        )
    }

    return(
        <div>
            
            <div className="flex justify-between mt-3">

                <div>
                    <h1 className="text-3xl">Formulário Editável</h1>
                    <p className="">Crie seu formulário</p>
                </div>
                    
                <div>
                    <Button 
                        className="w-40 rounded h-10" 
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Criar Formulário
                    </Button>
                    
                </div>

            </div>

            <div className="grid grid-cols-3 "> 
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captat ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captat ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captat ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captat ideai de uma empresa de supermercado"/>
            </div>

            <FormCreatorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFormCreated={handleFormCreated}
            />
            
        </div>
    )
}