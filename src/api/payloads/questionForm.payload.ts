export type QuestionType = "TEXT" | "NUMBER" | "SELECT" | "MULTI_SELECT"

export type FormQuestionPayload = {
  title: string
  type: QuestionType
  required: boolean
  options?: {
    options: string[]
  }
}
