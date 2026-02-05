export type QuestionType = "TEXT" | "NUMBER" | "SELECT" | "OPTION" | "CHECKBOX"

export type FormQuestionPayload = {
  title: string
  type: QuestionType
  required: boolean
  options?: {
    options?: string[]
    min?: number
    max?: number
  }
}

export type UpdateQuestionPayload = {
  title?: string
  required?: boolean
  order?: number
  options?: {
    options?: string[]
    min?: number
    max?: number
  }
}
