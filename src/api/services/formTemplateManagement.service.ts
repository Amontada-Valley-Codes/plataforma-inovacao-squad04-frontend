import { formTemplateService } from './formTemplate.service'
import { formTemplateVersionService } from './formTemplateVersion.service'
import { formTemplatePayload, UpdateFormTemplatePayload } from '../payloads/formTemplate.payload'
import { FormTemplateVersionPayload, ReorderQuestionsPayload } from '../payloads/formTemplateVersion.payload'

export class FormTemplateManagementService {
  private formTemplateService = new formTemplateService()
  private formTemplateVersionService = new formTemplateVersionService()

  // Form Template operations
  async createFormTemplate(payload: formTemplatePayload) {
    return await this.formTemplateService.createFormTemplate(payload)
  }

  async getFormTemplates() {
    return await this.formTemplateService.getFormTemplates()
  }

  async getFormTemplateById(id: string) {
    return await this.formTemplateService.getFormTemplateById(id)
  }

  async updateFormTemplate(id: string, payload: UpdateFormTemplatePayload) {
    return await this.formTemplateService.updateFormTemplate(id, payload)
  }

  async deleteFormTemplate(id: string) {
    return await this.formTemplateService.deleteFormTemplate(id)
  }

  // Form Template Version operations
  async createFormTemplateVersion(payload: FormTemplateVersionPayload) {
    return await this.formTemplateVersionService.createFormTemplateVersion(payload)
  }

  async getFormTemplateVersions(templateId: string) {
    return await this.formTemplateVersionService.getFormTemplateVersions(templateId)
  }

  async activateFormTemplateVersion(id: string) {
    return await this.formTemplateVersionService.activateFormTemplateVersion(id)
  }

  async deactivateFormTemplateVersion(id: string) {
    return await this.formTemplateVersionService.deactivateFormTemplateVersion(id)
  }

  async deleteFormTemplateVersion(id: string) {
    return await this.formTemplateVersionService.deleteFormTemplateVersion(id)
  }

  async reorderQuestions(payload: ReorderQuestionsPayload) {
    return await this.formTemplateVersionService.reorderQuestions(payload)
  }
}