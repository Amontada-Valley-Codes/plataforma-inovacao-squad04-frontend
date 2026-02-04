import { questionFormService } from './questionForm.service'
import { FormQuestionPayload, UpdateQuestionPayload } from '../payloads/questionForm.payload'

export class FormFieldsService {
  private questionFormService = new questionFormService()

  async createQuestionForm(versionId: string, payload: FormQuestionPayload) {
    return await this.questionFormService.createQuestionForm(versionId, payload)
  }

  async getQuestionsByVersion(versionId: string) {
    return await this.questionFormService.getQuestionFormById(versionId)
  }

  async updateQuestionForm(id: string, payload: UpdateQuestionPayload) {
    return await this.questionFormService.updateQuestionForm(id, payload)
  }

  async deleteQuestionForm(id: string) {
    return await this.questionFormService.deleteQuestionForm(id)
  }
}