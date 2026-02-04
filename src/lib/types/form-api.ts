export interface FormTemplate {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface FormTemplateVersion {
  id: string
  templateId: string
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  questions?: QuestionForm[]
}

export interface QuestionForm {
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

export interface CreateFormTemplateDto {
  name: string
}

export interface CreateFormTemplateVersionDto {
  templateId: string
}

export interface CreateQuestionFormDto {
  title: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'OPTION' | 'CHECKBOX'
  required?: boolean
  options?: {
    options?: string[]
    min?: number
    max?: number
  }
  versionId: string
  order?: number
}

export interface UpdateQuestionFormDto {
  title?: string
  required?: boolean
  order?: number
  options?: {
    options?: string[]
    min?: number
    max?: number
  }
}

export interface ReorderQuestionsDto {
  versionId: string
  questionIds: string[]
}