import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { FormTemplateVersionPayload, ReorderQuestionsPayload } from "../payloads/formTemplateVersion.payload";

export class formTemplateVersionService {

  async createFormTemplateVersion(payload: FormTemplateVersionPayload) {
    const { data } = await api.post(ENDPOINTS.FORM_TEMPLATE_VERSIONS.CREATE_VERSION(payload.templateId));
    return data;
  }

  async getFormTemplateVersions(templateId: string) {
    const { data } = await api.get(ENDPOINTS.FORM_TEMPLATE_VERSIONS.GET_VERSIONS_BY_TEMPLATE(templateId));
    return data;
  }

  async activateFormTemplateVersion(id: string) {
    const { data } = await api.put(ENDPOINTS.FORM_TEMPLATE_VERSIONS.ACTIVATE_VERSION(id));
    return data;
  }

  async deactivateFormTemplateVersion(id: string) {
    const { data } = await api.put(ENDPOINTS.FORM_TEMPLATE_VERSIONS.DEACTIVATE_VERSION(id));
    return data;
  }

  async deleteFormTemplateVersion(id: string) {
    const { data } = await api.delete(ENDPOINTS.FORM_TEMPLATE_VERSIONS.DELETE_FORM_VERSION(id));
    return data;
  }

  async reorderQuestions(payload: ReorderQuestionsPayload) {
    const { data } = await api.patch(ENDPOINTS.QUESTION_FORM.REORDER_QUESTIONS, payload);
    return data;
  }

}