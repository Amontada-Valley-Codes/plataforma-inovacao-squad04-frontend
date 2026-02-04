import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { formTemplatePayload } from "../payloads/formTemplate.payload";

export class formTemplateService {

  async createFormTemplate(payload: formTemplatePayload) {
    const { data } = await api.post(ENDPOINTS.FORM_TEMPLATE.CREATE_TEMPLATE, payload);
    return data;
  }

  async getFormTemplates() {
    const { data } = await api.get(ENDPOINTS.FORM_TEMPLATE.GET_TEMPLATES);
    return data;
  }

  async getFormTemplateById(id: string) {
    const { data } = await api.get(ENDPOINTS.FORM_TEMPLATE.GET_TEMPLATE_BY_ID(id));
    return data;
  } 

}