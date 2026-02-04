import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export class formTemplateVersionService {

  async createFormTemplateVersion(id: string) {
    const { data } = await api.post(ENDPOINTS.FORM_TEMPLATE_VERSIONS.CREATE_VERSION(id));
    return data;
  }

  async activteFormTemplateVersion(id: string) {
    const { data } = await api.patch(ENDPOINTS.FORM_TEMPLATE_VERSIONS.ACTIVATE_VERSION(id));
    return data;
  }

  async deactivateFormTemplateVersion(id: string) {
    const { data } = await api.patch(ENDPOINTS.FORM_TEMPLATE_VERSIONS.DEACTIVATE_VERSION(id));
    return data;
  }

}