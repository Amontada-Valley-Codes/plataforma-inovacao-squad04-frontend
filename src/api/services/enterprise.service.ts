import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateEnterprisePayload, CreateEnterpriseResponse, ShowAllEnterpriseResponse, ShowOneEnterpriseResponse } from "../payloads/enterprise.payload";

export const enterpriseService = {
  async createEnterprise(createEnterprisePayload: CreateEnterprisePayload): Promise<CreateEnterpriseResponse> {
    const response = await api.post(ENDPOINTS.ENTERPRISE.CREATE, createEnterprisePayload);
    console.log(response.data);
    return response.data
  },

  async showAllEnterprises(): Promise<ShowAllEnterpriseResponse[]> {
    const response = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ALL);
    console.log(response.data);
    return response.data;
  },

  async showOneEnterprises(id: string): Promise<ShowOneEnterpriseResponse> {
    const response = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ONE_ENTERPRISE(id));
    console.log(response.data);
    return response.data;
  }
};