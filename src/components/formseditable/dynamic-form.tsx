import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface DynamicFormProps {
  config: any
  onSubmit: (data: Record<string, unknown>) => void
  isSubmitting?: boolean
}

export function DynamicForm({ config, onSubmit, isSubmitting }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sortedFields = [...config.fields].sort((a, b) => a.order - b.order)

  const handleChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    sortedFields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name]
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = "Este campo é obrigatório"
        }
      }

      // Validação de email
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(String(formData[field.name]))) {
          newErrors[field.id] = "E-mail inválido"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const renderField = (field: any) => {
    const hasError = !!errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            defaultValue={String(formData[field.name] || "")}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={cn(
              "h-11 rounded-lg",
              hasError && "border-red-500"
            )}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={String(formData[field.name] || "")}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={cn(
              "min-h-[120px] rounded-lg resize-none",
              hasError && "border-red-500"
            )}
          />
        )

      case "select":
        return (
          <Select value={String(formData[field.name] || "")} onValueChange={(val) => handleChange(field.name, val)}>
            <SelectTrigger className={cn(
              "h-11 rounded-lg",
              hasError && "border-red-500"
            )}>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, idx: number) => (
                <SelectItem key={`${field.id}-${option}-${idx}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        const selectedValues = (formData[field.name] as string[]) || []
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, idx: number) => (
              <div key={`${field.id}-${option}-${idx}`} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleChange(field.name, [...selectedValues, option])
                    } else {
                      handleChange(
                        field.name,
                        selectedValues.filter((v) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${option}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            id={field.id}
            defaultValue={String(formData[field.name] || "")}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={cn(hasError && "border-destructive")}
          />
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-blue dark:text-white">Captura de Ideia</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preencha o formulário abaixo para registrar sua ideia. Campos marcados com * são obrigatórios.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {sortedFields.map((field) => (
              <div 
                key={field.id} 
                className={cn(
                  "space-y-2",
                  field.type === "textarea" && "md:col-span-2"
                )}
              >
                <Label 
                  htmlFor={field.id} 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-lg font-medium shadow-sm"
            >
              {isSubmitting ? "Enviando..." : "Submeter Ideia"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
